import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { modelManager } from "@/utils/ModelManager";
import { useModelVisibility } from "@/hooks/useVisibilityTracking";

interface CameraConfig {
  fov?: number;
  position?: { x?: number; y?: number; z?: number };
  near?: number;
  far?: number;
}

interface ServerModel3DProps {
  className?: string;
  style?: React.CSSProperties;
  onModelLoaded?: () => void;
  cameraConfig?: CameraConfig;
  zIndex?: number;
  enableConditionalRendering?: boolean; // New prop to control conditional rendering
}

interface ServerModel3DRef {
  getServerObject: () => THREE.Group | null;
  pauseRendering: () => void;
  resumeRendering: () => void;
}

const ServerModel3D = forwardRef<ServerModel3DRef, ServerModel3DProps>(({ 
  className, 
  style, 
  onModelLoaded, 
  cameraConfig,
  zIndex = 2,
  enableConditionalRendering = true // Default to enabled
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelLoadedRef = useRef(false);
  const serverRef = useRef<THREE.Group | null>(null);
  const renderingPausedRef = useRef(false);
  const animationIdRef = useRef<number>(0);

  // Track visibility for conditional rendering
  const { isVisible, intersectionRatio } = useModelVisibility(containerRef as React.RefObject<Element>);

  // Automatically pause/resume rendering based on visibility
  useEffect(() => {
    if (!enableConditionalRendering) return;
    
    if (isVisible && intersectionRatio > 0.1) {
      renderingPausedRef.current = false;
      console.log(`ServerModel3D: Auto-resumed rendering (${Math.round(intersectionRatio * 100)}% visible)`);
    } else if (!isVisible || intersectionRatio < 0.05) {
      renderingPausedRef.current = true;
      console.log('ServerModel3D: Auto-paused rendering (not visible)');
    }
  }, [isVisible, intersectionRatio, enableConditionalRendering]);

  // Expose server object and control methods to parent component
  useImperativeHandle(ref, () => ({
    getServerObject: () => serverRef.current,
    pauseRendering: () => {
      renderingPausedRef.current = true;
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = 0;
      }
      console.log('ServerModel3D: Rendering paused');
    },
    resumeRendering: () => {
      renderingPausedRef.current = false;
      console.log('ServerModel3D: Rendering resumed');
    }
  }), []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Track if component is still mounted
    let mounted = true;
    let animationId: number;
    let server: THREE.Group | null = null;
    let renderer: THREE.WebGLRenderer;
    let composer: EffectComposer;

    // Extract camera configuration with defaults
    const {
      fov = 12,
      position = { x: 0, y: 0, z: 13 },
      near = 0.1,
      far = 1000
    } = cameraConfig || {};

    // Initialize Three.js scene with configurable camera
    const camera = new THREE.PerspectiveCamera(
      fov,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      near,
      far
    );
    camera.position.set(
      position.x ?? 0,
      position.y ?? 0,
      position.z ?? 13
    );

    const scene = new THREE.Scene();

    // Prevent multiple simultaneous loads
    if (modelLoadedRef.current) return;
    modelLoadedRef.current = true;

    // Use ModelManager for efficient model loading
    console.log('ServerModel3D: Loading model using ModelManager');
    modelManager.loadModel(
      '/models/server_racking_system.glb',
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      }
    )
    .then((loadedModel) => {
      if (!mounted) return;

      server = loadedModel;
      serverRef.current = server;

      // Center and position the model
      const box = new THREE.Box3().setFromObject(server);
      const center = box.getCenter(new THREE.Vector3());
      server.position.sub(center);

      server.position.x = 0;
      server.rotation.y = 5;
      scene.add(server);

      console.log('ServerModel3D: Model loaded successfully via ModelManager');
      
      // Log memory usage for debugging
      const memoryStats = modelManager.getMemoryUsage();
      console.log('ModelManager memory usage:', memoryStats);
      
      if (onModelLoaded) {
        onModelLoaded();
      }
    })
    .catch((error) => {
      console.error('ServerModel3D: Error loading model via ModelManager:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          type: error.constructor.name
        });
      }
    });

    // Initialize renderer
    renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: false
    });

    renderer.setClearColor(0xffffff, 0);

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Set up post-processing
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    containerRef.current.appendChild(renderer.domElement);

    // Set canvas z-index directly
    renderer.domElement.style.zIndex = zIndex.toString();
    renderer.domElement.style.position = 'relative';

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 10);
    topLight.position.set(500, 500, 500);
    scene.add(topLight);

    // Optimized animation loop with conditional rendering
    const reRender3D = () => {
      if (!mounted) return;
      
      // Skip rendering if conditionally paused and not visible
      if (enableConditionalRendering && renderingPausedRef.current) {
        animationIdRef.current = requestAnimationFrame(reRender3D);
        return;
      }
      
      animationId = requestAnimationFrame(reRender3D);
      animationIdRef.current = animationId;
      composer.render();
    };
    reRender3D();

    // Handle resize with throttling
    let resizeTimeout: NodeJS.Timeout;
    function onContainerResize() {
      if (!containerRef.current || !mounted) return;

      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!containerRef.current || !mounted) return;

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        camera.aspect = containerWidth / containerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerWidth, containerHeight);
        composer.setSize(containerWidth, containerHeight);

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      }, 16);
    }

    const resizeObserver = new ResizeObserver(() => {
      onContainerResize();
    });

    resizeObserver.observe(containerRef.current);

    // Cleanup function
    return () => {
      mounted = false;
      modelLoadedRef.current = false;
      serverRef.current = null;

      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      clearTimeout(resizeTimeout);
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
  }, [zIndex, enableConditionalRendering]); // Add zIndex and enableConditionalRendering to dependency array

  const setRefs = (element: HTMLDivElement | null) => {
    containerRef.current = element;
  };

  return (
    <div 
      ref={setRefs} 
      className={className}
      style={style}
    />
  );
});

ServerModel3D.displayName = 'ServerModel3D';

export default ServerModel3D;