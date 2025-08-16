import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AnimatedBackgroundProps {
  type?: 'koi' | 'clouds' | 'reeds';
  intensity?: 'low' | 'medium' | 'high';
}

export default function AnimatedBackground({ 
  type = 'clouds', 
  intensity = 'medium' 
}: AnimatedBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Position camera
    camera.position.set(0, 0, 5);

    // Create animations based on type
    const elements: THREE.Object3D[] = [];
    
    if (type === 'koi') {
      createKoiFish(scene, elements, intensity);
    } else if (type === 'clouds') {
      createClouds(scene, elements, intensity);
    } else if (type === 'reeds') {
      createReeds(scene, elements, intensity);
    }

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      elements.forEach((element, index) => {
        if (type === 'koi') {
          animateKoi(element, time, index);
        } else if (type === 'clouds') {
          animateClouds(element, time, index);
        } else if (type === 'reeds') {
          animateReeds(element, time, index);
        }
      });

      renderer.render(scene, camera);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [type, intensity]);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: intensity === 'low' ? 0.3 : intensity === 'medium' ? 0.5 : 0.7 }}
    />
  );
}

// Koi fish creation and animation
function createKoiFish(scene: THREE.Scene, elements: THREE.Object3D[], intensity: string) {
  const fishCount = intensity === 'low' ? 3 : intensity === 'medium' ? 5 : 8;
  
  for (let i = 0; i < fishCount; i++) {
    const fishGroup = new THREE.Group();
    
    // Fish body (ellipsoid)
    const bodyGeometry = new THREE.SphereGeometry(0.3, 16, 8);
    bodyGeometry.scale(1.5, 1, 0.8);
    const bodyMaterial = new THREE.MeshBasicMaterial({ 
      color: i % 2 === 0 ? 0xff6b35 : 0xf7931e,
      transparent: true,
      opacity: 0.8
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    fishGroup.add(body);
    
    // Fish tail
    const tailGeometry = new THREE.ConeGeometry(0.2, 0.4, 8);
    const tailMaterial = new THREE.MeshBasicMaterial({ 
      color: i % 2 === 0 ? 0xff8c42 : 0xffa726,
      transparent: true,
      opacity: 0.8
    });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.set(-0.6, 0, 0);
    tail.rotation.z = Math.PI / 2;
    fishGroup.add(tail);
    
    // Position fish randomly
    fishGroup.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 4
    );
    
    // Store initial position for animation
    (fishGroup as any).initialY = fishGroup.position.y;
    (fishGroup as any).speed = 0.5 + Math.random() * 0.5;
    (fishGroup as any).phase = Math.random() * Math.PI * 2;
    
    scene.add(fishGroup);
    elements.push(fishGroup);
  }
}

function animateKoi(fish: THREE.Object3D, time: number, index: number) {
  const speed = (fish as any).speed;
  const phase = (fish as any).phase;
  const initialY = (fish as any).initialY;
  
  // Swimming motion
  fish.position.x += Math.sin(time * speed + phase) * 0.01;
  fish.position.y = initialY + Math.sin(time * speed * 2 + phase) * 0.3;
  fish.rotation.y = Math.sin(time * speed + phase) * 0.3;
  fish.rotation.z = Math.sin(time * speed * 3 + phase) * 0.1;
  
  // Reset position if fish swims too far
  if (fish.position.x > 6) fish.position.x = -6;
  if (fish.position.x < -6) fish.position.x = 6;
}

// Cloud creation and animation
function createClouds(scene: THREE.Scene, elements: THREE.Object3D[], intensity: string) {
  const cloudCount = intensity === 'low' ? 4 : intensity === 'medium' ? 6 : 10;
  
  for (let i = 0; i < cloudCount; i++) {
    const cloudGroup = new THREE.Group();
    
    // Create cloud from multiple spheres
    const sphereCount = 5 + Math.floor(Math.random() * 3);
    for (let j = 0; j < sphereCount; j++) {
      const geometry = new THREE.SphereGeometry(
        0.3 + Math.random() * 0.4, 
        12, 
        8
      );
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.6 + Math.random() * 0.2
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.8
      );
      cloudGroup.add(sphere);
    }
    
    // Position clouds
    cloudGroup.position.set(
      (Math.random() - 0.5) * 12,
      2 + Math.random() * 3,
      -2 - Math.random() * 2
    );
    
    (cloudGroup as any).speed = 0.1 + Math.random() * 0.2;
    (cloudGroup as any).bobSpeed = 0.5 + Math.random() * 0.3;
    (cloudGroup as any).initialY = cloudGroup.position.y;
    
    scene.add(cloudGroup);
    elements.push(cloudGroup);
  }
}

function animateClouds(cloud: THREE.Object3D, time: number, index: number) {
  const speed = (cloud as any).speed;
  const bobSpeed = (cloud as any).bobSpeed;
  const initialY = (cloud as any).initialY;
  
  // Slow drift
  cloud.position.x += speed * 0.01;
  cloud.position.y = initialY + Math.sin(time * bobSpeed) * 0.2;
  
  // Gentle rotation
  cloud.rotation.y += 0.001;
  
  // Reset position
  if (cloud.position.x > 8) cloud.position.x = -8;
}

// Reed creation and animation
function createReeds(scene: THREE.Scene, elements: THREE.Object3D[], intensity: string) {
  const reedCount = intensity === 'low' ? 8 : intensity === 'medium' ? 12 : 20;
  
  for (let i = 0; i < reedCount; i++) {
    const reedGroup = new THREE.Group();
    
    // Reed stem
    const stemGeometry = new THREE.CylinderGeometry(0.02, 0.05, 2, 8);
    const stemMaterial = new THREE.MeshBasicMaterial({
      color: 0x4a5c3a,
      transparent: true,
      opacity: 0.8
    });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 1;
    reedGroup.add(stem);
    
    // Reed top
    const topGeometry = new THREE.SphereGeometry(0.08, 8, 6);
    topGeometry.scale(1, 2, 1);
    const topMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b7355,
      transparent: true,
      opacity: 0.9
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 2.1;
    reedGroup.add(top);
    
    // Position reeds
    reedGroup.position.set(
      (Math.random() - 0.5) * 8,
      -2,
      1 + Math.random() * 2
    );
    
    (reedGroup as any).swaySpeed = 0.8 + Math.random() * 0.4;
    (reedGroup as any).swayAmount = 0.3 + Math.random() * 0.2;
    (reedGroup as any).phase = Math.random() * Math.PI * 2;
    
    scene.add(reedGroup);
    elements.push(reedGroup);
  }
}

function animateReeds(reed: THREE.Object3D, time: number, index: number) {
  const swaySpeed = (reed as any).swaySpeed;
  const swayAmount = (reed as any).swayAmount;
  const phase = (reed as any).phase;
  
  // Gentle swaying motion
  reed.rotation.z = Math.sin(time * swaySpeed + phase) * swayAmount;
  reed.rotation.x = Math.sin(time * swaySpeed * 0.7 + phase) * swayAmount * 0.5;
}