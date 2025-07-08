# Noder Landing Page - CTA Hover Animation Enhancement

## Background and Motivation

The user wants to enhance the existing CTA (Call To Action) section with an advanced hover animation. Currently, there's a basic hover effect that moves the text with `yPercent: 100`. The goal is to create a sophisticated text transformation where "DEPLOY" changes to "DEPLOY NODES" with smooth animations:

- **Current State**: Static "DEPLOY" text with basic yPercent animation on hover
- **Desired State**: "DEPLOY" transforms to "DEPLOY NODES" with "NODES" dropping down and background extending
- **Technology Stack**: GSAP for animations, Next.js/React for structure, CSS Modules for styling

### Current Implementation Analysis

**Existing Structure** (from page.tsx):
```tsx
<div className={styles.CTABoldText} ref={CTABoldTextRef}>
  <span ref={CTABoldTextSpanRef}>DEPLOY</span>
</div>
```

**Current Animation** (from page.tsx):
```javascript
CTABoldTextRef.current?.addEventListener("mouseenter", () => {
  gsap.to(CTABoldTextSpanRef.current, {
    yPercent: 100,
  })
})
```

**Current CSS** (from page.module.css):
```css
.CTABoldText {
    font-weight: 700;
    display: inline;
    border-bottom: 1px solid #c1c1c1;
    border-right: 1px solid #c1c1c1;
    padding-right: 5px;
    width: fit-content;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
```

## Key Challenges and Analysis

1. **Text Structure Complexity**: Need to handle two separate words with different animation timing
2. **Dynamic Width Management**: Background/border needs to expand smoothly to accommodate "NODES"
3. **Overflow Control**: Ensure "NODES" drops in cleanly without affecting layout
4. **Performance Optimization**: Use efficient GSAP methods and avoid layout thrashing
5. **Accessibility**: Maintain readable states during animation transitions
6. **Reversibility**: Smooth reverse animation on mouse leave

## High-level Task Breakdown

### Task 1: HTML Structure Redesign
**Objective**: Restructure the CTA text to support dual-word animation
**Success Criteria**: 
- Two separate text elements for "DEPLOY" and "NODES"
- Proper container hierarchy for animation control
- Maintains current styling and layout
- No layout shifts during initial load

### Task 2: CSS Foundation Setup
**Objective**: Create CSS foundation for the animation effects
**Success Criteria**:
- Hidden "NODES" text positioned correctly for drop-down effect
- Container with overflow hidden to prevent layout disruption
- Smooth width transition capability for background extension
- Preserved existing visual styling (borders, shadows, padding)

### Task 3: GSAP Animation Implementation - Hover In
**Objective**: Implement the forward hover animation using GSAP timeline
**Success Criteria**:
- "NODES" drops down smoothly from hidden state
- Background/container width expands to fit new text
- Animation timing feels natural and responsive
- Uses performance-optimized GSAP methods (transforms over layout properties)

### Task 4: GSAP Animation Implementation - Hover Out
**Objective**: Implement the reverse animation for mouse leave
**Success Criteria**:
- Smooth reversal of all hover effects
- "NODES" animates back to hidden state
- Container width returns to original size
- Timeline cleanup prevents animation conflicts

### Task 5: Performance Optimization & Testing
**Objective**: Ensure smooth 60fps animation performance
**Success Criteria**:
- No layout thrashing during animations
- Consistent frame rate across different devices
- Memory efficient (no animation leaks)
- Compatible with existing scroll animations

### Task 6: Edge Case Handling & Polish
**Objective**: Handle rapid hover/unhover and edge cases
**Success Criteria**:
- Proper animation interruption handling
- Smooth transitions when rapidly hovering/unhovering
- Accessibility considerations (reduced motion preference)
- Clean integration with existing page animations

## Project Status Board

### Backlog
- [ ] **Task 1**: HTML Structure Redesign
- [ ] **Task 2**: CSS Foundation Setup  
- [ ] **Task 3**: GSAP Animation Implementation - Hover In
- [ ] **Task 4**: GSAP Animation Implementation - Hover Out
- [ ] **Task 5**: Performance Optimization & Testing
- [ ] **Task 6**: Edge Case Handling & Polish

### In Progress
- Planning and analysis phase

### Complete
- ✅ Codebase analysis
- ✅ Feature requirements gathering
- ✅ Task breakdown planning

## Current Status / Progress Tracking

**Current Phase**: Planning Complete
**Next Action**: Awaiting approval to proceed with Task 1 (HTML Structure Redesign)

The plan focuses on building the animation incrementally, starting with the structural foundation and progressively adding the animation layers. Each task has clear success criteria that can be tested before moving to the next phase.

## Executor's Feedback or Assistance Requests

*This section will be updated by the Executor during implementation*

## Lessons

*This section will be updated as development progresses*

- Include info useful for debugging in the program output
- Read the file before trying to edit it  
- If there are vulnerabilities that appear in the terminal, run npm audit before proceeding
- Always ask before using the -force git command 