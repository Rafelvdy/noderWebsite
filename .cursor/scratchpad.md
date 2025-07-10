# Noder Landing Page - Server Model Animation Fix + Dynamic Text Color

## Background and Motivation

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

### **🚨 URGENT - HIGH PRIORITY**
- [x] **Task 1**: Fix Server2 Model Scroll Animation Bug - **COMPLETED** ✅
- [ ] **Task 1.1**: Fix Server2 Corner Clipping During Rotation - **IN PROGRESS** 🔄
  - Issue: Server 2 corners get cut off during infinite rotation
  - Solution: Modify ServerModel3D to accept camera FOV props
  - Status: Implementing camera configuration props for Server 2

### **📋 MEDIUM PRIORITY** 
- [ ] **Task 2**: Research and Architecture Design (Dynamic Text Color)
- [ ] **Task 3**: 3D Model Geometry Analysis System  
- [ ] **Task 4**: Text Element Collision Detection
- [ ] **Task 5**: Dynamic Text Color System
- [ ] **Task 6**: Performance Optimization
- [ ] **Task 7**: Integration and Testing

## Executor's Feedback or Assistance Requests

**Current Task**: Implementing camera configuration props for ServerModel3D component
- Adding optional camera props (FOV, position, zoom) to ServerModel3D interface
- This will allow Server 2 to have wider field of view without affecting Server 1
- Expected solution: Wider FOV (18-20°) for Server 2 vs current 12° FOV

**Next Steps**: 
1. Modify ServerModel3D props interface
2. Update camera initialization to use props or defaults
3. Update Server 2 usage to pass wider FOV
4. Test rotation without corner clipping

## Lessons

*This section will be updated as development progresses*

- Include info useful for debugging in the program output
- Read the file before trying to edit it  
- If there are vulnerabilities that appear in the terminal, run npm audit before proceeding
- Always ask before using the -force git command 
- **NEW**: ScrollTrigger animations need proper bidirectional handling - always consider both scroll directions
- **NEW**: Test scroll animations in both directions during development to catch stuck states early 



