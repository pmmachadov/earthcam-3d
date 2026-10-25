import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface EarthGlobeProps {
  onWebcamSelect?: (webcamId: string) => void;
}

export const EarthGlobe: React.FC<EarthGlobeProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5.5;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Earth Globe Mesh
    const globeRadius = 2;
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Earth Sphere Core
    const earthGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x0f172a, // Deep slate blue/night ocean
      emissive: 0x050b14,
      specular: 0x38bdf8,
      shininess: 25,
      wireframe: false,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // Earth Grid Wireframe Overlay (tactical radar look)
    const gridGeometry = new THREE.SphereGeometry(globeRadius * 1.002, 36, 18);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    globeGroup.add(gridMesh);

    // Atmosphere Glow Shell
    const atmosphereGeometry = new THREE.SphereGeometry(globeRadius * 1.15, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(0.22, 0.74, 0.97, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    // 6. Interactive Drag & Momentum Rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0.002 }; // Slow auto-rotation by default

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;

      rotationVelocity = {
        x: deltaY * 0.003,
        y: deltaX * 0.003,
      };

      globeGroup.rotation.y += rotationVelocity.y;
      globeGroup.rotation.x += rotationVelocity.x;

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 7. Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Render Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Apply friction and auto-spin when idle
      if (!isDragging) {
        rotationVelocity.x *= 0.95;
        // Keep a gentle continuous spin around Y axis
        if (Math.abs(rotationVelocity.y) < 0.0015) {
          rotationVelocity.y = 0.0015;
        } else {
          rotationVelocity.y *= 0.98;
        }
        globeGroup.rotation.y += rotationVelocity.y;
        globeGroup.rotation.x += rotationVelocity.x;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup resources on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }

      earthGeometry.dispose();
      earthMaterial.dispose();
      gridGeometry.dispose();
      gridMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: 'grab',
        overflow: 'hidden',
      }}
    />
  );
};
