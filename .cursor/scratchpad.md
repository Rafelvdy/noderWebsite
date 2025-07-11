# Noder Landing Page - URGENT: Mobile Navigation Fixes

## Background and Motivation

**URGENT: Mobile Navigation Critical Issues** 🚨

The mobile navigation has several critical positioning and behavior issues that need immediate attention:

**Current Issues Analysis**:
1. **Positioning Problem**: `SocialsContainer` has `transform: translateX(50%)` which centers it horizontally instead of positioning in top-left corner
2. **Off-screen Extension**: 250px width + translateX(50%) causes navigation to extend beyond viewport on smaller screens (especially < 400px)
3. **Incorrect Scroll Behavior**: Currently expands on down-scroll and contracts on up-scroll, but user wants:
   - Expanded by default
   - Stays expanded while scrolling down  
   - Collapses only on first scroll up
4. **Non-responsive Positioning**: Fixed 250px width and static positioning doesn't adapt to different screen sizes

**Technical Root Causes**:
- CSS: `.SocialsContainer { transform: translateX(50%); width: 250px; }` pushes nav to center-right
- JavaScript: Scroll logic in lines 268-289 of page.tsx is inverted from desired behavior
- Animation: GSAP timeline moves icons from CSS stacked positions to `translateX(0px)` but positioning is still off-center

**Success Criteria**:
- Navigation stays in top-left corner at all screen widths ≤1023px
- Never extends off-screen horizontally
- Starts expanded → stays expanded on down-scroll → collapses on first up-scroll  
- Responsive icon spacing and container width based on screen size
- Smooth GSAP animations work correctly with new positioning

## High-level Task Breakdown

### **URGENT: Mobile Navigation Positioning & Behavior Fix** 🎯
**Objective**: Fix mobile nav to stay in top-left, never extend off-screen, and implement correct scroll behavior
**Success Criteria**: 
- Perfect top-left positioning on all screen sizes ≤1023px
- No off-screen extension at any width
- Correct scroll behavior: expanded → stays expanded down → collapses up
- Responsive design that adapts to screen width

**Sub-tasks**:

1. **Fix CSS Positioning for Top-Left Alignment**
   - Remove `transform: translateX(50%)` from `.SocialsContainer`
   - Adjust positioning to left: 0 or left: small margin for padding
   - Ensure navigation starts in top-left corner consistently

2. **Implement Responsive Width System**
   - Replace fixed 250px width with responsive clamp() or vw-based sizing
   - Calculate maximum width that never extends off-screen
   - Test across screen widths from 320px to 1023px

3. **Invert Scroll Behavior Logic**
   - Modify JavaScript logic in page.tsx lines 268-289
   - Start with `isExpanded = true` (expanded by default)
   - On scroll down: keep expanded (no animation)
   - On first scroll up: collapse navigation (trigger animation)

4. **Update GSAP Animation for New Positioning**
   - Verify animations work correctly with new CSS positioning
   - Adjust animation values if needed for responsive design
   - Test expand/collapse animations at different screen sizes

---

# Noder Landing Page - Testimonials Section Responsive Design + Previous Issues

## Background and Motivation

**NEW URGENT TASK: Testimonials Section Responsive Design** 📱💻

The testimonials section needs comprehensive responsive design improvements to work seamlessly across all screen sizes while maintaining the current iPhone SE design as the foundation.

**Current Testimonials Structure Analysis**:
- TestimonialContainer: 50% height, centered with overflow hidden
- TestimonialBox: 80% width, aspect-ratio 16/9, absolutely positioned
- GSAP Animation: moves from `bottom: -100%` → `bottom: 25%` → `bottom: 100%`
- Text carousel and logos carousel are separate 100% width sections
- Design optimized for iPhone SE (375px width)

**Current Issues**:
1. **Inconsistent Centering**: Testimonials don't reliably center on different screen sizes
2. **Text Scale Problems**: Text carousel becomes "stupidly massive" on larger screens  
3. **Logo Sizing Issues**: Logos don't maintain proper relationship to text size
4. **Desktop Layout Needs**: At 1024px+ need testimonials on right half (50% width)
5. **Text Spacing Control**: Distance between testimonial text and author needs better control
6. **Animation Positioning**: GSAP animations need to adapt to different container sizes

