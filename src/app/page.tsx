'use client'
import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { FaDiscord, FaTelegram, FaTwitter } from "react-icons/fa";
import ServerModel3D from "../components/ServerModel";

gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const heroSubtitleRef = useRef<HTMLDivElement>(null);
  // const containerRef = useRef<HTMLDivElement>(null);
  const blurOverlayRef = useRef<HTMLDivElement>(null);
  const backgroundModel3DRef = useRef<HTMLDivElement>(null);

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

    // Initialize text animations when fonts are ready
    // document.fonts.ready.then(() => {
    //   gsap.set(".split", { opacity: 1 });

    //   let split;
    //   SplitText.create(".split", {
    //     type: "words,lines",
    //     linesClass: "line",
    //     autoSplit: true,
    //     mask: "lines",
    //     onSplit: (self) => {
    //       split = gsap.from(self.lines, {
    //         duration: 0.5,
    //         yPercent: 100,
    //         opacity: 0,
    //         stagger: 0.1,
    //         ease: "expo.out"
    //       });
    //       return split;
    //     }
    //   });
    // });

    if (!heroRef.current || !heroContentRef.current || !heroTitleRef.current || !blurOverlayRef.current || !backgroundModel3DRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        markers: true,
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

          // gsap.set(containerRef.current, {
          //   height: `${100 + progress*100}%`,
          //   ease: "none"
          // })

          // Animate both blur and white overlay to disappear
          gsap.set(blurOverlayRef.current, {
            backdropFilter: `blur(${2 - (progress * 2)}px)`, // From 2px to 0px
            background: `rgba(255, 255, 255, ${0.3 - (progress * 0.3)})`, // From 0.3 to 0 opacity
            ease: "none"
          })

          // Animate the 3D model size to increase during scroll using transform scale (more efficient)
          gsap.set(backgroundModel3DRef.current, {
            scale: 1 + (progress * 0.28), // From 1.0 to 1.428 (70% to 100% of container: 100/70 = 1.428)
            y: `${progress * 10}%`,
            ease: "none"
          })
          
          

        }
      }
    });

    gsap.set(heroTitleRef.current, {
      x: 0
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        trigger.kill();
      });
    }
  }, []);

  return (
    <main>
      <section className={styles.HeroSection} ref={heroRef}>
        <div className={styles.MobileNav}>
          <div className={styles.SocialsContainer}>
            <a href="https://discord.gg/A8ANRdfMWJ" target="_blank" rel="noopener noreferrer"><FaDiscord className={styles.SocialIcon} id={styles.Discord} /></a>
            <FaTelegram className={styles.SocialIcon} id={styles.Telegram} />
            <FaTwitter className={styles.SocialIcon} id={styles.Twitter} />
          </div>
        </div>
        <div className={styles.BackgroundModel}>
          <ServerModel3D className={styles.BackgroundModel3D} ref={backgroundModel3DRef}/>
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
          {/* <div className={styles.HeroTitle} ref={heroTitleRef}>
            <h1 className="split">THE MOST EFFICIENT NODES ON SOLANA</h1>
            <div className={styles.HeroSubtitle} ref={heroSubtitleRef}>
            <h2>The first fully owned, performance-optimized RPC infrastructure built for Web3</h2>
            </div>
          </div> */}
          
        </div>
      </section>
      <section className={styles.FeaturesSection}></section>
    </main>
  );
}