"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type HeroNebulaBackgroundProps = {
  className?: string;
  density?: "auto" | "compact" | "full";
  interactive?: boolean;
  reducedMotion?: boolean;
};

type ParticleProfile = {
  count: number;
  connectionDistance: number;
  drift: number;
  parallax: number;
};

export default function HeroNebulaBackground({
  className,
  density = "auto",
  interactive = true,
  reducedMotion = false,
}: HeroNebulaBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    if (!containerRef.current || webglFailed) return;

    const container = containerRef.current;
    const motionReduced = reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const profile = getParticleProfile(container.clientWidth, density, motionReduced);

    let renderer: THREE.WebGLRenderer | null = null;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, motionReduced ? 1.3 : 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = "hero-nebula-canvas";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    camera.position.z = 8;

    const root = new THREE.Group();
    const particlesGroup = new THREE.Group();
    const linesGroup = new THREE.Group();
    root.add(linesGroup);
    root.add(particlesGroup);
    scene.add(root);

    const positions = new Float32Array(profile.count * 3);
    const basePositions = new Float32Array(profile.count * 3);
    const colors = new Float32Array(profile.count * 3);
    const scales = new Float32Array(profile.count);
    const seeds = new Float32Array(profile.count);
    const particleColor = new THREE.Color();
    const warmColor = new THREE.Color("#7dd3fc");
    const accentColor = new THREE.Color("#8b5cf6");

    for (let index = 0; index < profile.count; index += 1) {
      const offset = index * 3;
      const x = THREE.MathUtils.randFloatSpread(7.6);
      const y = THREE.MathUtils.randFloatSpread(5.8);
      const z = THREE.MathUtils.randFloatSpread(1.4);

      positions[offset] = x;
      positions[offset + 1] = y;
      positions[offset + 2] = z;
      basePositions[offset] = x;
      basePositions[offset + 1] = y;
      basePositions[offset + 2] = z;
      seeds[index] = Math.random() * Math.PI * 2;
      scales[index] = THREE.MathUtils.randFloat(0.8, 1.6);

      particleColor.copy(warmColor).lerp(accentColor, Math.random() * 0.68);
      colors[offset] = particleColor.r;
      colors[offset + 1] = particleColor.g;
      colors[offset + 2] = particleColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: motionReduced ? 0.065 : 0.075,
      transparent: true,
      opacity: 0.95,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: createGlowTexture(),
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particlesGroup.add(particles);

    const linePairs = buildLinePairs(basePositions, profile.connectionDistance);
    const linePositions = new Float32Array(linePairs.length * 6);
    const lineColors = new Float32Array(linePairs.length * 6);
    const lineGeometry = new THREE.BufferGeometry();

    for (let index = 0; index < linePairs.length; index += 1) {
      const gradient = THREE.MathUtils.lerp(0.18, 0.42, Math.random());
      const colorA = warmColor.clone().lerp(accentColor, gradient);
      const colorB = accentColor.clone().lerp(warmColor, gradient * 0.72);
      const offset = index * 6;

      lineColors[offset] = colorA.r;
      lineColors[offset + 1] = colorA.g;
      lineColors[offset + 2] = colorA.b;
      lineColors[offset + 3] = colorB.r;
      lineColors[offset + 4] = colorB.g;
      lineColors[offset + 5] = colorB.b;
    }

    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: motionReduced ? 0.12 : 0.18,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    linesGroup.add(lines);

    const hazePlanes = createHazePlanes();
    hazePlanes.forEach((plane) => root.add(plane));

    const startedAt = window.performance.now();
    let frameId = 0;

    function syncLines() {
      for (let index = 0; index < linePairs.length; index += 1) {
        const [startIndex, endIndex] = linePairs[index];
        const startOffset = startIndex * 3;
        const endOffset = endIndex * 3;
        const lineOffset = index * 6;

        linePositions[lineOffset] = positions[startOffset];
        linePositions[lineOffset + 1] = positions[startOffset + 1];
        linePositions[lineOffset + 2] = positions[startOffset + 2];
        linePositions[lineOffset + 3] = positions[endOffset];
        linePositions[lineOffset + 4] = positions[endOffset + 1];
        linePositions[lineOffset + 5] = positions[endOffset + 2];
      }

      lineGeometry.attributes.position.needsUpdate = true;
    }

    function resize() {
      if (!renderer) return;

      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      const aspect = width / height;
      const frustumHeight = 6;

      camera.left = (-frustumHeight * aspect) / 2;
      camera.right = (frustumHeight * aspect) / 2;
      camera.top = frustumHeight / 2;
      camera.bottom = -frustumHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    function animate() {
      const elapsed = (window.performance.now() - startedAt) / 1000;
      const subtleWave = Math.sin(elapsed * 0.35) * 0.08;

      if (!motionReduced) {
        for (let index = 0; index < profile.count; index += 1) {
          const offset = index * 3;
          const seed = seeds[index];
          const waveX = Math.sin(elapsed * 0.2 + seed) * profile.drift * scales[index];
          const waveY = Math.cos(elapsed * 0.24 + seed * 1.35) * profile.drift * 0.82 * scales[index];
          const waveZ = Math.sin(elapsed * 0.12 + seed * 0.7) * 0.14;

          positions[offset] = basePositions[offset] + waveX;
          positions[offset + 1] = basePositions[offset + 1] + waveY + subtleWave;
          positions[offset + 2] = basePositions[offset + 2] + waveZ;
        }

        particleGeometry.attributes.position.needsUpdate = true;
      }

      syncLines();

      const pointerX = interactive && pointerRef.current.active ? pointerRef.current.x : 0;
      const pointerY = interactive && pointerRef.current.active ? pointerRef.current.y : 0;
      root.position.x = THREE.MathUtils.lerp(root.position.x, pointerX * profile.parallax, 0.045);
      root.position.y = THREE.MathUtils.lerp(root.position.y, pointerY * profile.parallax * 0.72, 0.045);
      root.rotation.z = THREE.MathUtils.lerp(root.rotation.z, pointerX * 0.045, 0.03);
      linesGroup.rotation.z = elapsed * 0.018;
      particlesGroup.rotation.z = elapsed * 0.01;

      hazePlanes[0].material.opacity = 0.16 + Math.sin(elapsed * 0.5) * 0.03;
      hazePlanes[1].material.opacity = 0.13 + Math.cos(elapsed * 0.42) * 0.025;

      renderer?.render(scene, camera);

      if (!motionReduced) {
        frameId = window.requestAnimationFrame(animate);
      }
    }

    function handlePointerMove(event: PointerEvent) {
      if (!interactive) return;

      const bounds = container.getBoundingClientRect();
      pointerRef.current.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointerRef.current.y = -((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      pointerRef.current.active = true;
    }

    function handlePointerLeave() {
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
      pointerRef.current.active = false;
    }

    resize();
    syncLines();
    animate();

    window.addEventListener("resize", resize);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("resize", resize);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);

      hazePlanes.forEach((plane) => {
        plane.geometry.dispose();
        plane.material.dispose();
      });

      particleGeometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, [density, interactive, reducedMotion, webglFailed]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={[
        "hero-nebula-shell absolute inset-0 overflow-hidden rounded-[2rem]",
        webglFailed ? "hero-nebula-fallback" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

function getParticleProfile(width: number, density: HeroNebulaBackgroundProps["density"], reducedMotion: boolean): ParticleProfile {
  if (reducedMotion) {
    return { count: 24, connectionDistance: 1.55, drift: 0.04, parallax: 0.08 };
  }

  if (density === "compact") {
    return { count: 34, connectionDistance: 1.65, drift: 0.075, parallax: 0.13 };
  }

  if (density === "full") {
    return { count: 80, connectionDistance: 1.9, drift: 0.105, parallax: 0.2 };
  }

  if (width < 640) {
    return { count: 30, connectionDistance: 1.5, drift: 0.07, parallax: 0.1 };
  }

  if (width < 1024) {
    return { count: 48, connectionDistance: 1.68, drift: 0.085, parallax: 0.14 };
  }

  return { count: 72, connectionDistance: 1.9, drift: 0.11, parallax: 0.2 };
}

function buildLinePairs(positions: Float32Array, maxDistance: number) {
  const linePairs: Array<[number, number]> = [];
  const pointCount = positions.length / 3;
  const maxDistanceSq = maxDistance * maxDistance;

  for (let start = 0; start < pointCount; start += 1) {
    let connections = 0;

    for (let end = start + 1; end < pointCount; end += 1) {
      if (connections >= 3) break;

      const startOffset = start * 3;
      const endOffset = end * 3;
      const dx = positions[startOffset] - positions[endOffset];
      const dy = positions[startOffset + 1] - positions[endOffset + 1];
      const dz = positions[startOffset + 2] - positions[endOffset + 2];
      const distanceSq = dx * dx + dy * dy + dz * dz;

      if (distanceSq <= maxDistanceSq) {
        linePairs.push([start, end]);
        connections += 1;
      }
    }
  }

  return linePairs;
}

function createGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) {
    return undefined;
  }

  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.22, "rgba(206,250,255,0.95)");
  gradient.addColorStop(0.56, "rgba(128,194,255,0.28)");
  gradient.addColorStop(1, "rgba(128,194,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createHazePlanes() {
  const planes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];

  const specs = [
    { color: "#8b5cf6", position: [-1.6, 0.95, -0.6] as [number, number, number], scale: [4.2, 2.9] as [number, number], opacity: 0.16 },
    { color: "#38bdf8", position: [1.55, -1.1, -0.4] as [number, number, number], scale: [4.6, 3.2] as [number, number], opacity: 0.13 },
  ];

  specs.forEach((spec) => {
    const material = new THREE.MeshBasicMaterial({
      color: spec.color,
      transparent: true,
      opacity: spec.opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(spec.scale[0], spec.scale[1]), material);
    plane.position.set(...spec.position);
    plane.rotation.z = THREE.MathUtils.degToRad(spec.position[0] > 0 ? -18 : 14);
    planes.push(plane);
  });

  return planes;
}