**Desired Responsive Behavior**:
- **Mobile (≤1023px)**: Current iPhone SE design as base, scale appropriately
- **Desktop (≥1024px)**: Testimonials 50% width positioned on right half
- **Text Carousel**: Responsive but capped to prevent excessive size
- **Logos**: Always smaller than text, proportionally scaled
- **Testimonials**: Always center in their container regardless of screen size

---

# Noder Landing Page - Server Model Animation Fix + Dynamic Text Color + Memory Optimization

## Background and Motivation

**NEW CRITICAL ISSUE: 3D Model Memory Optimization** 🚨

Current implementation has significant memory inefficiencies that impact performance, especially on mobile devices and when multiple models are loaded:

**Current Memory Issues**:
- Each ServerModel3D creates a complete Three.js rendering pipeline (renderer, composer, scene, lights)
- Same GLB model file loaded multiple times into memory
- Models stay in memory throughout entire page lifecycle regardless of visibility
- No resource sharing between model instances
- Continuous rendering even when models are off-screen

**Impact**: 
- High memory usage (each model instance ~20-50MB depending on device)
- Potential memory leaks on page navigation
- Poor performance on mobile devices
- Unnecessary GPU/CPU usage when models aren't visible

**Memory Optimization Goals**:
- Reduce memory footprint by 60-80%
- Share resources between model instances  
- Implement conditional rendering based on scroll position
- Maintain all existing animation functionality

---

**URGENT: New Critical Animation Issue Identified**

The second server model (server2ModelRef) has a scroll animation bug where it correctly animates from right to center when scrolling down to section 2, but when scrolling back up past section 2, it remains stuck in the center instead of animating back off-screen.

**Current Behavior**: 
- ✅ Server animates from right side to center when entering section 2 (scrolling down)
- ❌ Server stays in center when scrolling back up past section 2 (should exit off-screen)
- ❌ No reverse animation logic for upward scrolling

**Root Cause Analysis**:
1. `animateServer2Entrance` function only handles forward scroll direction
2. ScrollTrigger animations are one-directional - no exit animations
3. Server position gets "stuck" in center position after initial entrance
4. Missing scroll trigger for reverse animation when leaving section 2 upward

**Desired State**: 
- Server should smoothly animate back off-screen (to right side) when scrolling up past section 2
- All existing animations should remain intact and functional
- Server background should remain transparent as requested
- No negative impact on other scroll animations or 3D model behaviors

---

**Previous Project Context** (Dynamic Text Color Feature):
The user wants to implement an advanced visual effect where text elements dynamically change to white color only in the areas where the actual 3D server model shape is positioned behind them. This should work with the precise geometry of the 3D model, not just its container boundaries.

**Current State**: 
- Text elements have static colors (black for titles, gray for subtitles)
- 3D server models move and scale during scroll animations
- Text and models are layered using CSS z-index

**Desired State**: 
- Text turns white dynamically where the 3D model geometry is behind it
- Only the specific parts of text overlapping with the model should change color
- Effect should work smoothly during scroll animations and model transformations

**Technology Requirements**: 
- Three.js for 3D geometry analysis and projection
- Canvas-based text rendering or WebGL shaders for pixel-level control
- Real-time collision detection between 3D model and 2D text bounds
- Performance optimization for smooth 60fps animation

### Current Implementation Analysis

**3D Model Structure** (from ServerModel.tsx):
```tsx
// Models load GLB file and expose serverObject reference
const ServerModel3D = forwardRef<ServerModel3DRef, ServerModel3DProps>(...)
// Provides getServerObject() method returning THREE.Group
```

**Text Elements** (from page.tsx):
```tsx
// Hero title with ref for animations
<div className={styles.HeroTitle} ref={heroTitleRef}>
  <h1>THE MOST EFFICIENT NODES ON <span className={styles.SolanaGradient}>SOLANA</span></h1>
</div>
// Hero subtitle with ref
<div className={styles.HeroSubtitle} ref={heroSubtitleRef}>
  <h2>[The first fully owned, performance-optimized RPC infrastructure built for Web3]</h2>
</div>
```

**Current Animation System** (from page.tsx):
```javascript
// Models rotate and move during scroll
serverObject.rotation.y = progress * Math.PI * 2;
// Text moves horizontally during scroll
x: `-${progress * 150}%`
```

**Server2 Animation Issue** (from animateServer2Entrance function):
```javascript
// Current entrance animation - only handles forward direction
gsap.to(server2ModelContainerRef.current, {
    scrollTrigger: {
        trigger: section2Ref.current,
        start: "30% bottom",
        end: "30% center",
        scrub: false,
    },
    right: "50%",
    transform: "translateX(50%) translateY(-50%)",
    // No reverse animation when scrolling back up
});
```

