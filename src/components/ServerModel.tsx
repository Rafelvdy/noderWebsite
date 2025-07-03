import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";

interface ServerModel3DProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function ServerModel3D({ className, style }: ServerModel3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelLoadedRef = useRef(false);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Track if component is still mounted
    let mounted = true;
    let animationId: number;
    let server: THREE.Group | null = null;

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

    // Load the 3D model
    loader.load(
      '/models/server_racking_system.glb',
      function (gltf) {
        if (!mounted) return;

        server = gltf.scene;

        // Optimize model for better performance
        server.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.frustumCulled = true;
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.needsUpdate = false;
              child.material.precision = 'mediump';
            }
          }
        });

        // Center and position the model
        const box = new THREE.Box3().setFromObject(server);
        const center = box.getCenter(new THREE.Vector3());
        server.position.sub(center);

        server.position.x = 8;
        server.rotation.y = Math.PI;
        scene.add(server);

        // Animate model entrance
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

        console.log('Model loaded successfully', gltf.animations);
      },
      function (progress) {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      function (error) {
        console.error('Error loading model:', error);
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            type: error.constructor.name
          });
        }
      }
    );

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: false
    });

    renderer.setClearColor(0xffffff, 1);

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Set up post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    containerRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 10);
    topLight.position.set(500, 500, 500);
    scene.add(topLight);

    // Animation loop
    const reRender3D = () => {
      if (!mounted) return;
      animationId = requestAnimationFrame(reRender3D);
      composer.render();
    };
    reRender3D();

    // Handle resize
    function onContainerResize() {
      if (!containerRef.current || !mounted) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      camera.aspect = containerWidth / containerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerWidth, containerHeight);
      composer.setSize(containerWidth, containerHeight);

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    }

    const resizeObserver = new ResizeObserver(() => {
      onContainerResize();
    });

    resizeObserver.observe(containerRef.current);

    // Cleanup function
    return () => {
      mounted = false;
      modelLoadedRef.current = false;

      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      resizeObserver.disconnect();

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

      scene.traverse((child) => {
        if (child instanceof THREE.Light) {
          scene.remove(child);
        }
      });

      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();

      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }

      scene.clear();
      console.log('Three.js resources cleaned up');
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={style}
    />
  );
}