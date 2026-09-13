"use client";

import { useEffect, useRef } from "react";
import { Group, InstancedMesh, Matrix4, MeshBasicMaterial, PerspectiveCamera, Scene, SphereGeometry, SRGBColorSpace, Vector3, WebGLRenderer } from "three";
import styles from "./hero-graphics.module.css";

// Match the reference's Fibonacci sphere, camera, particle size and rotation speed.
export function ParticleSphere() {
  const hostRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer: WebGLRenderer;
    try { renderer = new WebGLRenderer({ alpha: true, antialias: true }); }
    catch { return; }
    const scene = new Scene();
    const camera = new PerspectiveCamera(44, 1, .1, 20);
    camera.position.z = 3;
    const group = new Group();
    const geometry = new SphereGeometry(.02175, 4, 4);
    const material = new MeshBasicMaterial({ color: "#5b4dff", opacity: .94, transparent: true });
    const particles = new InstancedMesh(geometry, material, 200);
    const points: Vector3[] = [];
    const offsets: Vector3[] = [];
    const velocities: Vector3[] = [];
    const matrix = new Matrix4();
    for (let index = 0; index < 200; index++) {
      const y = 1 - index / 199 * 2;
      const radius = Math.sqrt(1 - y * y);
      const angle = Math.PI * (3 - Math.sqrt(5)) * index;
      const point = new Vector3(Math.cos(angle) * radius * .96, y * .96, Math.sin(angle) * radius * .96);
      points.push(point); offsets.push(new Vector3()); velocities.push(new Vector3());
      particles.setMatrixAt(index, matrix.setPosition(point));
    }
    particles.instanceMatrix.needsUpdate = true;
    group.add(particles); scene.add(group);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.className = styles.orbitCanvas;
    host.appendChild(renderer.domElement);
    let frame = 0, previous = performance.now(), rotation = 0;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0, inertiaX = 0, inertiaY = 0;
    let pointer: number | null = null, lastX = 0, lastY = 0;
    let cursor: { x: number; y: number } | null = null;
    let width = 1, height = 1;
    const world = new Vector3(), projected = new Vector3(), position = new Vector3();
    const draw = (now: number) => {
      const delta = Math.min(2, (now - previous) / (1000 / 60)); previous = now;
      if (!motion.matches && pointer === null) rotation += .009444444444 * delta;
      if (pointer === null) {
        targetX += inertiaX * delta; targetY += inertiaY * delta;
        inertiaX *= Math.pow(.804, delta); inertiaY *= Math.pow(.804, delta);
      }
      const easing = 1 - Math.pow(1 - .252, delta);
      currentX += (targetX - currentX) * easing; currentY += (targetY - currentY) * easing;
      group.rotation.set(-.18 + currentY, rotation + currentX, 0);
      group.updateMatrixWorld(true);
      points.forEach((point, index) => {
        const offset = offsets[index], velocity = velocities[index];
        if (cursor && !motion.matches) {
          world.copy(point).add(offset).applyMatrix4(group.matrixWorld);
          projected.copy(world).project(camera);
          const dx = cursor.x - (.5 * projected.x + .5) * width;
          const dy = cursor.y - (-.5 * projected.y + .5) * height;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < 75 && world.z > 0) {
            const force = (75 - distance) / 75 * 7.5 * .0018 * delta;
            offset.x -= dx / distance * force; offset.y += dy / distance * force;
          }
        }
        offset.addScaledVector(velocity, .1 * delta);
        velocity.multiplyScalar(Math.pow(.94, delta));
        offset.multiplyScalar(Math.pow(.94, delta) * (1 - .03 * delta));
        particles.setMatrixAt(index, matrix.setPosition(position.copy(point).add(offset)));
      });
      particles.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
      if (!motion.matches) frame = requestAnimationFrame(draw);
    };
    const resize = () => {
      width = Math.max(1, host.clientWidth); height = Math.max(1, host.clientHeight);
      camera.aspect = width / height; camera.updateProjectionMatrix();
      renderer.setSize(width, height, false); renderer.render(scene, camera);
    };
    const locate = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect(); cursor = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };
    const down = (event: PointerEvent) => {
      event.preventDefault(); event.stopPropagation(); pointer = event.pointerId;
      lastX = event.clientX; lastY = event.clientY; inertiaX = inertiaY = 0;
      locate(event); renderer.domElement.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      locate(event);
      if (pointer !== event.pointerId) return;
      const dx = event.clientX - lastX, dy = event.clientY - lastY;
      targetX += dx * .0105; targetY = Math.max(-.7, Math.min(.7, targetY + dy * .0105));
      inertiaX = dx * .0105 * .3; inertiaY = dy * .0105 * .3;
      lastX = event.clientX; lastY = event.clientY;
    };
    const up = (event: PointerEvent) => {
      if (pointer !== event.pointerId) return;
      pointer = null;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
    };
    const leave = () => { cursor = null; };
    const click = (event: MouseEvent) => {
      event.preventDefault(); event.stopPropagation();
      if (motion.matches) return;
      const bounds = host.getBoundingClientRect();
      points.forEach((point, index) => {
        projected.copy(point).add(offsets[index]).applyMatrix4(group.matrixWorld).project(camera);
        const distance = Math.hypot(event.clientX - bounds.left - (.5 * projected.x + .5) * width, event.clientY - bounds.top - (-.5 * projected.y + .5) * height);
        if (distance < 75) velocities[index].addScaledVector(position.copy(point).normalize(), (75 - distance) / 75 * .07);
      });
    };
    const updateMotion = () => { cancelAnimationFrame(frame); previous = performance.now(); draw(previous); };
    const observer = new ResizeObserver(resize); observer.observe(host);
    const canvas = renderer.domElement;
    canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("pointerleave", leave); canvas.addEventListener("click", click);
    motion.addEventListener("change", updateMotion);
    resize(); draw(previous);
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      motion.removeEventListener("change", updateMotion);
      canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("pointerleave", leave); canvas.removeEventListener("click", click);
      geometry.dispose(); material.dispose(); renderer.dispose(); canvas.remove();
    };
  }, []);
  return <span ref={hostRef} className={styles.orbitRoot} aria-hidden="true" />;
}
