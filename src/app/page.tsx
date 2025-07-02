'use client'
import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis";

gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);

export default function Home() {

  const containerRef = useRef<HTMLDivElement>(null);
  const modelLoadedRef = useRef(false); // Prevent multiple loads
  const titleRef = useRef<HTMLDivElement>(null);
  let server: THREE.Group | null = null;
  useEffect(() => {

    

    // Initialize Lenis
    const lenis = new Lenis()
    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
      lenis.on("scroll", ScrollTrigger.update);
    }
    requestAnimationFrame(raf);
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

    
    // Track if component is still mounted
    let mounted = true;
    let animationId: number;
    
    // Initialize Three.js scene
    const camera = new THREE.PerspectiveCamera(
      10,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 13;

    const scene = new THREE.Scene();
    
    
    const loader = new GLTFLoader();
    
    // Prevent multiple simultaneous loads
    if (modelLoadedRef.current) return;
    modelLoadedRef.current = true;
    
    // Add loading progress callback
    loader.load('/models/server_racking_system.glb',
      function (gltf) {
        if (!mounted) return; // Don't proceed if component unmounted
        
        server = gltf.scene;
        
        // Optimize model for better performance
        server.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Enable frustum culling
            child.frustumCulled = true;
            // Optimize materials
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.needsUpdate = false;
              // Reduce precision for better performance
              child.material.precision = 'mediump';
            }
          }
        });

        const box = new THREE.Box3().setFromObject(server);
        const center = box.getCenter(new THREE.Vector3());
        server.position.sub(center);

        server.position.x = 8;
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
          y: -0.5,
          ease: "expo.out",
          delay: 0.3
        });

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "center center",
          end: "200% center",
          scrub: 1,
          markers: true,
          onUpdate: (self) => {
            if (server) {
              server.rotation.y = -0.5 + (self.progress * Math.PI * 2);
            }
          }
        });

        console.log('Model loaded successfully', gltf.animations);
      },
      function (progress) {
        // Add progress logging to track loading
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      function (error) {
        console.error('Error loading model:', error);
        // Add more detailed error information
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            type: error.constructor.name
          });
        }
      }
    );

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true, 
      powerPreference: "high-performance",
      preserveDrawingBuffer: false, // Reduce memory usage
      failIfMajorPerformanceCaveat: false
    });

    
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);

    //light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 10);
    topLight.position.set(500,500,500);
    scene.add(topLight);

    const reRender3D = () => {
      if (!mounted) return; // Stop animation if component unmounted
      
      animationId = requestAnimationFrame(reRender3D);
      renderer.render(scene, camera);
    }
    reRender3D();

    function onContainerResize() {
      if (!containerRef.current || !mounted) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      camera.aspect = containerWidth / containerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerWidth, containerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        onContainerResize();
      }
    });
    
    resizeObserver.observe(containerRef.current);

    // CRITICAL: Comprehensive cleanup function
    return () => {
      mounted = false;
      modelLoadedRef.current = false; // Reset loading state
      
      // Cancel animation loop
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      // Disconnect resize observer
      resizeObserver.disconnect();
      
      // Dispose of Three.js resources
      if (server) {
        server.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(material => material.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
        scene.remove(server);
      }
      
      // Dispose of lights
      scene.traverse((child) => {
        if (child instanceof THREE.Light) {
          scene.remove(child);
        }
      });
      
      // Dispose of renderer
      renderer.dispose();
      renderer.forceContextLoss();
      
      // Remove canvas from DOM
      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Clear scene
      scene.clear();
      
      console.log('Three.js resources cleaned up');
    };
  }, []);

  return (
    <div className={styles.Container}>
      <main>
        <div className={styles.HeroContent}>
          <div className={styles.HeroTitle} ref={titleRef}>
            <h1 className="split">The Most Efficient Nodes on Solana.</h1>
          </div>
          <div className={styles.Container3D} ref={containerRef}></div>
          <div className={styles.HeroSubtitle}>
            <h2 className="split">The first fully owned, performance-optimized RPC infrastructure built for Web3</h2>
          </div>
          {/* <div className={styles.HeroButton}>
            <button className="split">Deploy a Node Instantly</button>
          </div> */}
          
        </div>
        
      </main>
      
    </div> 
  );
}