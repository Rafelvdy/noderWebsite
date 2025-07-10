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

gsap.registerPlugin(ScrollTrigger, SplitText);

type ServerModel3DRef = {
    getServerObject: () => THREE.Group | null;
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

    useEffect(() => {

        const lenis = new Lenis();
    
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

        const section1TL = gsap.timeline({
            scrollTrigger: {
                trigger: section1Ref.current,
                start: "top top",
                end: "bottom top",
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
                      
                      // 3D model container scaling
                      if (serverModelContainerRef.current) {
                        gsap.set(serverModelContainerRef.current, {
                          scale: 1 + (progress * 0.5),
                        });
                    }

                    const serverObject = serverModelRef.current?.getServerObject();
                    if (serverObject) {
                        serverObject.rotation.y = progress * Math.PI * 2.5;
                        
                        if (window.innerWidth >= 1024 && serverModelContainerRef.current) {
                            const centeringOffset = progress * 25;
                            gsap.set(serverModelContainerRef.current, {
                                x: `-${centeringOffset}%`,
                            });
                        }
                    }
                }
            },
        })
        
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
                <div className={styles.Section2Inner} ref={section2InnerRef}>
                    
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