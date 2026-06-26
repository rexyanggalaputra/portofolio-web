"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type DragState = {
  active: boolean;
  lastX: number;
  velocity: number;
};

export default function FuturisticRobotScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const drag: DragState = { active: false, lastX: 0, velocity: 0 };
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !coarsePointer, powerPreference: "high-performance" });
    } catch {
      setFailed(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarsePointer ? 1.25 : 1.65));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.domElement.className = "robot-scene-canvas";
    renderer.domElement.setAttribute("aria-label", "Interactive 3D futuristic robotic data analyst. Drag to rotate.");
    renderer.domElement.setAttribute("role", "img");
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.15, 8.2);

    const world = new THREE.Group();
    const robot = createRobot();
    const holograms = createHolograms();
    const starField = createLocalStars(coarsePointer ? 70 : 130);
    world.add(robot.root, holograms.root, starField);
    scene.add(world);

    scene.add(new THREE.HemisphereLight(0x91caff, 0x080514, 1.55));
    const cyanLight = new THREE.PointLight(0x22d3ee, 19, 10, 2);
    cyanLight.position.set(3.4, 2.7, 4.2);
    scene.add(cyanLight);
    const violetLight = new THREE.PointLight(0x8b5cf6, 16, 9, 2);
    violetLight.position.set(-3.5, 0.5, 3.2);
    scene.add(violetLight);
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.8);
    rimLight.position.set(0, 4, -3);
    scene.add(rimLight);

    const startedAt = window.performance.now();
    let frame = 0;

    function resize() {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    function animate() {
      const elapsed = (window.performance.now() - startedAt) / 1000;
      if (!drag.active && !reducedMotion) {
        drag.velocity *= 0.94;
        robot.root.rotation.y += 0.0022 + drag.velocity;
      }

      const floatOffset = reducedMotion ? 0 : Math.sin(elapsed * 1.05) * 0.09;
      robot.root.position.y = floatOffset - 0.08;
      holograms.root.position.y = Math.sin(elapsed * 0.82 + 1.4) * 0.055;
      holograms.left.rotation.y = -0.22 + Math.sin(elapsed * 0.5) * 0.035;
      holograms.right.rotation.y = 0.28 + Math.cos(elapsed * 0.46) * 0.035;
      robot.core.material.emissiveIntensity = 2.4 + Math.sin(elapsed * 2.1) * 0.55;
      robot.orbitA.rotation.z = elapsed * 0.34;
      robot.orbitB.rotation.x = 1.12 + elapsed * 0.22;
      starField.rotation.y = elapsed * 0.018;

      renderer.render(scene, camera);
      if (!reducedMotion || drag.active) frame = window.requestAnimationFrame(animate);
    }

    function pointerDown(event: PointerEvent) {
      drag.active = true;
      drag.lastX = event.clientX;
      drag.velocity = 0;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.classList.add("is-dragging");
    }

    function pointerMove(event: PointerEvent) {
      if (!drag.active) return;
      const delta = event.clientX - drag.lastX;
      const rotationDelta = delta * 0.009;
      robot.root.rotation.y += rotationDelta;
      drag.velocity = rotationDelta * 0.08;
      drag.lastX = event.clientX;
    }

    function pointerUp(event: PointerEvent) {
      drag.active = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
      renderer.domElement.classList.remove("is-dragging");
    }

    resize();
    animate();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    renderer.domElement.addEventListener("pointerdown", pointerDown);
    renderer.domElement.addEventListener("pointermove", pointerMove);
    renderer.domElement.addEventListener("pointerup", pointerUp);
    renderer.domElement.addEventListener("pointercancel", pointerUp);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", pointerDown);
      renderer.domElement.removeEventListener("pointermove", pointerMove);
      renderer.domElement.removeEventListener("pointerup", pointerUp);
      renderer.domElement.removeEventListener("pointercancel", pointerUp);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line) {
          object.geometry?.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if ("map" in material && material.map instanceof THREE.Texture) material.map.dispose();
            material.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  if (failed) return <RobotFallback />;

  return (
    <div ref={containerRef} className="robot-scene relative size-full">
      <div className="robot-scene-status"><span /> AI DATA CORE ONLINE</div>
      <div className="robot-scene-hint">Drag to rotate 360°</div>
    </div>
  );
}

