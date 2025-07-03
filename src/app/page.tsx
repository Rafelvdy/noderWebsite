'use client'
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { FaDiscord, FaTelegram, FaTwitter } from "react-icons/fa";
import ServerModel3D from "../components/ServerModel";
import * as THREE from "three";
import * as React from "react";

// Import the ref type
type ServerModel3DRef = {
  getServerObject: () => THREE.Group | null;
};

gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const heroSubtitleRef = useRef<HTMLDivElement>(null);
  // const containerRef = useRef<HTMLDivElement>(null);
  const blurOverlayRef = useRef<HTMLDivElement>(null);
  const serverModelRef = useRef<ServerModel3DRef>(null);
  const serverModelFeatRef = useRef<ServerModel3DRef>(null);
  const featuresSectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
 
  // Animation function for server model entrance
  const animateServerEntrance = () => {
    const serverObject = serverModelRef.current?.getServerObject();
    
    if (serverObject) {
      // Animate model entrance with correct Three.js properties
      gsap.to(serverObject.position, {
        duration: 1.2,
        x: 0,
        ease: "expo.out",
      });

      gsap.to(serverObject.rotation, {
        duration: 1.2,
        y: -0.5,
        ease: "expo.out",
      });
    }
  };

  const animateServerFeatEntrance = () => {
    const serverObject = serverModelFeatRef.current?.getServerObject();

    if (serverObject) {
      gsap.to(serverObject.position, {
        scrollTrigger: {
          trigger: featuresSectionRef.current,
          start: "top bottom",
          end: "top center",
          scrub: 1,
          markers: true
        },
        duration: 1.2,
        x: 0,
        ease: "expo.out",
      });

      gsap.to(serverObject.rotation, {
        scrollTrigger: {
          trigger: featuresSectionRef.current,
          start: "10% bottom",
          end: "bottom top",
          scrub: 1,
          markers: true
        },
        y: -0.5,
        ease: "expo.out",
      });
      
    }
  }

  
  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis();

    lenis.on('scroll', () => {
      ScrollTrigger.update();
    })
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
      
    }
    requestAnimationFrame(raf);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1023);
    }

    window.addEventListener('resize', handleResize);

      

    if (!heroRef.current || !heroContentRef.current || !heroTitleRef.current || !blurOverlayRef.current) return;

    const backgroundModelContainer = document.querySelector(`.${styles.BackgroundModel3D}`);
    const backgroundModel = document.querySelector(`.${styles.BackgroundModel}`);
    // const serverObject = serverModelRef.current?.getServerObject();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        markers: false,
        onUpdate: (self) => {
          const progress = self.progress;
          const slideDistance = progress * 100;

          gsap.set(heroTitleRef.current, {
            x: `-${slideDistance*1.5}%`,
            opacity: 1 - progress,
            ease: "none"
          })

          gsap.set(heroSubtitleRef.current, {
            x: `-${slideDistance - 10}%`,
            opacity: 1 - progress,
            ease: "none"
          })

          // Animate both blur and white overlay to disappear
          gsap.set(blurOverlayRef.current, {
            backdropFilter: `blur(${2 - (progress * 2)}px)`, // From 2px to 0px
            background: `rgba(255, 255, 255, ${0.3 - (progress * 0.3)})`, // From 0.3 to 0 opacity
            ease: "none"
          })

          // Animate the 3D model container size to increase during scroll using transform scale (more efficient)
          // Note: We need a container ref for the model scaling - let's use the BackgroundModel div
          if (backgroundModelContainer) {
            gsap.set(backgroundModelContainer, {
              scale: 1 + (progress * 0.28), // From 1.0 to 1.428 (70% to 100% of container: 100/70 = 1.428),
              ease: "none"
            });
          }
          
          // Add server 360° rotation synced with scroll progress
          const serverObject = serverModelRef.current?.getServerObject();
          if (serverObject) {
            serverObject.rotation.y = progress * Math.PI * 2; // 360° rotation (0 to 2π radians)
            if (window.innerWidth >= 1024) {
              // Simple approach: Move the entire container leftward to center it
              // This works with the existing CSS offset instead of fighting it
              if (backgroundModel) {
                // Calculate how much to move left based on scroll progress
                // Start at 0 (stays right-aligned), end at desired centering offset
                const centeringOffset = progress * 25; // Adjust this value for centering effect
                
                gsap.set(backgroundModel, {
                  // x: `-${centeringOffset}%`,
                  transform: `translateX(-${centeringOffset}%)`,
                  ease: "none"
                });
              }
            }
          }

        }
      }      
    });

    gsap.set(heroTitleRef.current, {
      x: 0
    });


    return () => {
      tl.kill();
      // tl2.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        trigger.kill();
      });
    }
  }, []);
  
  return (
    <main>
      <div className={styles.MobileNav} style={{visibility: isMobile ? 'visible' : 'hidden'}}>
          <div className={styles.SocialsContainer}>
            <a href="https://discord.gg/A8ANRdfMWJ" target="_blank" rel="noopener noreferrer"><FaDiscord className={styles.SocialIcon} id={styles.Discord} /></a>
            <FaTelegram className={styles.SocialIcon} id={styles.Telegram} />
            <FaTwitter className={styles.SocialIcon} id={styles.Twitter} />
          </div>
        </div>
      <section className={styles.HeroSection} ref={heroRef}>
        
        <div className={styles.BackgroundModel}>
          <ServerModel3D 
            className={styles.BackgroundModel3D} 
            ref={serverModelRef}
            onModelLoaded={animateServerEntrance}
          />
        </div>
        <div className={styles.BlurOverlay} ref={blurOverlayRef}></div>
        <div className={styles.HeroContent} ref={heroContentRef}>
          <button className={styles.HeroButton}></button>
          <div className={styles.HeroTextContainer}>
            <div className={styles.HeroTitle} ref={heroTitleRef}>
              {/* <h1 className="split">THE MOST EFFICIENT NODES ON SOLANA</h1> */}
              <span>THE MOST EFFICIENT NODES ON <span className={styles.SolanaGradient}>SOLANA</span></span>
            </div>
            <div className={styles.HeroSubtitle} ref={heroSubtitleRef}>
              The first fully owned, performance-optimized RPC infrastructure built for Web3
            </div>
          </div>
          
        </div>
      </section>
      <section className={styles.FeaturesSection} ref={featuresSectionRef}>
        <div className={styles.BackgroundModel}>
          <ServerModel3D className={styles.BackgroundModel3D} ref={serverModelFeatRef} onModelLoaded={animateServerFeatEntrance}/>
        </div>
      </section>
    </main>
  );
}