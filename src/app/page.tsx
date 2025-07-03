'use client'
import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { FaDiscord, FaTelegram, FaTwitter } from "react-icons/fa";
import ServerModel3D from "../components/ServerModel";
import * as THREE from "three";

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

    if (!heroRef.current || !heroContentRef.current || !heroTitleRef.current || !blurOverlayRef.current) return;

    const backgroundModelContainer = document.querySelector(`.${styles.BackgroundModel3D}`);

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
          }

        }
      }      
    });

    gsap.set(heroTitleRef.current, {
      x: 0
    });

    // gsap.set(featuresSectionRef.current, {
    //   y: "100%"
    // });

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
      <div className={styles.MobileNav}>
          <div className={styles.SocialsContainer}>
            <a href="https://discord.gg/A8ANRdfMWJ" target="_blank" rel="noopener noreferrer"><FaDiscord className={styles.SocialIcon} id={styles.Discord} /></a>
            <FaTelegram className={styles.SocialIcon} id={styles.Telegram} />
            <FaTwitter className={styles.SocialIcon} id={styles.Twitter} />
          </div>
        </div>
      <section className={styles.HeroSection} ref={heroRef}>
        
        <div className={styles.BackgroundModel}>
          <ServerModel3D className={styles.BackgroundModel3D} ref={serverModelRef}/>
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
          <ServerModel3D className={styles.BackgroundModel3D} ref={serverModelFeatRef}/>
        </div>
      </section>
    </main>
  );
}