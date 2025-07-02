'use client'
import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.fonts.ready.then(() => {
      gsap.set(".split", { opacity: 1 });
  
      let split;
      SplitText.create(".split", {
        type: "words,lines",
        linesClass: "line",
        autoSplit: true,
        mask: "lines",
        onSplit: (self) => {
          split = gsap.from(self.lines, {
            duration: 0.5,
            yPercent: 100,
            opacity: 0,
            stagger: 0.1,
            ease: "expo.out"
          });
          return split;
        }
      });
    });
  }, []);
  

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
        server.position.set(8, 0, 0);
        server.rotation.y = Math.PI;
        scene.add(server);

        gsap.to(server.position, {
          duration: 1.2,
          x: 0,
          ease: "expo.out",
          delay: 0.3
        });

        gsap.to(server.rotation, {
          duration: 1.2,
          y: 0,
          ease: "expo.out",
          delay: 0.3
        });

        console.log(gltf.animations);
      },
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

    const topLight = new THREE.DirectionalLight(0xffffff, 2);
    topLight.position.set(0,0,0);
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
        <div className={styles.HeroContent}>
          <div className={styles.HeroTitle}>
            <h1 className="split">The Most Efficient Nodes on Solana.</h1>
          </div>
          <div className={styles.HeroSubtitle}>
            <h2 className="split">The first fully owned, performance-optimized RPC infrastructure built for Web3</h2>
          </div>
          <div className={styles.HeroButton}>
            <button className="split">Deploy a Node Instantly</button>
          </div>
        </div>
      </main>

      <div className={styles.Container3D} ref={containerRef}></div>
    </div> 
  );
}