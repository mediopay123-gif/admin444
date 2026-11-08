import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface RudaaiHeroSceneProps {
  onSelectEmployeeRole?: (role: string) => void;
  className?: string;
}

export const RudaaiHeroScene: React.FC<RudaaiHeroSceneProps> = ({
  onSelectEmployeeRole,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL support
    const isSoftwareGl = (() => {
      try {
        const testCanvas = document.createElement('canvas');
        const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : (gl as WebGLRenderingContext).RENDERER;
        const gpu = String((gl as WebGLRenderingContext).getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch {
      setHasWebGLError(true);
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSoftwareGl ? 1 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.5);

    // --- Studio Lighting Rig ---
    const ambientLight = new THREE.AmbientLight(0x24113a, 1.5);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xcc09e6, 0x17111f, 1.2);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xff66ea, 2.5);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const purpleRimLight = new THREE.PointLight(0x7929d2, 3.5, 15);
    purpleRimLight.position.set(-5, -2, -3);
    scene.add(purpleRimLight);

    const blueBackLight = new THREE.PointLight(0x00e5ff, 2.0, 12);
    blueBackLight.position.set(0, 4, -4);
    scene.add(blueBackLight);

    // --- Main Scene Hierarchy (THREE.Group) ---
    const sceneRoot = new THREE.Group();
    scene.add(sceneRoot);

    // 1. Central Core Nucleus (Glowing sphere)
    const nucleusGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x210b38,
      emissive: 0x9313cf,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.9,
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    sceneRoot.add(nucleus);

    // 2. Inner Crystal Cage (Icosahedron Wireframe)
    const crystalGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xcc09e6,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0xcc09e6,
      emissiveIntensity: 0.4
    });
    const crystalCage = new THREE.Mesh(crystalGeo, crystalMat);
    sceneRoot.add(crystalCage);

    // 3. Outer Glass Bubble
    const glassGeo = new THREE.SphereGeometry(1.85, 32, 32);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x7929d2,
      transmission: isSoftwareGl ? 0 : 0.6,
      opacity: 0.35,
      transparent: true,
      roughness: 0.1,
      metalness: 0.1,
      ior: 1.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const glassBubble = new THREE.Mesh(glassGeo, glassMat);
    sceneRoot.add(glassBubble);

    // 4. Counter-rotating Orbital Energy Rings
    const ring1Geo = new THREE.TorusGeometry(2.4, 0.035, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xcc09e6,
      emissive: 0xcc09e6,
      emissiveIntensity: 0.9,
      roughness: 0.3,
      metalness: 0.8
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.8;
    ring1.rotation.y = 0.2;
    sceneRoot.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.8, 0.025, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00a3ff,
      emissiveIntensity: 0.7,
      roughness: 0.4,
      metalness: 0.9
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 3.2;
    ring2.rotation.z = 0.4;
    sceneRoot.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(3.2, 0.02, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x9d4edd,
      emissive: 0x7929d2,
      emissiveIntensity: 0.6,
      wireframe: true
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = Math.PI / 4;
    sceneRoot.add(ring3);

    // 5. Orbiting AI Employee Nodes (8 Primary Roles)
    const employeeNodesData = [
      { role: 'AI 架构师', color: 0x38bdf8, angle: 0, dist: 2.5, speed: 0.8 },
      { role: 'AI 视觉总监', color: 0xec4899, angle: (Math.PI / 4) * 1, dist: 2.7, speed: 0.7 },
      { role: 'AI 智能秘书', color: 0xcc09e6, angle: (Math.PI / 4) * 2, dist: 2.4, speed: 0.9 },
      { role: 'AI 电商操盘', color: 0xf59e0b, angle: (Math.PI / 4) * 3, dist: 2.9, speed: 0.6 },
      { role: 'AI 量化风控', color: 0x10b981, angle: (Math.PI / 4) * 4, dist: 2.6, speed: 0.85 },
      { role: 'AI 医疗科研', color: 0x06b6d4, angle: (Math.PI / 4) * 5, dist: 2.8, speed: 0.75 },
      { role: 'AI 全球客服', color: 0xa855f7, angle: (Math.PI / 4) * 6, dist: 2.5, speed: 0.9 },
      { role: 'AI 自动调度', color: 0x6366f1, angle: (Math.PI / 4) * 7, dist: 2.7, speed: 0.65 },
    ];

    const employeeMeshes: { mesh: THREE.Group; data: typeof employeeNodesData[0] }[] = [];

    employeeNodesData.forEach((data) => {
      const nodeGroup = new THREE.Group();
      
      // Node core orb
      const nodeOrbGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const nodeOrbMat = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
      });
      const nodeOrb = new THREE.Mesh(nodeOrbGeo, nodeOrbMat);
      nodeGroup.add(nodeOrb);

      // Node halo ring
      const haloGeo = new THREE.RingGeometry(0.24, 0.28, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: data.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      nodeGroup.add(halo);

      sceneRoot.add(nodeGroup);
      employeeMeshes.push({ mesh: nodeGroup, data });
    });

    // 6. Particle Field (Surrounding cosmic AI particles)
    const particleCount = 400;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0xcc09e6);
    const color2 = new THREE.Color(0x7929d2);
    const color3 = new THREE.Color(0x00e5ff);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.0 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = Math.random() > 0.6 ? color1 : Math.random() > 0.3 ? color2 : color3;
      colorArray[i * 3] = chosenColor.r;
      colorArray[i * 3 + 1] = chosenColor.g;
      colorArray[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    sceneRoot.add(particleSystem);

    // 7. Contact Shadow Platform at base
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const gradient = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
      gradient.addColorStop(0, 'rgba(204, 9, 230, 0.45)');
      gradient.addColorStop(0.5, 'rgba(121, 41, 210, 0.2)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      shadowCtx.fillStyle = gradient;
      shadowCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.2;
    sceneRoot.add(shadowMesh);

    // Mouse Interaction & Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - prevPointerX;
        const deltaY = e.clientY - prevPointerY;
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.008;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
      } else {
        mouseX = x;
        mouseY = y;
        targetRotY = mouseX * 0.45;
        targetRotX = -mouseY * 0.35;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // Animation Loop with Three.js smooth damping
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth damped rotation towards target parallax
      sceneRoot.rotation.y = THREE.MathUtils.damp(sceneRoot.rotation.y, targetRotY, 4.0, delta);
      sceneRoot.rotation.x = THREE.MathUtils.damp(sceneRoot.rotation.x, targetRotX, 4.0, delta);

      // Core pulsing & floating
      nucleus.scale.setScalar(1 + Math.sin(elapsedTime * 2.2) * 0.04);
      crystalCage.rotation.x = elapsedTime * 0.3;
      crystalCage.rotation.y = elapsedTime * 0.4;
      glassBubble.rotation.y = -elapsedTime * 0.15;

      // Energy rings counter-rotation
      ring1.rotation.z = elapsedTime * 0.6;
      ring2.rotation.z = -elapsedTime * 0.5;
      ring3.rotation.y = elapsedTime * 0.25;

      // Orbiting employee nodes along dynamic trajectory
      employeeMeshes.forEach(({ mesh, data }) => {
        const currentAngle = data.angle + elapsedTime * data.speed * 0.4;
        const x = Math.cos(currentAngle) * data.dist;
        const z = Math.sin(currentAngle) * data.dist;
        const y = Math.sin(elapsedTime * 1.5 + data.angle) * 0.35;

        mesh.position.set(x, y, z);
        mesh.rotation.y = -currentAngle;
        mesh.lookAt(camera.position);
      });

      // Particle system gentle drifting
      particleSystem.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      // Cleanup WebGL resources
      renderer.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      glassGeo.dispose();
      glassMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (hasWebGLError) {
    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-br from-[#17111F] to-[#32104C] rounded-3xl overflow-hidden border border-purple-500/20 p-8 ${className}`}>
        {/* Holographic 2D Fallback */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(204,9,230,0.25),transparent_70%)] animate-pulse" />
        <div className="relative text-center z-10">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-tr from-[#7929D2] via-[#CC09E6] to-cyan-400 p-1 animate-spin duration-10000">
            <div className="w-full h-full rounded-full bg-[#17111F] flex items-center justify-center">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                RUDA
              </span>
            </div>
          </div>
          <p className="text-purple-200 font-semibold text-lg">RUDAAI SUPERMARKET 核心全息空间</p>
          <p className="text-xs text-purple-400/80 mt-1">24 行业 AI 员工已就绪</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative select-none ${className}`}>
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full min-h-[360px] md:min-h-[460px] cursor-grab active:cursor-grabbing" />

      {/* Futuristic Floating Badges & Overlay HUD */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#17111F]/80 backdrop-blur-md border border-purple-500/30 text-xs text-purple-200 shadow-lg shadow-purple-900/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono font-medium">RUDAAI 3D CORE · 60 FPS</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none">
        <div className="text-right text-[11px] text-purple-300/70 font-mono">
          拖拽旋转视角 · 24 行业节点全域互联
        </div>
      </div>
    </div>
  );
};