## Key Challenges and Analysis

**URGENT ANIMATION FIX CHALLENGES:**
1. **Bidirectional Scroll Handling**: Current ScrollTrigger setup only handles downward scrolling
2. **Animation State Management**: Need to track and manage server position state properly
3. **Smooth Transitions**: Ensure seamless animation in both directions
4. **Performance**: Avoid conflicting animations or janky transitions
5. **Scroll Direction Detection**: Implement proper scroll direction awareness

**DYNAMIC TEXT COLOR CHALLENGES** (Previous Project):
1. **3D-to-2D Projection Complexity**: Converting 3D model geometry to screen coordinates for collision detection
2. **Real-time Performance**: Collision detection must run at 60fps during scroll animations  
3. **Pixel-Level Accuracy**: Need precise detection of model shape, not just bounding boxes
4. **Text Rendering Method**: Choose between Canvas masking, CSS clip-path, or WebGL shaders
5. **Dynamic Text Splitting**: Text may need to be split into smaller segments for granular color control
6. **Browser Compatibility**: Solution must work across modern browsers
7. **Memory Management**: Avoid memory leaks from frequent collision calculations

## High-level Task Breakdown

### **NEW TOP PRIORITY: Testimonials Section Responsive Design** 🎯
**Objective**: Create a fully responsive testimonials section that works seamlessly across all screen sizes
**Success Criteria**: 
- Testimonials center perfectly on all screen sizes using GSAP animations
- Text carousel responsive but capped to prevent excessive scaling
- Logos proportionally sized relative to text
- Desktop layout: testimonials 50% width on right half
- Maintain all existing animation functionality
- Use iPhone SE design as baseline foundation

**Sub-tasks**:

1. **Fix Testimonial Centering Logic**
   - Analyze current GSAP animation: `bottom: 25%` positioning
   - Implement dynamic centering calculation based on container height
   - Ensure testimonials appear in true center regardless of screen size
   - Test across mobile, tablet, desktop viewports

2. **Implement Text Carousel Responsive Scaling**
   - Current: `font-size: clamp(20px, 8vw, 40px)` becomes too large
   - New approach: Set reasonable maximum caps for different breakpoints
   - Mobile: Keep current iPhone SE sizing as base
   - Tablet: Moderate scaling with sensible limits
   - Desktop: Cap at readable header size, prevent "stupidly massive" text

3. **Create Logo Proportional Sizing System**
   - Analyze current logo sizes: `clamp(80px, 12vw, 150px)`
   - Establish relationship: logos should be 60-70% of text size
   - Create responsive scaling that maintains this relationship
   - Test logo readability at all screen sizes

4. **Implement Desktop Layout Split (≥1024px)**
   - TestimonialContainer: Move to right 50% of screen
   - Text carousel and logos carousel: Remain 100% width
   - Ensure proper layout doesn't break existing animations
   - Maintain vertical centering in new layout

5. **Improve Text and Author Spacing Control**
   - Current: Uses `justify-content: space-around` in flex column
   - Implement controlled spacing using CSS custom properties
   - Make spacing responsive across screen sizes
   - Ensure readability and visual hierarchy

6. **Update GSAP Animation System**
   - Modify testimonial animations to work with new responsive layout
   - Ensure smooth transitions work in both mobile and desktop layouts
   - Test animation performance across all screen sizes
   - Verify no conflicts with existing scroll triggers

**Technical Approach**:
- CSS Grid for desktop layout split
- CSS Custom Properties for dynamic spacing control
- Improved clamp() functions with better scaling limits
- GSAP timeline modifications for responsive positioning
- Comprehensive media query strategy

**Design Constraints**:
- iPhone SE (375px) design remains the foundation
- No breaking changes to existing animations
- Maintain current color scheme and visual style
- Preserve accessibility and readability

### **NEW URGENT TASK: 3D Model Memory Optimization** 🚨
**Objective**: Optimize memory usage and performance of 3D models while retaining all functionality
**Success Criteria**: 
- Reduce total memory usage by 60-80%
- Implement shared model loading (load GLB once, reuse across instances)
- Add conditional rendering based on scroll visibility
- Maintain all existing animations and interactions
- No performance degradation during animations

**Sub-tasks**:
1. **Implement Shared Model Loading System**
   - Create ModelManager singleton for GLB caching
   - Load server model once, clone for multiple instances
   - Share geometries and materials between clones
   
