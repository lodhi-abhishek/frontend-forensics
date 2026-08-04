"use client";

import { useEffect, useRef } from "react";
import styles from "./linear-next.module.css";
import { isLogoCellOccupied, LOGO_GRID_SIZE, LOGO_LAYOUT_SCALE } from "./particle-logo-mask";

const LOGICAL_SIZE = 500;
const DOT_OVERLAP = 0.5;
const RIPPLE_POOL_SIZE = 4;
const RIPPLE_MAX_RADIUS = 363.6;

export type ParticleLogoConfig = {
  springStrength: number;
  damping: number;
  interactionRadius: number;
  interactionStrength: number;
  rippleSpeed: number;
  rippleStrength: number;
  rippleBand: number;
  particleSize: number;
};

const DEFAULT_CONFIG: ParticleLogoConfig = {
  springStrength: 0.012,
  damping: 0.83,
  interactionRadius: 50,
  interactionStrength: 2.9,
  rippleSpeed: 7.8,
  rippleStrength: 1.35,
  rippleBand: 22,
  particleSize: 1,
};

type ParticleLayer = 0 | 1 | 2;

/** A particle retains its own physical state; no position arrays are replaced per frame. */
export class Particle {
  public x: number;
  public y: number;
  public velocityX = 0;
  public velocityY = 0;
  public accelerationX = 0;
  public accelerationY = 0;

  constructor(
    public readonly homeX: number,
    public readonly homeY: number,
    public readonly radius: number,
    public readonly color: string,
    public readonly layer: ParticleLayer,
  ) {
    this.x = homeX;
    this.y = homeY;
  }
}

class Ripple {
  public active = false;
  public x = 0;
  public y = 0;
  public radius = 0;
}

/**
 * Keeps input in the canvas' logical coordinate system. The filtered cursor
 * prevents high-frequency pointer events from translating into visual jitter.
 */
export class MouseController {
  public x = -1000;
  public y = -1000;
  public targetX = -1000;
  public targetY = -1000;
  public active = false;

  constructor(private readonly canvas: HTMLCanvasElement) {
    canvas.addEventListener("pointermove", this.onMove, { passive: true });
    canvas.addEventListener("pointerenter", this.onMove, { passive: true });
    canvas.addEventListener("pointerleave", this.onLeave, { passive: true });
  }

  public update() {
    // Exponential smoothing gives a continuous cursor force without lerping particles.
    this.x += (this.targetX - this.x) * 0.34;
    this.y += (this.targetY - this.y) * 0.34;
  }

  public destroy() {
    this.canvas.removeEventListener("pointermove", this.onMove);
    this.canvas.removeEventListener("pointerenter", this.onMove);
    this.canvas.removeEventListener("pointerleave", this.onLeave);
  }

  private onMove = (event: PointerEvent) => {
    const bounds = this.canvas.getBoundingClientRect();
    this.targetX = ((event.clientX - bounds.left) / bounds.width) * LOGICAL_SIZE;
    this.targetY = ((event.clientY - bounds.top) / bounds.height) * LOGICAL_SIZE;
    this.active = true;
  };

  private onLeave = () => {
    this.active = false;
  };
}

/** Owns particle state and all forces, leaving drawing to Renderer. */
export class ParticleSystem {
  public readonly particles: Particle[] = [];
  public readonly layers: Particle[][] = [[], [], []];
  private readonly ripples = Array.from({ length: RIPPLE_POOL_SIZE }, () => new Ripple());
  private nextRipple = 0;
  private activeRippleCount = 0;

  constructor(private readonly config: ParticleLogoConfig) {
    this.createLogoParticles();
  }

  public step(frameScale: number, mouse: MouseController) {
    mouse.update();

    this.activeRippleCount = 0;
    for (const ripple of this.ripples) {
      if (!ripple.active) continue;
      ripple.radius += this.config.rippleSpeed * frameScale;
      if (ripple.radius > RIPPLE_MAX_RADIUS) ripple.active = false;
      if (ripple.active) this.activeRippleCount += 1;
    }

    const damping = Math.pow(this.config.damping, frameScale);
    for (const particle of this.particles) {
      // Hooke's law: F = -kx. This gently restores each particle to its logo position.
      particle.accelerationX = (particle.homeX - particle.x) * this.config.springStrength;
      particle.accelerationY = (particle.homeY - particle.y) * this.config.springStrength;

      this.applyMouseForce(particle, mouse);
      if (this.activeRippleCount) this.applyRippleForces(particle, frameScale);

      // Semi-implicit Euler integrates acceleration before position, stable for damped springs.
      particle.velocityX = (particle.velocityX + particle.accelerationX * frameScale) * damping;
      particle.velocityY = (particle.velocityY + particle.accelerationY * frameScale) * damping;
      particle.x += particle.velocityX * frameScale;
      particle.y += particle.velocityY * frameScale;
    }
  }

  public emitRipple(x: number, y: number) {
    const ripple = this.ripples[this.nextRipple];
    this.nextRipple = (this.nextRipple + 1) % this.ripples.length;
    ripple.active = true;
    ripple.x = x;
    ripple.y = y;
    ripple.radius = 0;
  }

