'use client'
import { useEffect, useRef, useState, useCallback } from "react";
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

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const heroSubtitleRef = useRef<HTMLDivElement>(null);
  const blurOverlayRef = useRef<HTMLDivElement>(null);
  const serverModelRef = useRef<ServerModel3DRef>(null);
  const serverModelFeatRef = useRef<ServerModel3DRef>(null);
  const featuresSectionRef = useRef<HTMLDivElement>(null);
  const comparisonTableRef = useRef<HTMLDivElement>(null);
  // const aboutSectionRef = useRef<HTMLDivElement>(null);
  const backgroundModelRef = useRef<HTMLDivElement>(null);
  const backgroundModelFeatRef = useRef<HTMLDivElement>(null);
  const featuresCardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const spacerLine1Ref = useRef<HTMLDivElement>(null);
  const spacerLine2Ref = useRef<HTMLDivElement>(null);
  const spacerLine3Ref = useRef<HTMLDivElement>(null);
  const spacerLine4Ref = useRef<HTMLDivElement>(null);
  const spacerLine5Ref = useRef<HTMLDivElement>(null);
  const spacerLine6Ref = useRef<HTMLDivElement>(null);
  const spacerLine7Ref = useRef<HTMLDivElement>(null);
  const spacerLine8Ref = useRef<HTMLDivElement>(null);
  const spacerLine9Ref = useRef<HTMLDivElement>(null);
  const competitorTime1Ref = useRef<HTMLDivElement>(null);
  // const competitorTime2Ref = useRef<HTMLDivElement>(null);
  // const competitorTime3Ref = useRef<HTMLDivElement>(null);
  // Refs for caching DOM elements and objects
  const cachedElements = useRef<{
    backgroundModelContainer: Element | null;
    backgroundModel: Element | null;
    serverObject: THREE.Group | null;
  }>({
    backgroundModelContainer: null,
    backgroundModel: null,
    serverObject: null
  });

  const animationsRef = useRef<{
    mainTimeline: gsap.core.Timeline | null;
    comparisonTimeline: gsap.core.Timeline | null;
    lenis: Lenis | null;
    rafId: number | null;
  }>({
    mainTimeline: null,
    comparisonTimeline: null,
    lenis: null,
    rafId: null
  });

  // Memoized resize handler
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 1023);
  }, []);

  // Animation function for server model entrance
  const animateServerEntrance = useCallback(() => {
    const serverObject = serverModelRef.current?.getServerObject();
    
    if (serverObject && backgroundModelRef.current) {
      // Cache the server object
      cachedElements.current.serverObject = serverObject;
      
      // Use a timeline for better performance
      const entranceTl = gsap.timeline();
      
      entranceTl
        .to(backgroundModelRef.current, {
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

  const animateServerFeatEntrance = useCallback(() => {
    const serverObject = serverModelFeatRef.current?.getServerObject();

    if (serverObject && backgroundModelFeatRef.current && featuresSectionRef.current) {
      // Create timeline for features section
      const featTl = gsap.timeline({
        scrollTrigger: {
          trigger: featuresSectionRef.current,
          start: "30% bottom",
          end: "30% center",
          scrub: 1,
          markers: false,
        }
      });

      featTl.to(backgroundModelFeatRef.current, {
        left: "0%",
        ease: "expo.out",
      });

      gsap.to(serverObject.rotation, {
        scrollTrigger: {
          trigger: featuresSectionRef.current,
          start: "10% bottom",
          end: "bottom top",
          scrub: 1,
          markers: false
        },
        y: -0.5,
        ease: "expo.out",
      });
    }
  }, []);

  



  useEffect(() => {
    // Cache DOM elements early
    cachedElements.current.backgroundModelContainer = document.querySelector(`.${styles.BackgroundModel3D}`);
    cachedElements.current.backgroundModel = document.querySelector(`.${styles.BackgroundModel}`);
    
    const lenis = new Lenis();
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Set initial mobile state
    setIsMobile(window.innerWidth <= 1023);
    window.addEventListener('resize', handleResize);

    // Early return if required elements are not available
    if (!heroRef.current || !heroContentRef.current || !heroTitleRef.current || !blurOverlayRef.current) {
      return;
    }

    // Set initial state
    gsap.set(heroTitleRef.current, { x: 0 });

    // Main scroll-triggered animation with optimized update function
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true, // Use boolean for smoother scrubbing
        pin: true,
        anticipatePin: 1,
        markers: false,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Batch DOM updates using gsap.set for better performance
          const updates = [];
          
          // Hero text animations
          if (heroTitleRef.current) {
            updates.push([heroTitleRef.current, {
              x: `-${progress * 150}%`,
              opacity: 1 - progress,
            }]);
          }
          
          if (heroSubtitleRef.current) {
            updates.push([heroSubtitleRef.current, {
              x: `-${(progress * 100) - 10}%`,
              opacity: 1 - progress,
            }]);
          }
          
          // Blur overlay animation
          if (blurOverlayRef.current) {
            updates.push([blurOverlayRef.current, {
              backdropFilter: `blur(${2 - (progress * 2)}px)`,
              background: `rgba(255, 255, 255, ${0.3 - (progress * 0.3)})`,
            }]);
          }
          
          // 3D model container scaling
          if (cachedElements.current.backgroundModelContainer) {
            updates.push([cachedElements.current.backgroundModelContainer, {
              scale: 1 + (progress * 0.28),
            }]);
          }
          
          // Apply all updates at once
          updates.forEach(([element, props]) => {
            gsap.set(element as HTMLElement, props as gsap.TweenVars);
          });
          
          // Handle 3D model rotation and positioning
          const serverObject = cachedElements.current.serverObject || serverModelRef.current?.getServerObject();
          if (serverObject) {
            // Cache the server object for future use
            if (!cachedElements.current.serverObject) {
              cachedElements.current.serverObject = serverObject;
            }
            
            // Apply rotation directly to the Three.js object (most efficient)
            serverObject.rotation.y = progress * Math.PI * 2;
            
            // Desktop-specific positioning
            if (window.innerWidth >= 1024 && cachedElements.current.backgroundModel) {
              const centeringOffset = progress * 25;
              gsap.set(cachedElements.current.backgroundModel, {
                x: `-${centeringOffset}%`,
              });
            }
          }
        }
      }
    });

    animationsRef.current.mainTimeline = mainTl;

    gsap.set(featuresCardRef.current, {
      transform: "translateX(100%)",
      opacity: 0,
    })

    gsap.to(featuresCardRef.current, {
      x: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: featuresSectionRef.current,
        start: "top center",
        end: "+=50%",
        scrub: true,
      }
    })

    let split;
    SplitText.create(".split", {
      type: "words,lines",
      linesClass: "line",
      autoSplit: true,
      mask: "lines",
      onSplit: (self) => {
        split = gsap.from(self.lines, {
          duration: 0.6,
          yPercent: 100,
          opacity: 0,
          stagger: 0.1,
          ease: "expo.out",
        });
        return split;
      }
    });


    const FeaturesTextTL = gsap.timeline({
      scrollTrigger: {
        trigger: featuresSectionRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: false,
        toggleActions: "play none none reverse",
      }
    })

    FeaturesTextTL.fromTo(".split", {
      y: 100,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.1,
    }, "-=1.5")

    

    const ComparisonTableTL = gsap.timeline({
      scrollTrigger: {
        trigger: comparisonTableRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: true,
      }
    });
    
    ComparisonTableTL
      //First row
      .to(spacerLine1Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.15,
      }, 0.1)
      .to(spacerLine2Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.1,
      }, 0.15)
      .to(spacerLine3Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.05,
      }, 0.25)

      //Second row
      .to(spacerLine4Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.15,
      }, 0.25)
      .to(spacerLine5Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.1,
      }, 0.30)
      .to(spacerLine6Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.05,
      }, 0.35)

      //Third row
      .to(spacerLine7Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.15,
      }, 0.40)
      .to(spacerLine8Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.1,
      }, 0.45)
      .to(spacerLine9Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.05,
      }, 0.50)

      .to(competitorTime1Ref.current, {
        value: 1,
        duration: 1,
        ease: "power2.out",
        onUpdate: (self) => {
          const currentValue = Math.round(self.target.textContent * 100)/ 100;
          if (competitorTime1Ref.current) {
            competitorTime1Ref.current.textContent = `${currentValue}s`;
          }
        }
      }, 0.50)

    // // Store the timeline reference to avoid unused variable warning
    // animationsRef.current.comparisonTimeline = ComparisonTableTL;

    // Cleanup function
    return () => {
      // Cancel RAF
      if (animationsRef.current.rafId) {
        cancelAnimationFrame(animationsRef.current.rafId);
      }
      
      // Kill timelines
      if (animationsRef.current.mainTimeline) {
        animationsRef.current.mainTimeline.kill();
      }
      if (animationsRef.current.comparisonTimeline) {
        animationsRef.current.comparisonTimeline.kill();
      }
      
      // Destroy lenis
      if (animationsRef.current.lenis) {
        animationsRef.current.lenis.destroy();
      }
      
      // Kill all ScrollTriggers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      
      // Clear cached elements
      cachedElements.current = {
        backgroundModelContainer: null,
        backgroundModel: null,
        serverObject: null
      };
    };
  }, [handleResize, animateServerEntrance, animateServerFeatEntrance]);
  
  return (
    <main>
      <div className={styles.MobileNav} style={{visibility: isMobile ? 'visible' : 'hidden'}}>
        <div className={styles.SocialsContainer}>
          <a href="https://discord.gg/A8ANRdfMWJ" target="_blank" rel="noopener noreferrer">
            <FaDiscord className={styles.SocialIcon} id={styles.Discord} />
          </a>
          <FaTelegram className={styles.SocialIcon} id={styles.Telegram} />
          <FaTwitter className={styles.SocialIcon} id={styles.Twitter} />
        </div>
      </div>
      
      <section className={styles.HeroSection} ref={heroRef}>
        <div className={styles.BackgroundModel} ref={backgroundModelRef}>
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
              <span>THE MOST EFFICIENT NODES ON <span className={styles.SolanaGradient}>SOLANA</span></span>
            </div>
            <div className={styles.HeroSubtitle} ref={heroSubtitleRef}>
              The first fully owned, performance-optimized RPC infrastructure built for Web3
            </div>
          </div>
        </div>
      </section>
      
      {/* <section className={styles.AboutSection} ref={aboutSectionRef}>
        <div className={styles.BackgroundContainer}>
          <div className={styles.BackgroundStrip} id={styles.BackgroundStrip1} ref={backgroundStrip1Ref}></div>
          <div className={styles.BackgroundStrip} id={styles.BackgroundStrip2} ref={backgroundStrip2Ref}></div>
          <div className={styles.BackgroundStrip} id={styles.BackgroundStrip3} ref={backgroundStrip3Ref}></div>
        </div>
      </section> */}
      
      <section className={styles.FeaturesSection} ref={featuresSectionRef}>
        <div className={styles.FeaturesBackgroundModel} ref={backgroundModelFeatRef}>
          <div className={styles.FeaturesCard} ref={featuresCardRef}>
            <div className={styles.FeaturesCardContent}>
              <div className={styles.FeaturesCardDescription} id={styles.SecondaryDescription}><h3 className="split">Centralized infra introduces single points of failure, performance bottlenecks, and censorship risk.</h3></div>
              <div className={styles.FeaturesCardTitle}><h2>WEB3 IS STILL HEAVILY RELYING ON WEB2</h2></div>
              <div className={styles.FeaturesCardDescription} id={styles.PrimaryDescription}><h3 className="split">Most &quot;decentralized&quot; projects rely on cloud providers like AWS of GCP. When those go down, so do their nodes.</h3></div>
            </div>
          </div>
          {/* <ServerModel3D className={styles.FeaturesBackgroundModel3D} ref={serverModelFeatRef} onModelLoaded={animateServerFeatEntrance}/> */}
        </div>
      </section>

      <section className={styles.ComparisonTableSection} ref={comparisonTableRef}>
        <div className={styles.ComparisonTableContainer}>
          <div className={styles.ComparisonTableHeader}>
            <h1>Our Average Confirmation Latency</h1>
          </div>
          <div className={styles.ComparisonTableBody}>
            <div className={styles.ComparisonRow} id={styles.NoderRow}>
              <div className={styles.SpacerContainer} id={styles.SpacerContainer1}>
                <div className={styles.SpacerLine} id={styles.SpacerLine1} ref={spacerLine1Ref}></div>
                <div className={styles.SpacerLine} id={styles.SpacerLine2} ref={spacerLine2Ref}></div>
                <div className={styles.SpacerLine} id={styles.SpacerLine3} ref={spacerLine3Ref}></div>
              <div className={styles.ComparisonRowContent}>
                <div className={styles.CompetitorName} id={styles.NoderName}>
                  <h2>Noder</h2>
                </div>
                <div className={styles.CompetitorData}>
                  <div className={styles.SpeedBar}>
                    <div className={styles.SpeedBarFill} id={styles.HeliusFill}></div>
                  </div>
                </div>
                <div className={styles.CompetitorTimeContainer}>
                  <div className={styles.CompetitorTime} ref={competitorTime1Ref}>Xs</div>
                </div>
              </div>
              </div>
            </div>

            <div className={styles.ComparisonRow}>
              <div className={styles.SpacerContainer} id={styles.SpacerContainer1}>
                <div className={styles.SpacerLine} id={styles.SpacerLine4} ref={spacerLine4Ref}></div>
                <div className={styles.SpacerLine} id={styles.SpacerLine5} ref={spacerLine5Ref}></div>
                <div className={styles.SpacerLine} id={styles.SpacerLine6} ref={spacerLine6Ref}></div>
              <div className={styles.ComparisonRowContent}>
                <div className={styles.CompetitorName}>
                  <h2>Competitor T</h2>
                </div>
                <div className={styles.CompetitorData}>
                  <div className={styles.SpeedBar}>
                    <div className={styles.SpeedBarFill} id={styles.CompetitorTFill}></div>
                  </div>
                </div>
                <div className={styles.CompetitorTimeContainer}>
                  <div className={styles.CompetitorTime}>1.28s</div>
                </div>
              </div>
              </div>
            </div>

            <div className={styles.ComparisonRow}>
              <div className={styles.SpacerContainer} id={styles.SpacerContainer1}>
                <div className={styles.SpacerLine} id={styles.SpacerLine7} ref={spacerLine7Ref}></div>
                <div className={styles.SpacerLine} id={styles.SpacerLine8} ref={spacerLine8Ref}></div>
                <div className={styles.SpacerLine} id={styles.SpacerLine9} ref={spacerLine9Ref}></div>
              <div className={styles.ComparisonRowContent}>
                <div className={styles.CompetitorName}>
                  <h2>Competitor Q</h2>
                </div>
                <div className={styles.CompetitorData}>
                  <div className={styles.SpeedBar}>
                    <div className={styles.SpeedBarFill} id={styles.CompetitorQFill}></div>
                  </div>
                </div>
                <div className={styles.CompetitorTimeContainer}>
                  <div className={styles.CompetitorTime}>4.81s</div>
                </div>
              </div>
              </div>
            </div>
            <div className={styles.ComparisonTableFooter}>
              <div className={styles.MultiplierContainer}>
                <div className={styles.MultiplierBackground}></div>
              </div>
              <div className={styles.MultiplierTextContainer}>
                {/* <h2><span>10x</span></h2> */}
                <h2>?x</h2>
              </div>
              <div className={styles.MultiplierSubTextContainer}>
                FASTER THAN THE COMPETITION
              </div>
            </div>
          </div>
         
        </div>
      </section>
    </main>
  );
}