2. **Add Conditional Rendering**
   - Track scroll position and model visibility
   - Pause/resume rendering when models off-screen
   - Implement fade-in/fade-out for smooth transitions
   
3. **Optimize Rendering Pipeline** 
   - Share single renderer between model instances
   - Use scene switching instead of multiple renderers
   - Implement render-on-demand instead of continuous rendering
   
4. **Add Level of Detail (LOD)**
   - Create simplified model versions for distant views
   - Switch between high/low detail based on scale/distance
   - Reduce geometry complexity when appropriate
   
5. **Implement Resource Cleanup**
   - Aggressive cleanup when scrolling past sections
   - Lazy re-loading when returning to sections
   - Memory monitoring and leak prevention

**Technical Approach**:
- Model pooling with Three.js Object3D.clone()
- Intersection Observer for visibility detection
- GSAP timeline integration for smooth transitions
- Three.js LOD (Level of Detail) implementation

### **URGENT TASK 1: Fix Server2 Model Scroll Animation Bug** 🚨
**Objective**: Implement proper bidirectional animation for server2 model
**Success Criteria**: 
- Server animates from right to center when scrolling down to section 2
- Server animates from center back to right when scrolling up past section 2
- Smooth transitions in both directions
- No interference with existing animations
- Server background remains transparent

**Sub-tasks**:
1. **Analyze current ScrollTrigger configuration**
   - Map all current scroll triggers and their behaviors
   - Identify conflicts or gaps in animation coverage
   
2. **Implement scroll direction detection**
   - Add proper scroll direction tracking
   - Create conditional animation logic for up vs down scrolling
   
3. **Create reverse animation logic**
   - Add ScrollTrigger for upward scroll past section 2
   - Ensure smooth transition from center back to off-screen right
   
4. **Test animation state management**
   - Verify no animation conflicts or stuck states
   - Test rapid scroll direction changes
   - Validate performance impact

**Technical Approach**:
- Use ScrollTrigger's `onEnter`, `onLeave`, `onEnterBack`, `onLeaveBack` callbacks
- Implement proper animation timelines for both directions
- Add scroll progress tracking for smooth transitions

### Task 2: Research and Architecture Design (Dynamic Text Color)
**Objective**: Determine the optimal technical approach for 3D-2D collision detection
**Success Criteria**: 
- Research Three.js raycasting and screen projection methods
- Choose between Canvas masking vs CSS masking vs WebGL approaches
- Define performance targets (60fps during animations)
- Create technical architecture document

**Questions for User:**
- Are you open to using Canvas-based text rendering instead of HTML text?
- What's the priority: pixel-perfect accuracy vs performance?
- Should this work on mobile devices or desktop-only initially?

### Task 3: 3D Model Geometry Analysis System
**Objective**: Create system to analyze 3D model geometry and project to screen coordinates
**Success Criteria**:
- Function to get model vertices in world space
- Convert 3D coordinates to screen pixel coordinates  
- Account for camera position, perspective, and viewport
- Real-time projection updates during model animations

### Task 4: Text Element Collision Detection
**Objective**: Implement collision detection between projected 3D geometry and text elements
**Success Criteria**:
- Accurate bounding box detection for text characters/words
- Pixel-level or region-level collision detection
- Efficient algorithm that runs smoothly during animations
- Support for different text sizes and font metrics

### Task 5: Dynamic Text Color System
**Objective**: Implement the visual text color change mechanism
**Success Criteria**:
- Smooth transition between normal and white text color
- Support for partial text coloring (only overlapping parts)
- Maintains text readability during transitions
- Compatible with existing GSAP animations

### Task 6: Performance Optimization
**Objective**: Ensure smooth performance during complex scroll animations
**Success Criteria**:
- Maintains 60fps during scroll with collision detection active
- Efficient memory usage without leaks
- Optimized update frequency (not every frame if unnecessary)
- Fallback mechanisms for lower-performance devices

### Task 7: Integration and Testing
**Objective**: Integrate with existing animation system and test thoroughly
**Success Criteria**:
- Works seamlessly with existing GSAP scroll animations
- Compatible with both hero section and features section models
- Smooth behavior on different screen sizes
- No interference with other page interactions

## Project Status Board

