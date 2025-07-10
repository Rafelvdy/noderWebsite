'use client'
import styles from "./page.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef, useEffect, useCallback } from "react";
import ServerModel3D from "@/components/ServerModel";
import * as THREE from "three";
import * as React from "react";
import Lenis from "lenis";
import { memoryMonitor } from "@/utils/MemoryMonitor";
import { modelManager } from "@/utils/ModelManager";

gsap.registerPlugin(ScrollTrigger, SplitText);

type ServerModel3DRef = {
    getServerObject: () => THREE.Group | null;
    pauseRendering: () => void;
    resumeRendering: () => void;
  };

export default function NewTry() {
    const section1Ref = useRef<HTMLDivElement>(null);
    const section2Ref = useRef<HTMLDivElement>(null);
    const section2InnerRef = useRef<HTMLDivElement>(null);
    const section3Ref = useRef<HTMLDivElement>(null);
    const section4Ref = useRef<HTMLDivElement>(null);
    const section4InnerRef = useRef<HTMLDivElement>(null);
    const section5Ref = useRef<HTMLDivElement>(null);
    const section5InnerRef = useRef<HTMLDivElement>(null);
    const sectionsContainerRef = useRef<HTMLDivElement>(null);
    const serverModelRef = useRef<ServerModel3DRef>(null);
    const serverModelContainerRef = useRef<HTMLDivElement>(null);
    const heroTitleRef = useRef<HTMLDivElement>(null);
    const heroSubtitleRef = useRef<HTMLDivElement>(null);
    const blurOverlayRef = useRef<HTMLDivElement>(null);
    const server2ModelRef = useRef<ServerModel3DRef>(null);
    const server2ModelContainerRef = useRef<HTMLDivElement>(null);
    const server2BlurOverlayRef = useRef<HTMLDivElement>(null);
    const server2InfiniteRotationRef = useRef<gsap.core.Tween | null>(null);
    // Store initial viewport height to prevent scaling changes when dvh changes on mobile
    const initialViewportHeightRef = useRef<number>(0);
    const animateServerEntrance = useCallback(() => {
        const serverObject = serverModelRef.current?.getServerObject();
        
        if (serverObject && serverModelContainerRef.current) {
          
          // Use a timeline for better performance
          const entranceTl = gsap.timeline();
          
          entranceTl
            .to(serverModelContainerRef.current, {
              duration: 1.2,
              left: "0%",
              ease: "expo.out",
            })
            .to(serverObject.rotation, {
              duration: 1.2,
              y: 0,
              ease: "expo.out",
            }, "<"); // Start at the same time as previous animation
        }
      }, []);

      const animateServer2Entrance = useCallback(() => {
        const serverObject = server2ModelRef.current?.getServerObject();
        
        if (serverObject && server2ModelContainerRef.current) {
          
        // Initially hide the blur overlay
        if (server2BlurOverlayRef.current) {
            gsap.set(server2BlurOverlayRef.current, {
                opacity: 0,
                backdropFilter: "blur(0px)",
                background: "rgba(255, 255, 255, 0)"
            });
        }

        // Main ScrollTrigger for bidirectional server2 animation
        ScrollTrigger.create({
            trigger: section2Ref.current,
            start: "30% bottom",
            end: "30% center",
            
            // Forward animation (scrolling down into section 2)
            onEnter: () => {
                console.log("Server2: Entering section 2 (scrolling down)");
                
                // Animate container from right to center
                gsap.to(server2ModelContainerRef.current, {
                    right: "50%",
                    transform: "translateX(50%) translateY(-50%)",
                    ease: "power2.inOut",
                    duration: 1.5,
                    onComplete: () => {
                        // Animate blur overlay in after server entrance completes
                        if (server2BlurOverlayRef.current) {
                            gsap.to(server2BlurOverlayRef.current, {
                                opacity: 1,
                                backdropFilter: "blur(3px)",
                                background: "rgba(255, 255, 255, 0.4)",
                                duration: 0.8,
                                ease: "power2.out",
                                onComplete: () => {
                                    // Start infinite rotation after both entrance and blur animations complete
                                    if (serverObject) {
                                        console.log("Server2: Starting infinite rotation");
                                        
                                        // Kill any existing infinite rotation
                                        if (server2InfiniteRotationRef.current) {
                                            server2InfiniteRotationRef.current.kill();
                                        }
                                        
                                        // Start infinite rotation while maintaining the corner tilt
                                        server2InfiniteRotationRef.current = gsap.to(serverObject.rotation, {
                                            y: "-=6.28", // 2π radians = full rotation
                                            duration: 8, // 8 seconds per rotation for smooth, elegant motion
                                            ease: "none", // Linear rotation
                                            repeat: -1, // Infinite rotation
                                        });
                                    }
                                }
                            });
                        }
                    }
                });

                // Animate server rotation to corner position
                if (serverObject) {
                    gsap.to(serverObject.rotation, {
                        y: 0,
                        z: 0.1, // Maintain the slight corner tilt
                        duration: 2,
                        ease: "power2.inOut",
                    });
                }
            },
            
            // Reverse animation (scrolling back up past section 2)
            onLeaveBack: () => {
                console.log("Server2: Leaving section 2 upward (scrolling up)");
                
                // Stop infinite rotation immediately
                if (server2InfiniteRotationRef.current) {
                    server2InfiniteRotationRef.current.kill();
                    server2InfiniteRotationRef.current = null;
                }
                
                // Immediately hide blur overlay when leaving
                if (server2BlurOverlayRef.current) {
                    gsap.to(server2BlurOverlayRef.current, {
                        opacity: 0,
                        backdropFilter: "blur(0px)",
                        background: "rgba(255, 255, 255, 0)",
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
                
                // Animate container from center back to right (off-screen)
                gsap.to(server2ModelContainerRef.current, {
                    right: "100%",
                    transform: "translateY(-50%)",
                    ease: "power2.inOut",
                    duration: 1.5,
                });

                // Reset server rotation
                if (serverObject) {
                    gsap.to(serverObject.rotation, {
                        y: 5, // Reset to initial rotation
                        z: 0,
                        duration: 2,
                        ease: "power2.inOut",
                    });
                }
            }
        });

        // Secondary ScrollTrigger for maintaining center position when scrolling past section 2
        ScrollTrigger.create({
            trigger: section2Ref.current,
            start: "bottom center",
            end: "bottom top",
            
            onEnter: () => {
                console.log("Server2: Maintaining center position past section 2");
                // Ensure it stays centered when scrolling down past section 2
                gsap.set(server2ModelContainerRef.current, {
                    position: "fixed",
                    right: "50%",
                    transform: "translateX(50%) translateY(-50%)",
                });
                
                // Maintain blur overlay when past section 2
                if (server2BlurOverlayRef.current) {
                    gsap.set(server2BlurOverlayRef.current, {
                        opacity: 1,
                        backdropFilter: "blur(3px)",
                        background: "rgba(255, 255, 255, 0.4)"
                    });
                }
                
                // Ensure infinite rotation continues when past section 2
                if (serverObject && !server2InfiniteRotationRef.current) {
                    console.log("Server2: Restarting infinite rotation when past section 2");
                    server2InfiniteRotationRef.current = gsap.to(serverObject.rotation, {
                        y: "+=6.28",
                        duration: 8,
                        ease: "none",
                        repeat: -1,
                    });
                }
            },
            
            // Handle scrolling back up from below section 2
            onLeaveBack: () => {
                console.log("Server2: Returning to section 2 from below");
                // Maintain center position when coming back up from lower sections
                gsap.set(server2ModelContainerRef.current, {
                    position: "fixed",
                    right: "50%",
                    transform: "translateX(50%) translateY(-50%)",
                });
                
                // Maintain blur overlay when returning to section 2
                if (server2BlurOverlayRef.current) {
                    gsap.set(server2BlurOverlayRef.current, {
                        opacity: 1,
                        backdropFilter: "blur(3px)",
                        background: "rgba(255, 255, 255, 0.4)"
                    });
                }
                
                // Ensure infinite rotation continues when returning to section 2
                if (serverObject && !server2InfiniteRotationRef.current) {
                    console.log("Server2: Restarting infinite rotation when returning to section 2");
                    server2InfiniteRotationRef.current = gsap.to(serverObject.rotation, {
                        y: "-=6.28",
                        duration: 8,
                        ease: "none",
                        repeat: -1,
                    });
                }
            }
        });
        }
      }, []);

    useEffect(() => {

        const lenis = new Lenis();
    
        // Store initial viewport height to prevent scaling issues when dvh changes on mobile
        initialViewportHeightRef.current = window.innerHeight;
        
        // Start memory monitoring for optimization tracking
        console.log('🚀 Starting memory optimization tracking');
        const initialSnapshot = memoryMonitor.takeSnapshot();
        memoryMonitor.startMonitoring(10000); // Monitor every 10 seconds
        
        // Log initial state
        console.log('Initial memory state:', memoryMonitor.getMemoryStats());
        console.log('ModelManager cache state:', modelManager.getCacheStats());
        
        // Force Lenis to start at top position
        lenis.scrollTo(0, { immediate: true });
    
        lenis.on('scroll', () => {
            ScrollTrigger.update();
        });
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        gsap.timeline({
            scrollTrigger: {
                trigger: section1Ref.current,
                start: "top top",
                end: () => `+=${initialViewportHeightRef.current}`, // Use fixed pixel value instead of "bottom top"
                scrub: true,
                pin: section1Ref.current,
                anticipatePin: 1,
                onUpdate: (self) => {
                    const progress = self.progress;

                    if (heroTitleRef.current && heroSubtitleRef.current && blurOverlayRef.current && serverModelContainerRef.current) {
                        gsap.set(heroTitleRef.current, {
                          x: `-${progress * 150}%`,
                          opacity: 1 - progress,
                        });
                    }
                    
                    if (heroSubtitleRef.current) {
                    gsap.set(heroSubtitleRef.current, {
                        x: `-${(progress * 100) - 10}%`,
                        opacity: 1 - progress,
                    });
                    }
                      
                    // Blur overlay animation
                    if (blurOverlayRef.current) {
                    gsap.set(blurOverlayRef.current, {
                        backdropFilter: `blur(${2 - (progress * 2)}px)`,
                        background: `rgba(255, 255, 255, ${0.4 - (progress * 0.4)})`,
                    });
                    }

                    if (window.innerWidth <= 425) {
                        // 3D model container scaling
                        if (serverModelContainerRef.current) {
                            gsap.set(serverModelContainerRef.current, {
                                scale: 1 + (progress * 0.8),
                            });
                        }

                    } else if (window.innerWidth <= 768) {
                        if (serverModelContainerRef.current) {
                            gsap.set(serverModelContainerRef.current, {
                                scale: 1 + (progress * 2.3),
                            });
                        }
                    } else if (window.innerWidth < 1024) {
                        if (serverModelContainerRef.current) {
                            gsap.set(serverModelContainerRef.current, {
                                scale: 1 + (progress * 3.4),
                            });
                        }
                    } else if (window.innerWidth < 1440) {
                        // Desktop screens 1024px to 1439px: Scale up while moving to center
                        if (serverModelContainerRef.current && window.innerWidth >= 1024) {
                            gsap.set(serverModelContainerRef.current, {
                                scale: 1 + (progress * 5),
                            });
                        }
                    } else {
                        // Large desktop screens >= 1440px: Enhanced scale and positioning
                        if (serverModelContainerRef.current) {
                            gsap.set(serverModelContainerRef.current, {
                                scale: 1 + (progress * 9.3),
                            });
                        }
                    }
                      
                    const serverObject = serverModelRef.current?.getServerObject();
                        if (serverObject) {
                            serverObject.rotation.y = progress * Math.PI * 1.5;
                        
                            if (window.innerWidth >= 1024 && window.innerWidth < 1440 && serverModelContainerRef.current) {
                                const centeringOffset = progress * 153;
                                gsap.set(serverModelContainerRef.current, {
                                    x: `-${centeringOffset}%`,
                                });
                            } else if (window.innerWidth >= 1440 && serverModelContainerRef.current) {
                                // Enhanced centering offset for large screens
                                const centeringOffset = progress * 260;
                                gsap.set(serverModelContainerRef.current, {
                                    x: `-${centeringOffset}%`,
                                });
                            }
                        }
                }
            },
        })

        gsap.timeline({
            scrollTrigger: {
                trigger: section2Ref.current,
                start: "top top",
                end: "+=300",
                pin: true,
                anticipatePin: 1,
                markers: false,
                // onUpdate: (self) => {
                //     const progress = self.progress;
                // }
            }
        })
        
        // Cleanup function
        return () => {
            // Stop memory monitoring and log results
            memoryMonitor.stopMonitoring();
            const finalSnapshot = memoryMonitor.takeSnapshot();
            
            console.log('🎯 Memory optimization session complete');
            console.log('Final memory state:', memoryMonitor.getMemoryStats());
            console.log('ModelManager final state:', modelManager.getCacheStats());
            
            // Log performance improvements
            if (initialSnapshot && finalSnapshot) {
                console.group('📊 Memory Optimization Summary');
                console.log('Session duration:', Math.round((finalSnapshot.timestamp - initialSnapshot.timestamp) / 1000), 'seconds');
                console.log('Models cached:', modelManager.getCacheStats().cachedModels);
                console.groupEnd();
            }
        };
        
    }, [])
    return (
        <main className={styles.SectionsContainer} ref={sectionsContainerRef}>
            <section className={`${styles.Section} ${styles.Section1}`} ref={section1Ref}>
                <div className={styles.BlurOverlay} ref={blurOverlayRef}></div>
                <div className={styles.ServerModelContainer} ref={serverModelContainerRef}>
                    <ServerModel3D 
                        className={styles.ServerModel3D}
                        ref={serverModelRef}
                        onModelLoaded={animateServerEntrance}
                    />
                </div>
                <div className={styles.HeroContent}>
                    <div className={styles.HeroTextContainer}>
                        <div className={styles.HeroTitle} ref={heroTitleRef}>
                            <span><h1>THE MOST EFFICIENT NODES ON <span className={styles.SolanaGradient}>SOLANA</span></h1></span>
                        </div>
                        <div className={styles.HeroSubtitle} ref={heroSubtitleRef}>
                            <h2>{"["}The first fully owned, performance-optimized RPC infrastructure built for Web3{"]"}</h2>
                        </div>
                    </div>
                </div>
            </section>

            

            <section className={`${styles.Section} ${styles.Section2}`} ref={section2Ref}>
            {/* <div className={styles.Section2Server} ref={server2ModelContainerRef}>
                    <ServerModel3D 
                    className={styles.Server2Model3D}
                    ref={server2ModelRef}
                    onModelLoaded={animateServer2Entrance}
                    zIndex={2}
                    cameraConfig={{
                        fov: 18, // Wider field of view to prevent corner clipping during rotation
                        position: { z: 13 }
                    }}
                />
                <div className={styles.BlurOverlay} ref={server2BlurOverlayRef}></div>
            </div> */}
                <div className={styles.Section2Inner} ref={section2InnerRef}>
                    <div className={styles.Section2TitleCard}>
                        <h1>WEB3</h1>
                    </div>
                    <div className={styles.Section2Content}></div>
                </div>
            </section>

            <section className={`${styles.Section} ${styles.Section3}`} ref={section3Ref}>
                
            </section>

            <section className={`${styles.Section} ${styles.Section4}`} ref={section4Ref}>
                <div className={styles.Section4Inner} ref={section4InnerRef}>

                </div>
            </section>

            <section className={`${styles.Section} ${styles.Section5}`} ref={section5Ref}>
                <div className={styles.Section5Inner} ref={section5InnerRef}>

                </div>
            </section>

            
        </main>
    )
}