  private applyMouseForce(particle: Particle, mouse: MouseController) {
    if (!mouse.active) return;

    const dx = particle.x - mouse.x;
    const dy = particle.y - mouse.y;
    const distanceSquared = dx * dx + dy * dy;
    const radius = this.config.interactionRadius;
    if (distanceSquared >= radius * radius) return;

    const distance = Math.sqrt(distanceSquared) || 0.001;
    // A squared falloff makes the force soft at the edge and strong only near the cursor.
    const falloff = 1 - distance / radius;
    const force = falloff * falloff * this.config.interactionStrength;
    particle.accelerationX += (dx / distance) * force;
    particle.accelerationY += (dy / distance) * force;
  }

  private applyRippleForces(particle: Particle, frameScale: number) {
    for (const ripple of this.ripples) {
      if (!ripple.active) continue;
      const dx = particle.x - ripple.x;
      const dy = particle.y - ripple.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 0.001;
      const distanceFromWave = Math.abs(distance - ripple.radius);
      if (distanceFromWave >= this.config.rippleBand) continue;

      // A narrow moving band turns the click into a propagating impulse rather than a flash.
      const falloff = 1 - distanceFromWave / this.config.rippleBand;
      const impulse = falloff * falloff * this.config.rippleStrength * frameScale;
      particle.velocityX += (dx / distance) * impulse;
      particle.velocityY += (dy / distance) * impulse;
    }
  }

  private createLogoParticles() {
    const cellSize = (LOGICAL_SIZE * LOGO_LAYOUT_SCALE) / LOGO_GRID_SIZE;
    const offset = Math.round((LOGICAL_SIZE - LOGO_GRID_SIZE * cellSize) / 2);
    const radius = (cellSize * this.config.particleSize + DOT_OVERLAP) / 2;

    for (let index = 0; index < LOGO_GRID_SIZE * LOGO_GRID_SIZE; index += 1) {
      if (!isLogoCellOccupied(index)) continue;

      const column = index % LOGO_GRID_SIZE;
      const row = Math.floor(index / LOGO_GRID_SIZE);
      this.addParticle(
        offset + column * cellSize + cellSize / 2,
        offset + row * cellSize + cellSize / 2,
        radius,
      );
    }
  }

  private addParticle(x: number, y: number, radius: number) {
    const particle = new Particle(x, y, radius, "#000000", 0);
    this.particles.push(particle);
    this.layers[0].push(particle);
  }
}

/** Batches particles by layer without allocating render arrays per frame. */
export class Renderer {
  private width = 0;
  private height = 0;
  private dpr = 1;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D,
  ) {}

  public resize() {
    const bounds = this.canvas.getBoundingClientRect();
    this.width = Math.max(1, bounds.width);
    this.height = Math.max(1, bounds.height);
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
  }

  public render(system: ParticleSystem) {
    const scale = Math.min(this.width, this.height) / LOGICAL_SIZE;
    const offsetX = (this.width - LOGICAL_SIZE * scale) / 2;
    const offsetY = (this.height - LOGICAL_SIZE * scale) / 2;
    this.ctx.setTransform(this.dpr * scale, 0, 0, this.dpr * scale, this.dpr * offsetX, this.dpr * offsetY);
    this.ctx.clearRect(-offsetX / scale, -offsetY / scale, this.width / scale, this.height / scale);

    for (const layer of system.layers) {
      if (!layer.length) continue;
      this.ctx.fillStyle = layer[0].color;
      for (const particle of layer) {
        const diameter = particle.radius * 2;
        this.ctx.fillRect(
          particle.x - particle.radius,
          particle.y - particle.radius,
          diameter,
          diameter,
        );
      }
    }
  }
}

export function ParticleLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = new MouseController(canvas);
    const system = new ParticleSystem(DEFAULT_CONFIG);
    const renderer = new Renderer(canvas, context);
    const observer = new ResizeObserver(() => renderer.resize());
    observer.observe(canvas);
    renderer.resize();

    let animationFrame = 0;
    let previousTime = performance.now();
    const onClick = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      system.emitRipple(
        ((event.clientX - bounds.left) / bounds.width) * LOGICAL_SIZE,
        ((event.clientY - bounds.top) / bounds.height) * LOGICAL_SIZE,
      );
    };
    canvas.addEventListener("pointerdown", onClick, { passive: true });

    const animate = (time: number) => {
      // Limiting elapsed time prevents a background-tab pause from causing a physics jump.
      const frameScale = reducedMotion ? 1 : Math.min((time - previousTime) / 16.667, 2);
      previousTime = time;
      system.step(frameScale, mouse);
      renderer.render(system);
      if (!reducedMotion) animationFrame = requestAnimationFrame(animate);
    };
    animate(previousTime);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      mouse.destroy();
      canvas.removeEventListener("pointerdown", onClick);
    };
  }, []);

  return (
    <div className={styles.particleField}>
      <canvas ref={canvasRef} className={styles.mark} aria-label="Interactive particle logo" />
    </div>
  );
}
