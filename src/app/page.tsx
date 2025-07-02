'use client'
import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const camera = new THREE.PerspectiveCamera(
      20,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 13;

    const scene = new THREE.Scene();
    let server: THREE.Group | null = null;
    
    const loader = new GLTFLoader();
    loader.load('/models/server_racking_system.glb',
      function (gltf) {
        server = gltf.scene;
        server.position.y = -2;
        server.rotation.y = 0;
        scene.add(server);
        console.log(gltf.animations);
      },
      function (xhr) {},
      function (error) {
        console.error('Error loading model:', error);
      }
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    //light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(50,50,50);
    scene.add(topLight);

    const reRender3D = () => {
      requestAnimationFrame(reRender3D);
      renderer.render(scene, camera);
    }
    reRender3D();
  }, []);

  return (
    <div className={styles.HeroContainer}>
      <main>
        
      </main>

      <div className={styles.Container3D} ref={containerRef}></div>
    </div> 
  );
}