function createRobot() {
  const root = new THREE.Group();
  root.rotation.y = -0.22;

  const shell = new THREE.MeshPhysicalMaterial({ color: 0x3b4d78, emissive: 0x07152d, emissiveIntensity: 0.48, metalness: 0.72, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.14 });
  const dark = new THREE.MeshPhysicalMaterial({ color: 0x0b1730, emissive: 0x030817, emissiveIntensity: 0.35, metalness: 0.64, roughness: 0.32, clearcoat: 0.8 });
  const cyan = new THREE.MeshStandardMaterial({ color: 0x67e8f9, emissive: 0x22d3ee, emissiveIntensity: 2.3, metalness: 0.35, roughness: 0.18 });
  const violet = new THREE.MeshStandardMaterial({ color: 0xa78bfa, emissive: 0x7c3aed, emissiveIntensity: 1.8, metalness: 0.4, roughness: 0.2 });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.92, 1.02, 8, 20), shell);
  torso.scale.set(1.08, 1, 0.62);
  torso.position.y = -0.52;
  root.add(torso);

  const chest = new THREE.Mesh(new THREE.SphereGeometry(0.67, 32, 20), dark);
  chest.scale.set(1.2, 0.82, 0.35);
  chest.position.set(0, -0.3, 0.69);
  root.add(chest);

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.24, 2), cyan);
  core.position.set(0, -0.25, 1.02);
  root.add(core);
  const coreHalo = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.025, 10, 64), violet);
  coreHalo.position.set(0, -0.25, 0.99);
  root.add(coreHalo);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 0.35, 20), dark);
  neck.position.y = 0.53;
  root.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.72, 32, 24), shell);
  head.scale.set(1.03, 0.82, 0.88);
  head.position.y = 1.16;
  root.add(head);

  const face = new THREE.Mesh(new THREE.SphereGeometry(0.58, 32, 20, 0, Math.PI * 2, 0.3, 1.7), dark);
  face.scale.set(1.04, 0.68, 0.24);
  face.position.set(0, 1.13, 0.61);
  face.rotation.x = -0.08;
  root.add(face);

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.12, 0.055), cyan);
  visor.position.set(0, 1.19, 0.79);
  root.add(visor);
  [-0.33, 0.33].forEach((x) => {
    const sensor = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), violet);
    sensor.position.set(x, 1.2, 0.82);
    root.add(sensor);
  });

  const antennaStem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.42, 10), shell);
  antennaStem.rotation.z = -0.22;
  antennaStem.position.set(0.38, 1.86, 0.08);
  root.add(antennaStem);
  const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), violet);
  antennaTip.position.set(0.43, 2.07, 0.08);
  root.add(antennaTip);

  [-1, 1].forEach((side) => {
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.43, 24, 16), shell);
    shoulder.scale.set(1, 0.76, 0.8);
    shoulder.position.set(side * 1.05, 0.08, 0);
    root.add(shoulder);
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.72, 6, 14), shell);
    arm.rotation.z = side * -0.18;
    arm.position.set(side * 1.13, -0.68, 0.04);
    root.add(arm);
    const armLight = new THREE.Mesh(new THREE.TorusGeometry(0.235, 0.028, 8, 32), side > 0 ? cyan : violet);
    armLight.rotation.x = Math.PI / 2;
    armLight.position.set(side * 1.19, -0.55, 0.05);
    root.add(armLight);
  });

  const analystModule = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.29, 0.18), dark);
  analystModule.position.set(-1.08, 0.18, 0.45);
  analystModule.rotation.z = 0.09;
  root.add(analystModule);
  const moduleScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.31, 0.14), cyan);
  moduleScreen.position.set(-1.08, 0.18, 0.55);
  moduleScreen.rotation.z = 0.09;
  root.add(moduleScreen);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.73, 1.05, 0.35, 32, 1, true), dark);
  base.position.y = -1.62;
  root.add(base);
  const baseGlow = new THREE.Mesh(new THREE.TorusGeometry(0.94, 0.045, 10, 80), cyan);
  baseGlow.rotation.x = Math.PI / 2;
  baseGlow.position.y = -1.82;
  root.add(baseGlow);

  const orbitA = new THREE.Mesh(new THREE.TorusGeometry(1.78, 0.013, 6, 120), new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.5 }));
  orbitA.rotation.x = 1.14;
  root.add(orbitA);
  const orbitB = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.009, 6, 120), new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.36 }));
  orbitB.rotation.set(1.25, 0.35, 0.2);
  root.add(orbitB);

  return { root, core: core as THREE.Mesh<THREE.IcosahedronGeometry, THREE.MeshStandardMaterial>, orbitA, orbitB };
}

