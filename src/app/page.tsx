'use client'
import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis";
import { FaDiscord, FaTelegram, FaTwitter } from "react-icons/fa";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const VerticalBlurShader = {
    uniforms: {
      'tDiffuse': { value: null },
      'blurHeight': { value: 1 },
      'blurStrength': { value: 2.0 },
      'resolution': { value: new THREE.Vector2() }
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float blurHeight;
    uniform float blurStrength;
    uniform vec2 resolution;
    varying vec2 vUv;
    
    void main() {
      vec2 texel = 1.0 / resolution;
      
      // Calculate distance from bottom (0 = bottom, 1 = top)
      float distanceFromBottom = vUv.y;
      
      // Create blur mask (1 = full blur at bottom, 0 = no blur at blurHeight)
      float blurMask = 1.0 - smoothstep(0.0, blurHeight, distanceFromBottom);
      
      // Create white overlay mask (stronger at the bottom)
      float whiteMask = 1.0 - smoothstep(0.0, blurHeight * 0.8, distanceFromBottom);
      whiteMask = pow(whiteMask, 0.5); // Make the white fade more gradual
      
      vec4 color = texture2D(tDiffuse, vUv);
      
      if (blurMask > 0.0) {
        // Apply vertical blur
        vec4 blurredColor = vec4(0.0);
        float totalWeight = 0.0;
        
        for (int i = -4; i <= 4; i++) {
          float weight = exp(-float(i * i) / (2.0 * blurStrength));
          vec2 offset = vec2(0.0, float(i)) * texel * blurStrength;
          blurredColor += texture2D(tDiffuse, vUv + offset) * weight;
          totalWeight += weight;
        }
        
        blurredColor /= totalWeight;
        color = mix(color, blurredColor, blurMask);
        
        // Apply white overlay - mix with white based on whiteMask intensity
        vec3 whiteOverlay = vec3(1.0, 1.0, 1.0);
        color.rgb = mix(color.rgb, whiteOverlay, whiteMask * 1.0); // 1.0 controls white intensity
      }
      
      gl_FragColor = color;
    }
  `
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const modelLoadedRef = useRef(false); // Prevent multiple loads
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  let server: THREE.Group | null = null;
  useEffect(() => {

    

    // Initialize Lenis
    const lenis = new Lenis()
    function raf(time: number) {
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

      gsap.to(titleRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "bottom center",
          end: "150% center",
          scrub: 1,
          markers: true,
        }
      })

      gsap.to(subtitleRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "130% center",
          end: "150% center",
          scrub: 1,
          markers: true,
        }
      })

      // gsap.to(containerRef.current, {
      //   height: "30%",
      //   scrollTrigger: {
      //     trigger: containerRef.current,
      //     start: "130% center",
      //     end: "150% center",
      //     scrub: 1,
      //     markers: true,
      //   }
      // })

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
          delay: 1.0
        });

        gsap.to(server.rotation, {
          duration: 1.2,
          y: -0.5,
          ease: "expo.out",
          delay: 1.0
        });

        // ScrollTrigger.create({
        //   trigger: containerRef.current,
        //   start: "center center",
        //   end: "200% center",
        //   scrub: 1,
        //   markers: false,
        //   onUpdate: (self) => {
        //     if (server) {
        //       server.rotation.y = -0.5 + (self.progress * Math.PI * 2);
        //     }
        //   }
        // });

      

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
      alpha: false, 
      antialias: true, 
      powerPreference: "high-performance",
      preserveDrawingBuffer: false, // Reduce memory usage
      failIfMajorPerformanceCaveat: false
    });
    
    // Set white background for the renderer to ensure proper blur effect
    renderer.setClearColor(0xffffff, 1);

    
    // Optimize pixel ratio for mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const verticalBlurPass = new ShaderPass(VerticalBlurShader);
    verticalBlurPass.uniforms.resolution.value.set(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );

    composer.addPass(verticalBlurPass);

    gsap.to(verticalBlurPass.uniforms.blurHeight, {
      value: 0,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "bottom center",
        end: "150% center",
        scrub: 1,
        markers: true,
      }
    })
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
      // renderer.render(scene, camera);
      composer.render();
    }
    reRender3D();

    function onContainerResize() {
      if (!containerRef.current || !mounted) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      camera.aspect = containerWidth / containerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerWidth, containerHeight);
      composer.setSize(containerWidth, containerHeight);

      verticalBlurPass.uniforms.resolution.value.set(
        containerWidth,
        containerHeight
      );

      // Optimize pixel ratio for mobile devices in resize handler
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    }

    const resizeObserver = new ResizeObserver(() => {
        onContainerResize();
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
      composer.dispose();
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
    // <div className={styles.Container}>
    //   <main>
    //     <div className={styles.HeroContent}>
    //       <div className={styles.HeroTitle} ref={titleRef}>
    //         <h1 className="split">The Most Efficient Nodes on <b className={styles.GradientText}>Solana</b>.</h1>
    //       </div>
    //       <div className={styles.Container3D} ref={containerRef}></div>
    //       <div className={styles.HeroSubtitle}>
    //         <h2 className="split">The first fully owned, performance-optimized RPC infrastructure built for Web3</h2>
    //       </div>
    //       {/* <div className={styles.HeroButton}>
    //         <button className="split">Deploy a Node Instantly</button>
    //       </div> */}
          
    //     </div>
    //     <div className={styles.InformationPage}></div>
        
    //   </main>
      
    // </div>
    <main>
      <section className={styles.HeroSection}>
        <div className={styles.MobileNav}>
          <div className={styles.SocialsContainer}>
            <FaDiscord className={styles.SocialIcon} id={styles.Discord} />
            <FaTelegram className={styles.SocialIcon} id={styles.Telegram} />
            <FaTwitter className={styles.SocialIcon} id={styles.Twitter} />
          </div>
        </div>
        <div className={styles.HeroContent}>
          <div className={styles.Container3D} ref={containerRef}></div>
          <div className={styles.HeroTitle} ref={titleRef}>
            <h1 className="split">THE MOST EFFICIENT NODES ON SOLANA</h1>
          </div>
          <div className={styles.HeroSubtitle} ref={subtitleRef}>
            <h2 className="split">The first fully owned, performance-optimized RPC infrastructure built for Web3.</h2>
          </div>

        </div>

      </section>
    </main>
  );
}