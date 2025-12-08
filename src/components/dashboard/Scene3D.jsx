import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function Scene3D({ stat, color }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(120, 120);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Create 3D shape
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      shininess: 100,
      transparent: true,
      opacity: 0.9,
    });
    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    // Lighting
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-5, -5, -5);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.005;
        meshRef.current.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Mouse interaction
    const handleMouseMove = (e) => {
      if (!meshRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      meshRef.current.rotation.y = x * 2;
      meshRef.current.rotation.x = -y * 2;
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        if (rendererRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [color]);

  return <div ref={containerRef} className="w-[120px] h-[120px]" />;
}