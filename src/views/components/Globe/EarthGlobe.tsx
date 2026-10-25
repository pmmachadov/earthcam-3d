import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Webcam } from '../../../models/webcam.types';
import { latLonToVector3 } from '../../../utils/geoTo3d';

interface EarthGlobeProps {
  webcams: Webcam[];
  selectedWebcamId?: string | null;
  onWebcamSelect?: (webcam: Webcam) => void;
}

export const EarthGlobe: React.FC<EarthGlobeProps> = ({
  webcams,
  selectedWebcamId,
  onWebcamSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onWebcamSelectRef = useRef(onWebcamSelect);
  onWebcamSelectRef.current = onWebcamSelect;

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
      color: 0x0f172a, // Deep slate blue
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

    // 6. Camera Markers (Pulsing 3D Pins)
    const markersGroup = new THREE.Group();
    globeGroup.add(markersGroup);

    const markerGeometry = new THREE.SphereGeometry(0.045, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Bright cyan
    });

    const haloGeometry = new THREE.RingGeometry(0.05, 0.08, 24);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });

    const interactiveMarkers: THREE.Mesh[] = [];

    webcams.forEach((cam) => {
      // Position slightly above the surface (globeRadius * 1.01) so it doesn't clip
      const pos = latLonToVector3(cam.latitude, cam.longitude, globeRadius * 1.015);

      const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial.clone());
      markerMesh.position.copy(pos);
      markerMesh.userData = { webcam: cam };

      // Halo ring that looks outwards from center of Earth
      const haloMesh = new THREE.Mesh(haloGeometry, haloMaterial.clone());
      haloMesh.position.copy(pos);
      haloMesh.lookAt(new THREE.Vector3(0, 0, 0));

      markersGroup.add(markerMesh);
      markersGroup.add(haloMesh);
      interactiveMarkers.push(markerMesh);
    });

    // 7. Raycasting for Clicking on Markers
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 8. Interactive Drag & Momentum Rotation
    let isDragging = false;
    let dragDistance = 0;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0 }; // Only moves when dragged by user

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      dragDistance = 0;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        dragDistance += Math.abs(deltaX) + Math.abs(deltaY);

        rotationVelocity = {
          x: deltaY * 0.003,
          y: deltaX * 0.003,
        };

        globeGroup.rotation.y += rotationVelocity.y;
        globeGroup.rotation.x += rotationVelocity.x;

        previousMousePosition = { x: event.clientX, y: event.clientY };
      } else {
        // Hover pointer cursor detection
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveMarkers);
        renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'grab';
      }
    };

    const onMouseUp = (event: MouseEvent) => {
      // If user clicked without dragging, detect webcam pin click
      if (dragDistance < 5) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveMarkers);

        if (intersects.length > 0) {
          const clickedWebcam = intersects[0].object.userData.webcam as Webcam;
          if (clickedWebcam && onWebcamSelectRef.current) {
            onWebcamSelectRef.current(clickedWebcam);
          }
        }
      }
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 9. Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 10. Animation Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle pulse on all marker halos
      const pulseScale = 1 + Math.sin(elapsedTime * 4) * 0.15;
      markersGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.RingGeometry) {
          child.scale.set(pulseScale, pulseScale, 1);
        }
      });

      // Apply smooth deceleration only after user drags
      if (!isDragging) {
        rotationVelocity.x *= 0.92;
        rotationVelocity.y *= 0.92;

        // Stop completely when velocity is minimal
        if (Math.abs(rotationVelocity.x) < 0.0001) rotationVelocity.x = 0;
        if (Math.abs(rotationVelocity.y) < 0.0001) rotationVelocity.y = 0;

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
      markerGeometry.dispose();
      haloGeometry.dispose();
      renderer.dispose();
    };
  }, [webcams]);

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
