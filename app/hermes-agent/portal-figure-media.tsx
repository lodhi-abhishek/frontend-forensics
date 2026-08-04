"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./hermes-agent.module.css";

type MediaMode = "poster" | "webm" | "stacked";

type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (
    callback: (now: number, metadata: unknown) => void,
  ) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

type PortalFigureMediaProps = {
  active: boolean;
  reducedMotion: boolean;
  poster: string;
  webm: string;
  stackedMp4: string;
};

function isAppleWebKit() {
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isIPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const isSafari =
    /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|FxiOS/i.test(ua);
  return isIOS || isIPadOS || isSafari;
}

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function PortalFigureMedia({
  active,
  reducedMotion,
  poster,
  webm,
  stackedMp4,
}: PortalFigureMediaProps) {
  const [mode, setMode] = useState<MediaMode>("poster");
  const [frameReady, setFrameReady] = useState(false);
  const webmRef = useRef<HTMLVideoElement>(null);
  const stackedRef = useRef<VideoWithFrameCallback>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const rendererRef = useRef<{ start: () => void; stop: () => void } | null>(
    null,
  );

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (reducedMotion) {
      setMode("poster");
      setFrameReady(false);
      return;
    }
    setMode(isAppleWebKit() ? "stacked" : "webm");
  }, [reducedMotion]);

  useEffect(() => {
    if (mode !== "webm") return;
    const video = webmRef.current;
    if (!video) return;

    if (active) {
      void video.play().catch(() => {
        setMode("poster");
        setFrameReady(false);
      });
    } else {
      video.pause();
    }
  }, [active, mode]);

  useEffect(() => {
    if (mode !== "stacked") return;

    const video = stackedRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      setMode("poster");
      return;
    }

    const vertexShader = createShader(
      gl,
      gl.VERTEX_SHADER,
      `#version 300 es
      in vec2 aPosition;
      out vec2 vUv;
      void main() {
        vUv = (aPosition + 1.0) * 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }`,
    );
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      `#version 300 es
      precision mediump float;
      uniform sampler2D uFrame;
      in vec2 vUv;
      out vec4 outColor;
      void main() {
        float y = (1.0 - vUv.y) * 0.5;
        vec3 color = texture(uFrame, vec2(vUv.x, y)).rgb;
        float alpha = texture(uFrame, vec2(vUv.x, 0.5 + y)).r;
        outColor = vec4(color, alpha);
      }`,
    );
    if (!vertexShader || !fragmentShader) {
      setMode("poster");
      return;
    }

    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    const texture = gl.createTexture();
    if (!program || !buffer || !texture) {
      setMode("poster");
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setMode("poster");
      return;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let animationFrame = 0;
    let videoFrame = 0;
    let destroyed = false;
    let running = false;
    let firstFrame = true;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const draw = () => {
      if (destroyed || !running || !activeRef.current) return;
      sizeCanvas();
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        try {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            video,
          );
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          if (firstFrame) {
            firstFrame = false;
            setFrameReady(true);
          }
        } catch {
          setMode("poster");
          return;
        }
      }
      schedule();
    };

    const schedule = () => {
      if (destroyed || !running || !activeRef.current) return;
      if (video.requestVideoFrameCallback) {
        videoFrame = video.requestVideoFrameCallback(() => draw());
      } else {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const start = () => {
      if (destroyed || running) return;
      running = true;
      void video.play().then(schedule).catch(() => {
        running = false;
        setMode("poster");
        setFrameReady(false);
      });
    };

    const stop = () => {
      running = false;
      video.pause();
      if (videoFrame && video.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(videoFrame);
        videoFrame = 0;
      }
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      stop();
      setMode("poster");
      setFrameReady(false);
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    rendererRef.current = { start, stop };
    if (activeRef.current) start();

    return () => {
      destroyed = true;
      stop();
      rendererRef.current = null;
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [mode]);

  useEffect(() => {
    if (mode !== "stacked") return;
    if (active) rendererRef.current?.start();
    else rendererRef.current?.stop();
  }, [active, mode]);

  const showPoster = mode === "poster" || !frameReady;

  return (
    <div className={styles.portalFigureMedia} aria-hidden="true">
      <img
        className={styles.portalFigurePoster}
        src={poster}
        alt=""
        width={1284}
        height={1590}
        data-visible={showPoster ? "true" : "false"}
      />
      {mode === "webm" && (
        <video
          ref={webmRef}
          className={styles.portalFigureVideo}
          muted
          loop
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          data-visible={frameReady ? "true" : "false"}
          onLoadedData={() => setFrameReady(true)}
          onError={() => {
            setMode("poster");
            setFrameReady(false);
          }}
        >
          <source src={webm} type="video/webm" />
        </video>
      )}
      {mode === "stacked" && (
        <>
          <video
            ref={stackedRef}
            className={styles.portalDecoder}
            src={stackedMp4}
            muted
            loop
            playsInline
            preload="metadata"
            crossOrigin="anonymous"
            onError={() => {
              setMode("poster");
              setFrameReady(false);
            }}
          />
          <canvas
            ref={canvasRef}
            className={styles.portalFigureCanvas}
            data-visible={frameReady ? "true" : "false"}
          />
        </>
      )}
    </div>
  );
}
