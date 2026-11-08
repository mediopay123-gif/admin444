import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AIEmployee } from '../../types';

interface Employee3DPreviewProps {
  employee: AIEmployee;
  className?: string;
}

export const Employee3DPreview: React.FC<Employee3DPreviewProps> = ({ employee, className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.6, 4.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xcc09e6, 0x17111f, 1.5);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(3, 4, 3);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x00e5ff, 2.5, 8);
    pointLight.position.set(-2, 1, 1);
    scene.add(pointLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Pedestal Base
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.35, 0.25, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1f1430,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x32104c,
      emissiveIntensity: 0.4
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.2;
    rootGroup.add(baseMesh);

    // 2. Pedestal Glowing Ring
    const baseRingGeo = new THREE.TorusGeometry(1.22, 0.04, 16, 64);
    const baseRingMat = new THREE.MeshStandardMaterial({
      color: 0xcc09e6,
      emissive: 0xcc09e6,
      emissiveIntensity: 1.0
    });
    const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = -1.07;
    rootGroup.add(baseRing);

    // 3. Central Holographic Body (Stylized Cyber Form)
    const bodyGroup = new THREE.Group();
    rootGroup.add(bodyGroup);

    // Head / Core Visor
    const headGeo = new THREE.SphereGeometry(0.48, 24, 24);
    const headMat = new THREE.MeshPhysicalMaterial({
      color: 0x7929d2,
      emissive: 0x481177,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.8,
      clearcoat: 1.0
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.55;
    bodyGroup.add(head);

    // Cyber Visor / Face Plate
    const visorGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.22, 16, 1, false, -Math.PI / 2.5, Math.PI / 1.25);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 1.2,
      metalness: 0.9,
      roughness: 0.1,
      side: THREE.DoubleSide
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.rotation.x = Math.PI / 2;
    visor.position.set(0, 0.58, 0.26);
    bodyGroup.add(visor);

    // Torso Chassis
    const torsoGeo = new THREE.ConeGeometry(0.65, 0.95, 6);
    const torsoMat = new THREE.MeshStandardMaterial({
      color: 0x1f1430,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x160824
    });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.rotation.x = Math.PI;
    torso.position.y = -0.2;
    bodyGroup.add(torso);

    // Holographic Energy Column
    const holoGeo = new THREE.CylinderGeometry(0.85, 0.95, 2.2, 16, 8, true);
    const holoMat = new THREE.MeshBasicMaterial({
      color: 0xcc09e6,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const holoCylinder = new THREE.Mesh(holoGeo, holoMat);
    holoCylinder.position.y = -0.1;
    rootGroup.add(holoCylinder);

    // Hover Particles
    const pCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 1.6;
      pPos[i * 3 + 1] = -1.0 + Math.random() * 2.2;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xcc09e6,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(pGeo, pMat);
    rootGroup.add(particles);

    let animationId: number;
    let clock = new THREE.Clock();

    let targetRotY = 0;
    let isDragging = false;
    let prevX = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const delta = e.clientX - prevX;
        targetRotY += delta * 0.015;
        prevX = e.clientX;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth damped rotation
      if (!isDragging) {
        targetRotY += 0.008;
      }
      rootGroup.rotation.y = THREE.MathUtils.damp(rootGroup.rotation.y, targetRotY, 5.0, delta);

      // Gentle breathing hover
      bodyGroup.position.y = Math.sin(elapsed * 2.0) * 0.06;
      head.rotation.y = Math.sin(elapsed * 1.2) * 0.15;

      // Particle float up
      const positions = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        positions[i * 3 + 1] += 0.008;
        if (positions[i * 3 + 1] > 1.2) {
          positions[i * 3 + 1] = -1.0;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      holoCylinder.rotation.y = -elapsed * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);

      renderer.dispose();
      baseGeo.dispose();
      baseMat.dispose();
      baseRingGeo.dispose();
      baseRingMat.dispose();
      headGeo.dispose();
      headMat.dispose();
      visorGeo.dispose();
      visorMat.dispose();
      torsoGeo.dispose();
      torsoMat.dispose();
      holoGeo.dispose();
      holoMat.dispose();
      pGeo.dispose();
      pMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [employee]);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <div ref={mountRef} className="w-full h-full min-h-[260px] cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-[#17111F]/80 backdrop-blur-md border border-purple-500/20 text-[10px] text-purple-300 font-mono pointer-events-none">
        3D 全息互动模型 · 拖拽旋转
      </div>
    </div>
  );
};
