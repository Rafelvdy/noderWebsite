# Noder Landing Page - Dynamic Text Color Based on 3D Model Collision

## Background and Motivation

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

## Key Challenges and Analysis

1. **3D-to-2D Projection Complexity**: Converting 3D model geometry to screen coordinates for collision detection
2. **Real-time Performance**: Collision detection must run at 60fps during scroll animations  
3. **Pixel-Level Accuracy**: Need precise detection of model shape, not just bounding boxes
4. **Text Rendering Method**: Choose between Canvas masking, CSS clip-path, or WebGL shaders
5. **Dynamic Text Splitting**: Text may need to be split into smaller segments for granular color control
6. **Browser Compatibility**: Solution must work across modern browsers
7. **Memory Management**: Avoid memory leaks from frequent collision calculations

## High-level Task Breakdown

### Task 1: Research and Architecture Design
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

### Task 2: 3D Model Geometry Analysis System
**Objective**: Create system to analyze 3D model geometry and project to screen coordinates
**Success Criteria**:
- Function to get model vertices in world space
- Convert 3D coordinates to screen pixel coordinates  
- Account for camera position, perspective, and viewport
- Real-time projection updates during model animations

### Task 3: Text Element Collision Detection
**Objective**: Implement collision detection between projected 3D geometry and text elements
**Success Criteria**:
- Accurate bounding box detection for text characters/words
- Pixel-level or region-level collision detection
- Efficient algorithm that runs smoothly during animations
- Support for different text sizes and font metrics

### Task 4: Dynamic Text Color System
**Objective**: Implement the visual text color change mechanism
**Success Criteria**:
- Smooth transition between normal and white text color
- Support for partial text coloring (only overlapping parts)
- Maintains text readability during transitions
- Compatible with existing GSAP animations

### Task 5: Performance Optimization
**Objective**: Ensure smooth performance during complex scroll animations
**Success Criteria**:
- Maintains 60fps during scroll with collision detection active
- Efficient memory usage without leaks
- Optimized update frequency (not every frame if unnecessary)
- Fallback mechanisms for lower-performance devices

### Task 6: Integration and Testing
**Objective**: Integrate with existing animation system and test thoroughly
**Success Criteria**:
- Works seamlessly with existing GSAP scroll animations
- Compatible with both hero section and features section models
- Smooth behavior on different screen sizes
- No interference with other page interactions

## Project Status Board

### Backlog
- [ ] **Task 1**: Research and Architecture Design
- [ ] **Task 2**: 3D Model Geometry Analysis System  
- [ ] **Task 3**: Text Element Collision Detection
- [ ] **Task 4**: Dynamic Text Color System
- [ ] **Task 5**: Performance Optimization
- [ ] **Task 6**: Integration and Testing

### In Progress
- Planning and analysis phase

### Complete
- ✅ Codebase analysis  
- ✅ 3D model implementation understanding
- ✅ Current text and animation system analysis

## Current Status / Progress Tracking

**Current Phase**: Planning - Architecture Design Questions
**Next Action**: Need user input on technical approach preferences before proceeding

**Key Questions for User:**
1. **Accuracy vs Performance**: Do you prefer pixel-perfect detection or is region-based detection acceptable?
2. **Text Rendering**: Are you open to Canvas-based text rendering for more control, or must we keep HTML text?
3. **Browser Support**: Should this work on mobile devices immediately or can we start with desktop?
4. **Fallback Behavior**: What should happen on devices that can't handle the effect smoothly?

## Executor's Feedback or Assistance Requests

*This section will be updated by the Executor during implementation*

## Lessons

*This section will be updated as development progresses*

- Include info useful for debugging in the program output
- Read the file before trying to edit it  
- If there are vulnerabilities that appear in the terminal, run npm audit before proceeding
- Always ask before using the -force git command 



