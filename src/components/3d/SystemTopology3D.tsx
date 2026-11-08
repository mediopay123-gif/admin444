import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SystemTopology3DProps {
  className?: string;
  onSelectNode?: (nodeName: string) => void;
}

export const SystemTopology3D: React.FC<SystemTopology3DProps> = ({ className = '', onSelectNode }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 1.8, 5.2);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const ambientLight = new THREE.AmbientLight(0x7929d2, 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xff00ea, 2.0);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Central RUDAAI Core
    const centerGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.45, 32);
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0x240d3a,
      emissive: 0x9313cf,
      emissiveIntensity: 0.9,
      metalness: 0.8,
      roughness: 0.2
    });
    const centerMesh = new THREE.Mesh(centerGeo, centerMat);
    rootGroup.add(centerMesh);

    // Outer ring for center
    const ringGeo = new THREE.TorusGeometry(0.85, 0.03, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xcc09e6 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    rootGroup.add(ringMesh);

    // Peripheral Nodes
    const nodes = [
      { name: 'AI模型', x: -1.8, y: 0.4, z: -0.6, color: 0x00e5ff },
      { name: '用户流', x: -1.2, y: 0.8, z: 1.2, color: 0x38bdf8 },
      { name: '订单池', x: 1.3, y: 0.7, z: 1.1, color: 0xec4899 },
      { name: 'AI员工', x: -1.9, y: -0.3, z: 0.3, color: 0xcc09e6 },
      { name: '财务收支', x: -1.2, y: -0.7, z: 1.1, color: 0x10b981 },
      { name: '任务集群', x: 1.8, y: -0.4, z: 0.2, color: 0xa855f7 },
    ];

    const nodeMeshes: THREE.Mesh[] = [];
    const beamLines: THREE.Line[] = [];

    nodes.forEach((n) => {
      // Node Mesh
      const nGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const nMat = new THREE.MeshStandardMaterial({
        color: n.color,
        emissive: n.color,
        emissiveIntensity: 0.8
      });
      const nMesh = new THREE.Mesh(nGeo, nMat);
      nMesh.position.set(n.x, n.y, n.z);
      rootGroup.add(nMesh);
      nodeMeshes.push(nMesh);

      // Connecting energy beam line
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(n.x, n.y, n.z)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: n.color,
        transparent: true,
        opacity: 0.45
      });
      const line = new THREE.Line(lineGeo, lineMat);
      rootGroup.add(line);
      beamLines.push(line);
    });

    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      rootGroup.rotation.y = elapsed * 0.2;
      centerMesh.rotation.y = -elapsed * 0.5;
      ringMesh.rotation.z = elapsed * 0.8;

      nodeMeshes.forEach((mesh, idx) => {
        mesh.scale.setScalar(1.0 + Math.sin(elapsed * 3 + idx) * 0.15);
      });

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
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      centerGeo.dispose();
      centerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div ref={mountRef} className="w-full h-full min-h-[220px]" />
      <div className="absolute top-2 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#17111F]/80 border border-purple-500/20 text-[10px] text-purple-300 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        RUDAAI CORE 拓扑监控 · 全节点实时同步
      </div>
    </div>
  );
};
