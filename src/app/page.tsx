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
import Image from "next/image";


// Import the ref type
// type ServerModel3DRef = {
//   getServerObject: () => THREE.Group | null;
// };

// Interface for SplitText characters with original text property
interface SplitTextChar extends HTMLElement {
  orig?: string | null;
}


gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const heroSubtitleRef = useRef<HTMLDivElement>(null);
  const blurOverlayRef = useRef<HTMLDivElement>(null);
  const serverModelRef = useRef<React.ElementRef<typeof ServerModel3D>>(null);
  const serverModelFeatRef = useRef<React.ElementRef<typeof ServerModel3D>>(null);
  const featuresSectionRef = useRef<HTMLDivElement>(null);
  const comparisonTableRef = useRef<HTMLDivElement>(null);
  const backgroundModelRef = useRef<HTMLDivElement>(null);
  const backgroundModelFeatRef = useRef<HTMLDivElement>(null);
  const featuresCardRef = useRef<HTMLDivElement>(null);
  const featuresCardTitleRef = useRef<HTMLDivElement>(null);
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
  const multiplierSubTextRef = useRef<HTMLDivElement>(null);
  const noderSpeedBarRef = useRef<HTMLDivElement>(null);
  const competitorTFillRef = useRef<HTMLDivElement>(null);
  const competitorQFillRef = useRef<HTMLDivElement>(null);
  const competitorTime2Ref = useRef<HTMLDivElement>(null);
  const competitorTime3Ref = useRef<HTMLDivElement>(null);
  const socialProofSectionRef = useRef<HTMLDivElement>(null);
  const socialProofTitleRef = useRef<HTMLDivElement>(null);
  const PerformanceAccordionRef = useRef<HTMLDivElement>(null);
  const SovereigntyAccordionRef = useRef<HTMLDivElement>(null);
  const SecurityAccordionRef = useRef<HTMLDivElement>(null);
  const DifferencesSectionRef = useRef<HTMLDivElement>(null);
  const DifferencesTitleRef1 = useRef<HTMLDivElement>(null);
  const DifferencesTitleRef2 = useRef<HTMLDivElement>(null);
  const DifferencesSubtitleRef = useRef<HTMLDivElement>(null);
  const DifferencesAccordionContainerRef = useRef<HTMLDivElement>(null);
  const CTABoldTextRef = useRef<HTMLDivElement>(null);
  const CTABoldTextSpanRef = useRef<HTMLSpanElement>(null);
  const secondaryDescriptionRef = useRef<HTMLDivElement>(null);
  const primaryDescriptionRef = useRef<HTMLDivElement>(null);
  const serverModelContainerRef = useRef<HTMLDivElement>(null);
  const discordRef = useRef<HTMLAnchorElement>(null);
  const telegramRef = useRef<HTMLAnchorElement>(null);
  const twitterRef = useRef<HTMLAnchorElement>(null);
  const testimonial1Ref = useRef<HTMLDivElement>(null);
  const testimonial2Ref = useRef<HTMLDivElement>(null);
  const testimonial3Ref = useRef<HTMLDivElement>(null);
  const textCarouselRef = useRef<HTMLDivElement>(null);
  const logosCarouselRef = useRef<HTMLDivElement>(null);


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
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          markers: false,
          
        },
        y: -0.5,
        ease: "expo.out",
      });
    }
  }, []);


  



  useEffect(() => {
    // CRITICAL: Force scroll to top before any animations initialize
    // This prevents browser scroll restoration and ensures clean starting state
    if (typeof window !== 'undefined') {
      // Disable browser scroll restoration
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      
      // Force immediate scroll to top
      window.scrollTo(0, 0);
      
      // Also set document scroll position for compatibility
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    // Cache DOM elements early
    cachedElements.current.backgroundModelContainer = document.querySelector(`.${styles.BackgroundModel3D}`);
    cachedElements.current.backgroundModel = document.querySelector(`.${styles.BackgroundModel}`);
    
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

    // Store lenis reference for cleanup
    animationsRef.current.lenis = lenis;

    // Capture animation references for cleanup
    const currentAnimations = animationsRef.current;

    // Mobile Navigation variables
    let mobileNavExpandTimeline: gsap.core.Timeline | null = null;
    let mobileNavScrollTrigger: ScrollTrigger | null = null;
    let isExpanded = false;

    // Set initial mobile state
    setIsMobile(window.innerWidth <= 1023);
    window.addEventListener('resize', handleResize);

    // Safety: Restore scroll restoration on page unload
    const handleBeforeUnload = () => {
      if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Early return if required elements are not available
    if (!heroRef.current || !heroContentRef.current || !heroTitleRef.current || !blurOverlayRef.current) {
      return;
    }

    // Set initial state
    gsap.set(heroTitleRef.current, { x: 0 });

    // Wait for DOM to be ready and then setup mobile navigation
    requestAnimationFrame(() => {
      // Mobile Navigation Expansion Logic - check window width directly to avoid race condition
      if (window.innerWidth <= 1023) {        
        // Create the expansion timeline
        mobileNavExpandTimeline = gsap.timeline({ paused: true });
        
        mobileNavExpandTimeline
          .to(discordRef.current, {
            transform: 'translateX(0px)', // Move from -15px (CSS) to 0px (15px expansion)
            duration: 0.4,
            ease: 'power2.out'
          }, 0)
          .to(telegramRef.current, {
            transform: 'translateX(0px)', // Move from -15px (CSS) to 0px (15px expansion)
            duration: 0.4,
            ease: 'power2.out'
          }, 0)
          .to(twitterRef.current, {
            transform: 'translateX(0px)', // Move from -15px (CSS) to 0px (15px expansion)
            duration: 0.4,
            ease: 'power2.out'
          }, 0);

        console.log('Mobile nav timeline created successfully');
        
        // ScrollTrigger for direction detection
        mobileNavScrollTrigger = ScrollTrigger.create({
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            const direction = self.direction;
            const scrollY = window.scrollY;
            
            console.log('Scroll direction:', direction, 'ScrollY:', scrollY, 'isExpanded:', isExpanded);
            
            // Expand on downward scroll
            if (direction === 1 && scrollY > 30 && !isExpanded) {
              console.log('Expanding mobile nav');
              mobileNavExpandTimeline?.play();
              isExpanded = true;
            }
            // Contract on upward scroll when near top
            else if (direction === -1 && isExpanded) {
              console.log('Contracting mobile nav');
              mobileNavExpandTimeline?.reverse();
              isExpanded = false;
            }
          }
        });
      } 
    });

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
    
    if (window.innerWidth >= 1024) {    
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        markers: false,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(backgroundModelRef.current, {
            x: `${-25 - (progress * 100)}%`,
            // opacity: 1 - progress,
            ease: "expo.out",

          })
        }
      });
    }

    const featuresTL = gsap.timeline({
      scrollTrigger: {
        trigger: featuresSectionRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: true,
      }
    })


    if (serverModelContainerRef.current) {
      gsap.set(serverModelContainerRef.current, {
        x: "-150%",
      })

      gsap.to(serverModelContainerRef.current, {
        scrollTrigger: {
          trigger: featuresSectionRef.current,
          start: "top top",
          toggleActions: "play none none reverse",
        },
        x: "0%",
        duration: 1.2,
        ease: "power2.out",
      })
    }

    const split = SplitText.create(featuresCardTitleRef.current, {
      type: "words",
      wordsClass: "Word",
      mask: "lines",
      autoSplit: true,
    });
    

    gsap.set(split.words, { 
      opacity: 0, 
      y: 100,
      rotate: -45,
    });

    gsap.set(secondaryDescriptionRef.current, {
      height: "0%",
      opacity: 0,
    });
    gsap.set(primaryDescriptionRef.current, {
      height: "0%",
      opacity: 0,
    });

    featuresTL
      .to(split.words, {
        opacity: 1,
        y: 0,
        rotate: 0,
        duration: 0.3,
        ease: "expo.out",
        stagger: 0.05,
      })
      .to(primaryDescriptionRef.current, {
        height: "35%",
        ease: "power2.out",
        duration: 0.5,
        opacity: 1,
      })
      .to(secondaryDescriptionRef.current, {
        height: "35%",
        ease: "power2.out",
        duration: 0.5,
        opacity: 1,
      })


    
   

    gsap.set(socialProofTitleRef.current, { opacity: 1 });
    const SocialProofTL = gsap.timeline({
      scrollTrigger: {
        trigger: socialProofSectionRef.current,
        start: "top top",
        end: "300% bottom",
        pin: true,
        scrub: true,
        markers: false,
      }
    })

    gsap.set(textCarouselRef.current, {
      transform: "translateX(100%)",
    })

    gsap.set(logosCarouselRef.current, {
      transform: "translateX(-100%)",
    })

    // gsap.set(testimonial1Ref.current, {
    //   transform: "translateY(150%)",
    // })

    SocialProofTL
      .to(textCarouselRef.current, {
        transform: "translateX(0%)",
      })
      .to(logosCarouselRef.current, {
        transform: "translateX(0%)",
      }, "<")
      .to(testimonial1Ref.current, {
        bottom: "25%",
        duration: 0.5,
      })
      .to({}, {duration: 0.5})
      .to(testimonial1Ref.current, {
        bottom: "100%",
        duration: 0.5,
      })
      .to(testimonial2Ref.current, {
        bottom: "25%",
        duration: 0.5,
      })
      .to({}, {duration: 0.5})
      .to(testimonial2Ref.current, {
        bottom: "100%",
        duration: 0.5,
      })
      .to(testimonial3Ref.current, {
        bottom: "25%",
        duration: 0.5,
      })
      .to({}, {duration: 0.5})
      .to(testimonial3Ref.current, {
        bottom: "100%",
        duration: 0.5,
      })


    const ComparisonTableTL = gsap.timeline({
      scrollTrigger: {
        trigger: comparisonTableRef.current,
        start: "top center",
        end: "100% bottom",
        pin: false,
        scrub: false,
        markers: false,
      }
    });
    
    ComparisonTableTL
      //First row
      .to(spacerLine1Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.3,
      }, 0.1)
      .to(spacerLine2Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.25,
      }, 0.15)
      .to(spacerLine3Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.2,
      }, 0.25)

      //Second row
      .to(spacerLine4Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.3,
      }, 0.25)
      .to(spacerLine5Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.25,
      }, 0.30)
      .to(spacerLine6Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.2,
      }, 0.35)

      //Third row
      .to(spacerLine7Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.3,
      }, 0.40)
      .to(spacerLine8Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.25,
      }, 0.45)
      .to(spacerLine9Ref.current, {
        yPercent: -100,
        ease: "none",
        duration: 0.2,
      }, 0.50)
      .to(multiplierSubTextRef.current, {
        height: "30%",
        ease: "power2.out",
        duration: 0.5,
      }, 0.50)
      // Separate non-scrubbed countup animation - triggers when first row is revealed
      .to({ value: 0 }, {
        value: 0.32,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: function() {
          const currentValue = Math.round(this.targets()[0].value * 100) / 100;
          if (competitorTime1Ref.current) {
            competitorTime1Ref.current.textContent = `${currentValue.toFixed(2)}s`;
            const fillPercentage = (currentValue/3) * 100;
            if (noderSpeedBarRef.current) {
              noderSpeedBarRef.current.style.width = `${fillPercentage}%`;
            }
          }
        }
      }, ">")
      .to({ value: 0 }, {
        value: 1.28,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: function() {
          const currentValue = Math.round(this.targets()[0].value * 100) / 100;
          if (competitorTime2Ref.current) {
            competitorTime2Ref.current.textContent = `${currentValue.toFixed(2)}s`;
            const fillPercentage = (currentValue/3) * 100;
            if (competitorTFillRef.current) {
              competitorTFillRef.current.style.width = `${fillPercentage}%`;
            }
          }
        }
      }, "<")
      .to({ value: 0 }, {
        value: 2.5,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: function() {  
          const currentValue = Math.round(this.targets()[0].value * 100) / 100;
          if (competitorTime3Ref.current) {
            competitorTime3Ref.current.textContent = `${currentValue.toFixed(2)}s`;
            const fillPercentage = (currentValue/3) * 100;
            if (competitorQFillRef.current) {
              competitorQFillRef.current.style.width = `${fillPercentage}%`;
            }
          }
        }
      }, "<")
      
      

    gsap.set(noderSpeedBarRef.current, {
      width: "0%",
    })

    gsap.set(competitorTFillRef.current, {
      width: "0%",
    })
    gsap.set(competitorQFillRef.current, {
      width: "0%",
    })

    gsap.set(multiplierSubTextRef.current, {
      height: "0%",
    })

    // Instead of setting accordion item heights, set content heights to 0
    // The titles will now always be visible due to CSS min-height
    if (PerformanceAccordionRef.current) {
      const contentEl = PerformanceAccordionRef.current.querySelector(`.${styles.DifferencesAccordionItemContent}`);
      if (contentEl) {
        gsap.set(contentEl, { height: 0 });
      }
    }

    if (SovereigntyAccordionRef.current) {
      const contentEl = SovereigntyAccordionRef.current.querySelector(`.${styles.DifferencesAccordionItemContent}`);
      if (contentEl) {
        gsap.set(contentEl, { height: 0 });
      }
    }

    if (SecurityAccordionRef.current) {
      const contentEl = SecurityAccordionRef.current.querySelector(`.${styles.DifferencesAccordionItemContent}`);
      if (contentEl) {
        gsap.set(contentEl, { height: 0 });
      }
    }

    const DifferencesTitleSplit1 = SplitText.create(DifferencesTitleRef1.current, {
      type: "lines",
      linesClass: "line",
      autoSplit: true,
      mask: "lines",
      onSplit: (self) => {
        gsap.set(self.lines, {
          yPercent: -100,          
        })
      }
    })

    const DifferencesTitleSplit2 = SplitText.create(DifferencesTitleRef2.current, {
      type: "lines",
      linesClass: "line",
      autoSplit: true,
      mask: "lines",
      onSplit: (self) => {
        gsap.set(self.lines, {
          yPercent: 100,
        })
      }
    })

    // Setup scramble text for differences subtitle
    const DifferencesSubtitleSplit = SplitText.create(DifferencesSubtitleRef.current, {
      type: "chars",
      charsClass: "char",
    })

    DifferencesSubtitleSplit.chars.forEach((char) => (char as SplitTextChar).orig = char.textContent)

    const upperAndLowerCase = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const getRandomLetter = () => upperAndLowerCase[Math.floor(Math.random() * upperAndLowerCase.length)];

    // Set initial scrambled state
    gsap.set(DifferencesSubtitleSplit.chars, {
      textContent: function() {
        return getRandomLetter();
      }
    });

    ScrollTrigger.create({
      trigger: DifferencesSectionRef.current,
      start: "top center",
      onEnter: () => {
        gsap.to(DifferencesTitleSplit1.lines, {
          yPercent: 0,
          duration: 0.8,
          ease: "expo.out",
        })
      }
    })

    
    gsap.set(DifferencesAccordionContainerRef.current, {
      width: "0%",
    })

    ScrollTrigger.create({
      trigger: DifferencesSectionRef.current,
      start: "top top",
      onEnter: () => {
        gsap.to(DifferencesTitleSplit2.lines, {
          yPercent: 0,
          duration: 0.5,
          ease: "expo.out",
        })

        gsap.to(DifferencesAccordionContainerRef.current, {
          width: "100%",
          duration: 1,
          ease: "expo.out",
        })
      }
    })

    // Scramble text animation for differences subtitle
    ScrollTrigger.create({
      trigger: DifferencesSectionRef.current,
      start: "top center",
      onEnter: () => {
        // Animate each character with scramble effect
        DifferencesSubtitleSplit.chars.forEach((char, index) => {
          gsap.to(char, {
            duration: 0.01 + (index * 0.001), // Stagger the animation
            ease: "none",
            repeat: 8, // Number of scramble iterations
            yoyo: false,
            onUpdate: function() {
              if (this.progress() < 0.8) {
                char.textContent = getRandomLetter();
              } else {
                char.textContent = (char as SplitTextChar).orig ?? null;
              }
            },
            onComplete: function() {
              char.textContent = (char as SplitTextChar).orig ?? null;
            }
          });
        });
      }
    })

    // const CTAButtonTL = gsap.timeline({
    //   trigger: CTABoldTextRef.current,
    //   onMouseEnter: () => {
    //     console.log("Mouse entered")
    //     gsap.to(CTABoldTextSpanRef.current, {
    //       transform: "translateY(100%)",
    //     })
    //   }
    // })

    CTABoldTextRef.current?.addEventListener("mouseenter", () => {
      console.log("Mouse entered")
      gsap.to(CTABoldTextSpanRef.current, {
        yPercent: 100,
      })
    })

    // const CTAButtonTL = gsap.timeline({
    //   onMouseEnter: () => {
    //     gsap.to(CTABoldTextRef.current, {
    //       width: ""
    //     })
    //   }
    // })
   

    // Cleanup function
    return () => {
      // Restore browser scroll restoration
      if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
      
      // Cancel RAF
      if (currentAnimations.rafId) {
        cancelAnimationFrame(currentAnimations.rafId);
      }
      
      // Kill timelines
      if (currentAnimations.mainTimeline) {
        currentAnimations.mainTimeline.kill();
      }
      if (currentAnimations.comparisonTimeline) {
        currentAnimations.comparisonTimeline.kill();
      }
      
      // Destroy lenis
      if (currentAnimations.lenis) {
        currentAnimations.lenis.destroy();
      }
      
      // Kill all ScrollTriggers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Mobile Navigation Cleanup
      if (mobileNavExpandTimeline) {
        mobileNavExpandTimeline.kill();
      }
      if (mobileNavScrollTrigger) {
        mobileNavScrollTrigger.kill();
      }
      
      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
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
          <div className={styles.StackedIcons}>
            <a href="https://discord.gg/A8ANRdfMWJ" target="_blank" rel="noopener noreferrer" ref={discordRef}>
              <FaDiscord className={styles.SocialIcon} id={styles.Discord}  />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" ref={telegramRef}>
              <FaTelegram className={styles.SocialIcon} id={styles.Telegram}  />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" ref={twitterRef}>
              <FaTwitter className={styles.SocialIcon} id={styles.Twitter} />
            </a>
          </div>
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
              <span><h1>THE MOST EFFICIENT NODES ON <span className={styles.SolanaGradient}>SOLANA</span></h1></span>
            </div>
            <div className={styles.HeroSubtitle} ref={heroSubtitleRef}>
              <h2>{"["}The first fully owned, performance-optimized RPC infrastructure built for Web3{"]"}</h2>
            </div>
          </div>
        </div>
      </section>
      
      <section className={styles.FeaturesSection} ref={featuresSectionRef}>
        <div className={styles.FeaturesBackgroundModel} ref={backgroundModelFeatRef}>
          <div className={styles.ServerModelContainer} style={{display: isMobile ? "none" : "flex"}} ref={serverModelContainerRef}>
            <ServerModel3D 
              className={styles.FeaturesBackgroundModel3D} 
              ref={serverModelFeatRef}
            />
          </div>
          <div className={styles.FeaturesCard} ref={featuresCardRef}>
            <div className={styles.FeaturesCardContent}>
              <div className={styles.FeaturesCardDescription} id={styles.SecondaryDescription} ref={secondaryDescriptionRef}><h3 className="split">Centralized infra introduces single points of failure, performance bottlenecks, and censorship risk.</h3></div>
              <div className={styles.FeaturesCardTitle} ref={featuresCardTitleRef} ><h2> WEB3 IS STILL HEAVILY RELYING ON WEB2</h2></div>
              <div className={styles.FeaturesCardDescription} id={styles.PrimaryDescription} ref={primaryDescriptionRef}><h3 className="split">Most &quot;decentralized&quot; projects rely on cloud providers like AWS of GCP. When those go down, so do their nodes.</h3></div>
            </div>
          </div>
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
                    <div className={styles.SpeedBarFill} id={styles.NoderFill} ref={noderSpeedBarRef}></div>
                  </div>
                </div>
                <div className={styles.CompetitorTimeContainer}>
                  <div className={styles.CompetitorTime} ref={competitorTime1Ref}>0.00s</div>
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
                    <div className={styles.SpeedBarFill} id={styles.CompetitorTFill} ref={competitorTFillRef}></div>
                  </div>
                </div>
                <div className={styles.CompetitorTimeContainer}>
                  <div className={styles.CompetitorTime} ref={competitorTime2Ref}>0.00s</div>
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
                    <div className={styles.SpeedBarFill} id={styles.CompetitorQFill} ref={competitorQFillRef}></div>
                  </div>
                </div>
                <div className={styles.CompetitorTimeContainer}>
                  <div className={styles.CompetitorTime} ref={competitorTime3Ref}>0.00s</div>
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
              <div className={styles.MultiplierSubTextContainer} ref={multiplierSubTextRef}>
                FASTER THAN THE COMPETITION
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className={styles.SocialProofSection} ref={socialProofSectionRef}>
        <div className={styles.SocialProofContent}>
        <div className={styles.SocialProofTitleContainer}>
          <div className={styles.TextCarousel} ref={textCarouselRef}>
            <div className={styles.TextSlideWrapper}>
              <div className={styles.TextSlide}>
                <h1>TRUSTED BY LEADING BUILDERS IN WEB3.</h1>
              </div>
              <div className={styles.TextSlide}>
                <h1>TRUSTED BY LEADING BUILDERS IN WEB3.</h1>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.TestimonialContainer}>
          <div className={styles.TestimonialBox} ref={testimonial1Ref}>
            <p className={styles.TestimonialText}>&quot;We went from 0 to 100 real fast. By real fast, I mean instantly. Because this is a demo and that&apos;s how demos work.&quot;</p>
            <div className={styles.TestimonialAuthor}>Theo Fisher Lee</div>
          </div>
          <div className={styles.TestimonialBox} ref={testimonial2Ref}>
            <p className={styles.TestimonialText}>&quot;If this were a real testimonial, I&apos;d be genuinely impressed. But hey, it still looks great!&quot;</p>
            <div className={styles.TestimonialAuthor}>Michael Hardingding</div>
          </div>
          <div className={styles.TestimonialBox} ref={testimonial3Ref}>
            <p className={styles.TestimonialText}>&quot;We went from 0 to 100 real fast. By real fast, I mean instantly. Because this is a demo and that&apos;s how demos work.&quot;</p>
            <div className={styles.TestimonialAuthor}>Theo Fisher Lee</div>
          </div>
        </div>
        <div className={styles.LogosCarousel} ref={logosCarouselRef}>
          <div className={styles.LogoSlideWrapper}>
            <div className={styles.LogoSlide}>
              <Image src="/logo-carousel/Allianz.png" alt="Allianz" width={100} height={100} objectFit="contain" className={styles.Logo} />
              <Image src="/logo-carousel/apple.png" alt="Apple" width={100} height={100} objectFit="contain" className={styles.Logo} />
              <Image src="/logo-carousel/Cloudflare_Logo.png" alt="Cloudflare" width={100} height={100} objectFit="contain" className={styles.Logo} />
              <Image src="/logo-carousel/Colt.png" alt="Colt" width={100} height={100} objectFit="contain" className={styles.Logo} />
              <Image src="/logo-carousel/Logonetflix.png" alt="Netflix" width={100} height={100} objectFit="contain" className={styles.Logo} />
              <Image src="/logo-carousel/Meta.png" alt="Meta" width={100} height={100} objectFit="contain" className={styles.Logo} />
              <Image src="/logo-carousel/Oracle.png" alt="Oracle" width={100} height={100} objectFit="contain" className={styles.Logo} />
              <Image src="/logo-carousel/Riot.png" alt="Riot" width={100} height={100} objectFit="contain" className={styles.Logo} />
              <Image src="/logo-carousel/WeChat.png" alt="WeChat" width={100} height={100} objectFit="contain" className={styles.Logo} />
            </div>
            <div className={styles.LogoSlide}>
              <Image src="/logo-carousel/Allianz.png" alt="Allianz" width={100} height={100} objectFit="contain" className={styles.Logo} />
              <Image src="/logo-carousel/apple.png" alt="Apple" width={100} height={100} objectFit="contain" className={styles.Logo} />
              <Image src="/logo-carousel/Cloudflare_Logo.png" alt="Cloudflare" width={100} height={100} objectFit="contain" className={styles.Logo} />
              <Image src="/logo-carousel/Colt.png" alt="Colt" width={100} height={100} objectFit="contain" className={styles.Logo} />
              <Image src="/logo-carousel/Logonetflix.png" alt="Netflix" width={100} height={100} objectFit="contain" className={styles.Logo} />
              <Image src="/logo-carousel/Meta.png" alt="Meta" width={100} height={100} objectFit="contain" className={styles.Logo} />
              <Image src="/logo-carousel/Oracle.png" alt="Oracle" width={100} height={100} objectFit="contain" className={styles.Logo} />
              <Image src="/logo-carousel/Riot.png" alt="Riot" width={100} height={100} objectFit="contain" className={styles.Logo} />
              <Image src="/logo-carousel/WeChat.png" alt="WeChat" width={100} height={100} objectFit="contain" className={styles.Logo} />
            </div>
          </div>
        </div>
          
        </div>
      </section>

      <section className={styles.DifferencesSection} ref={DifferencesSectionRef}>
        <div className={styles.DifferencesContent}>
          <div className={styles.DifferencesTitleContainer}>
            <h1 className={styles.DifferencesTitle} ref={DifferencesTitleRef1}>OWN YOUR OWN INFRASTRUCTURE.</h1>
            <h1 className={styles.DifferencesTitle} ref={DifferencesTitleRef2}>MAXIMISE YOUR EDGE.</h1>
            <div className={styles.DifferencesSubtitle}>
              <h2 ref={DifferencesSubtitleRef}>{"["}We give you the speed, privacy, and control to scale Web3 without compromise.{"]"}</h2>
            </div>
          </div>

          <div className={styles.DifferencesAccordionContainer} ref={DifferencesAccordionContainerRef}>
            <div className={styles.DifferencesAccordionItemTitle}>
              <h2 className={styles.DifferencesAccordionItemTitleText}>01/    Performance</h2>
            </div>
            <div className={styles.DifferencesAccordionItem} ref={PerformanceAccordionRef}>
              
              <div className={styles.DifferencesAccordionItemContent}>
                <div className={styles.AccordionBox}>
                  <h3 className={styles.AccordionBoxText}>{"//"} Low-latency RPCs</h3>
                </div>
                <div className={styles.AccordionBox} id={styles.AccordionBoxInverted}>
                <h3 className={styles.AccordionBoxText}>{"//"} Optimized hardware routing</h3>
                </div>
              </div>
            </div>

            <div className={styles.DifferencesAccordionItem} ref={SovereigntyAccordionRef}>
              <div className={styles.DifferencesAccordionItemTitle}>
                <h2 className={styles.DifferencesAccordionItemTitleText}>02/    Sovereignty</h2>
              </div>
              <div className={styles.DifferencesAccordionItemContent}>
                <div className={styles.AccordionBox}>
                  <h3 className={styles.AccordionBoxText}>{"//"} Fully owned nodes</h3>
                </div>
                <div className={styles.AccordionBox} id={styles.AccordionBoxInverted}>
                <h3 className={styles.AccordionBoxText}>{"//"} No third-party dependencies</h3>
                </div>
              </div>
            </div>

            <div className={styles.DifferencesAccordionItem} ref={SecurityAccordionRef}>
              <div className={styles.DifferencesAccordionItemTitle}>
                <h2 className={styles.DifferencesAccordionItemTitleText}>03/    Security</h2>
              </div>
              <div className={styles.DifferencesAccordionItemContent}>
                <div className={styles.AccordionBox}>
                  <h3 className={styles.AccordionBoxText}>{"//"} Real decentralization; your information stays yours</h3>
                </div>
                <div className={styles.AccordionBox} id={styles.AccordionBoxInverted}>
                <h3 className={styles.AccordionBoxText}>{"//"} Something else</h3>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      <section className={styles.CTASection}>
        <div className={styles.CTAContent}>
          <div className={styles.CTATextContainer}>
            <h1 className={styles.CTATitle}>
              <span className={styles.CTARegularText}>Get started with noder</span>
              <br />
              <span className={styles.CTARegularText}>and </span>
              <br />
              <div className={styles.CTABoldText} ref={CTABoldTextRef}>
                <span ref={CTABoldTextSpanRef}>DEPLOY</span>
              </div>
              <br />
              <span className={styles.CTARegularText}>In seconds.</span>
            </h1>
          </div>
        </div>
      </section>
    </main>
  );
}