function createHolograms() {
  const root = new THREE.Group();
  const left = createPanel(-2.15, 0.48, -0.18, "PREDICTIVE SIGNAL", [0.28, 0.52, 0.41, 0.76, 0.65, 0.9]);
  const right = createPanel(2.08, -0.34, 0.05, "LIVE METRICS", [0.82, 0.55, 0.69, 0.42, 0.74, 0.61]);
  left.rotation.y = -0.22;
  right.rotation.y = 0.28;
  root.add(left, right);
  return { root, left, right };
}

function createPanel(x: number, y: number, z: number, title: string, values: number[]) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  const texture = createPanelTexture(title, values);
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.55, 1.04),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }),
  );
  group.add(panel);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.58, 1.07)),
    new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.45 }),
  );
  edges.position.z = 0.012;
  group.add(edges);
  return group;
}

function createPanelTexture(title: string, values: number[]) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  const gradient = context.createLinearGradient(0, 0, 512, 320);
  gradient.addColorStop(0, "rgba(8,27,55,.88)");
  gradient.addColorStop(1, "rgba(23,11,60,.7)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 512, 320);
  context.strokeStyle = "rgba(103,232,249,.12)";
  context.lineWidth = 1;
  for (let x = 32; x < 512; x += 48) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, 320); context.stroke(); }
  for (let y = 48; y < 320; y += 48) { context.beginPath(); context.moveTo(0, y); context.lineTo(512, y); context.stroke(); }
  context.font = "600 25px sans-serif";
  context.fillStyle = "#a5f3fc";
  context.fillText(title, 30, 48);
  context.font = "500 17px sans-serif";
  context.fillStyle = "rgba(196,181,253,.8)";
  context.fillText("AI ANALYTICS / REAL TIME", 30, 78);
  context.strokeStyle = "#67e8f9";
  context.shadowColor = "#22d3ee";
  context.shadowBlur = 12;
  context.lineWidth = 4;
  context.beginPath();
  values.forEach((value, index) => {
    const px = 32 + index * 86;
    const py = 270 - value * 165;
    if (index === 0) context.moveTo(px, py); else context.lineTo(px, py);
  });
  context.stroke();
  context.shadowBlur = 0;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createLocalStars(count: number) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = THREE.MathUtils.randFloatSpread(7);
    positions[index * 3 + 1] = THREE.MathUtils.randFloatSpread(5);
    positions[index * 3 + 2] = THREE.MathUtils.randFloat(-2, 1.2);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xa5f3fc, size: 0.035, transparent: true, opacity: 0.68, blending: THREE.AdditiveBlending, depthWrite: false });
  return new THREE.Points(geometry, material);
}

function RobotFallback() {
  return (
    <div className="robot-scene-fallback" role="img" aria-label="Futuristic AI data core fallback">
      <span className="robot-fallback-core" />
      <span className="robot-fallback-ring robot-fallback-ring-a" />
      <span className="robot-fallback-ring robot-fallback-ring-b" />
    </div>
  );
}
