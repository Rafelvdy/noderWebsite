import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/**
 * ModelManager - Singleton for efficient 3D model loading and sharing
 * 
 * Features:
 * - Loads each GLB file only once and caches it
 * - Provides cloned instances for multiple usage
 * - Shares geometries and materials between clones
 * - Tracks loading states and provides loading callbacks
 * - Memory-efficient disposal methods
 */
class ModelManager {
  private static instance: ModelManager;
  private models: Map<string, THREE.Group> = new Map();
  private loadingPromises: Map<string, Promise<THREE.Group>> = new Map();
  private loader: GLTFLoader = new GLTFLoader();

  private constructor() {
    // Private constructor for singleton pattern
  }

  static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }
    return ModelManager.instance;
  }

  /**
   * Load a 3D model and cache it for reuse
   * @param url - Path to the GLB file
   * @param onProgress - Optional progress callback
   * @returns Promise resolving to cloned model instance
   */
  async loadModel(
    url: string, 
    onProgress?: (progress: ProgressEvent) => void
  ): Promise<THREE.Group> {
    // If model is already cached, return a clone immediately
    if (this.models.has(url)) {
      console.log(`ModelManager: Using cached model for ${url}`);
      return this.cloneModel(this.models.get(url)!);
    }

    // If model is currently loading, wait for the existing promise
    if (this.loadingPromises.has(url)) {
      console.log(`ModelManager: Waiting for existing load of ${url}`);
      const originalModel = await this.loadingPromises.get(url)!;
      return this.cloneModel(originalModel);
    }

    // Start loading the model
    console.log(`ModelManager: Loading new model from ${url}`);
    const loadingPromise = new Promise<THREE.Group>((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          console.log(`ModelManager: Successfully loaded ${url}`);
          
          // Cache the original model
          this.models.set(url, gltf.scene);
          
          // Clean up loading promise
          this.loadingPromises.delete(url);
          
          // Resolve with a clone
          resolve(this.cloneModel(gltf.scene));
        },
        onProgress,
        (error) => {
          console.error(`ModelManager: Failed to load ${url}:`, error);
          this.loadingPromises.delete(url);
          reject(error);
        }
      );
    });

    // Store the loading promise
    this.loadingPromises.set(url, loadingPromise);
    
    return loadingPromise;
  }

  /**
   * Create an optimized clone of a cached model
   * @param originalModel - The original model to clone
   * @returns Cloned model with shared geometries and materials
   */
  private cloneModel(originalModel: THREE.Group): THREE.Group {
    const clone = originalModel.clone();
    
    // Optimize the clone for better performance
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Share geometries and materials between clones to save memory
        // The clone() method already handles this correctly for Three.js objects
        
        // Enable frustum culling for better performance
        child.frustumCulled = true;
        
        // Optimize material settings
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.needsUpdate = false;
          child.material.precision = 'mediump';
        }
      }
    });

    console.log('ModelManager: Created optimized model clone');
    return clone;
  }

  /**
   * Check if a model is cached
   * @param url - Path to the GLB file
   * @returns Boolean indicating if model is cached
   */
  isModelCached(url: string): boolean {
    return this.models.has(url);
  }

  /**
   * Check if a model is currently loading
   * @param url - Path to the GLB file
   * @returns Boolean indicating if model is loading
   */
  isModelLoading(url: string): boolean {
    return this.loadingPromises.has(url);
  }

  /**
   * Get cache statistics for debugging
   * @returns Object with cache information
   */
  getCacheStats() {
    return {
      cachedModels: this.models.size,
      activeLoads: this.loadingPromises.size,
      cachedUrls: Array.from(this.models.keys())
    };
  }

  /**
   * Dispose of a specific cached model to free memory
   * @param url - Path to the GLB file to remove from cache
   */
  disposeModel(url: string) {
    const model = this.models.get(url);
    if (model) {
      // Dispose of geometries and materials
      model.traverse((child) => {
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
      
      this.models.delete(url);
      console.log(`ModelManager: Disposed cached model ${url}`);
    }
  }

  /**
   * Clear all cached models and free memory
   */
  clearCache() {
    for (const url of this.models.keys()) {
      this.disposeModel(url);
    }
    this.models.clear();
    this.loadingPromises.clear();
    console.log('ModelManager: Cleared all cached models');
  }

  /**
   * Get memory usage estimate (approximate)
   * @returns Object with memory usage information
   */
  getMemoryUsage() {
    let totalVertices = 0;
    let totalTriangles = 0;
    let totalMaterials = 0;

    this.models.forEach((model) => {
      model.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
          const positions = child.geometry.attributes.position;
          if (positions) {
            totalVertices += positions.count;
            totalTriangles += positions.count / 3;
          }
          totalMaterials++;
        }
      });
    });

    return {
      cachedModels: this.models.size,
      estimatedVertices: totalVertices,
      estimatedTriangles: totalTriangles,
      totalMaterials: totalMaterials,
      estimatedMemoryMB: Math.round((totalVertices * 12 + totalMaterials * 1024) / 1024 / 1024 * 100) / 100
    };
  }
}

// Export singleton instance
export const modelManager = ModelManager.getInstance();
export default ModelManager; 