### **URGENT: Mobile Navigation Positioning & Behavior Fix** 🎯
- [x] **Fix CSS Positioning for Top-Left Alignment** ✅ COMPLETED
  - Removed `transform: translateX(50%)` from `.SocialsContainer`
  - Changed positioning to `justify-content: flex-start` and added `margin-left: 1rem`
  - Updated `.MobileNav` to `justify-content: flex-start` with `top: 0, left: 0`
  
- [x] **Implement Responsive Width System** ✅ COMPLETED  
  - Replaced fixed 250px width with `clamp(150px, 45vw, 220px)`
  - Added responsive padding: `clamp(8px, 2vw, 15px)`
  - Navigation now adapts to screen width without extending off-screen

- [x] **Invert Scroll Behavior Logic** ✅ COMPLETED
  - Modified JavaScript logic: `isExpanded = true` (starts expanded)
  - Added `hasScrolledUp` tracking variable
  - Changed behavior: expanded by default → stays expanded on down-scroll → collapses on first up-scroll only

- [x] **Update GSAP Animation for New Positioning** ✅ COMPLETED
  - Updated animation to move icons TO stacked positions (since starting expanded)
  - Removed default CSS stacked positioning (now controlled by JavaScript)
  - Set initial expanded state with `gsap.set()` before creating collapse timeline

- [x] **Fix Re-expansion Bug** ✅ COMPLETED
  - **Issue**: Once collapsed, navigation never expanded again due to `hasScrolledUp` flag never resetting
  - **Solution**: Added logic to reset `hasScrolledUp` flag when scrolling down significantly after collapse
  - **Behavior**: Now supports multiple expand/collapse cycles:
    1. Starts expanded → scroll up = collapse → scroll down significantly = reset → scroll down = expand
    2. Can repeat this cycle indefinitely

- [ ] **Test Implementation** 🔄 IN PROGRESS
  - Need to test the complete behavior cycle across different screen widths (320px to 1023px)
  - Verify scroll behavior works correctly for multiple expand/collapse cycles
  - Check that animations are smooth and responsive

### **📋 MEDIUM PRIORITY** 
- [ ] **Task 2**: Research and Architecture Design (Dynamic Text Color)
- [ ] **Task 3**: 3D Model Geometry Analysis System  
- [ ] **Task 4**: Text Element Collision Detection
- [ ] **Task 5**: Dynamic Text Color System
- [ ] **Task 6**: Performance Optimization
- [ ] **Task 7**: Integration and Testing

## Executor's Feedback or Assistance Requests

### Mobile Navigation Implementation Complete - Ready for Testing

**What was implemented:**
1. **CSS Positioning Fixed**: Navigation now properly positions in top-left corner using `justify-content: flex-start` and `margin-left: 1rem`
2. **Responsive Design**: Implemented `clamp(150px, 45vw, 220px)` width that scales with viewport but never extends off-screen
3. **Correct Scroll Behavior**: Navigation starts expanded, stays expanded on down-scroll, and collapses only on first up-scroll
4. **GSAP Animation Updated**: Animation now moves from expanded state TO collapsed (stacked) state, with proper initial positioning

**Files Modified:**
- `src/app/page.module.css`: Lines 7-43 (positioning and responsive width)
- `src/app/page.tsx`: Lines 217-294 (scroll behavior logic and animation)

**Technical Changes:**
- Removed `transform: translateX(50%)` that was causing center positioning
- Inverted scroll logic: `direction === -1` now triggers collapse instead of expand
- Added `hasScrolledUp` state to ensure collapse happens only once
- Updated GSAP timeline to animate TO stacked positions instead of FROM them

**Ready for Manual Testing:**
Please test the mobile navigation on different screen sizes (especially 320px-1023px width) to verify:
1. Navigation stays in top-left corner ✓
2. Never extends off-screen horizontally ✓  
3. Starts expanded by default ✓
4. Stays expanded while scrolling down ✓
5. Collapses on first scroll up ✓
6. Smooth animations work correctly ✓

**Request**: Please run `npm run dev` and test the mobile navigation behavior to confirm all requirements are met before marking this task complete.

## Lessons

- **Mobile Navigation Positioning**: Use `justify-content: flex-start` with `margin-left` for left positioning instead of `transform: translateX(50%)` which centers the element
- **Responsive Width**: `clamp()` function is excellent for responsive widths that need minimum, preferred, and maximum values
- **GSAP Animation Direction**: When changing initial state, remember to update both the CSS defaults AND the animation target values
- **Scroll Behavior Logic**: Track state variables like `hasScrolledUp` to implement "one-time" scroll behaviors



