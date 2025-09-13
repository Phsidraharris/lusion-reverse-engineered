================
CODE SNIPPETS
================
TITLE: Install gsap Dependency
DESCRIPTION: This command installs the 'gsap' library, which may be a dependency for some ReactBits components. It uses npm for package management.

SOURCE: https://www.reactbits.dev/get-started/installation

LANGUAGE: bash
CODE:
```
npm install gsap
```

--------------------------------

TITLE: Basic SplitText Component Usage
DESCRIPTION: A basic example of how to use the SplitText component in a React application. It demonstrates passing text, delay, and duration props to the component.

SOURCE: https://www.reactbits.dev/get-started/installation

LANGUAGE: jsx
CODE:
```
import SplitText from "./SplitText";

<SplitText
  text="Hello, you!"
  delay={100}
  duration={0.6}
/>
```

--------------------------------

TITLE: Start Count Up Programmatically
DESCRIPTION: Allows the counting animation to be started programmatically by using a ref. This provides control over when the animation begins. Requires the 'react-countup' library.

SOURCE: https://www.reactbits.dev/text-animations/count-up

LANGUAGE: jsx
CODE:
```
import React, { useRef } from 'react';
import CountUp from 'react-countup';

function App() {
  const countUpRef = useRef();

  return (
    <div>
      <CountUp start={null} end={500} ref={countUpRef} />
      <button onClick={() => countUpRef.current.start()}>Start Counting</button>
    </div>
  );
}
```

--------------------------------

TITLE: React Counter Component Example
DESCRIPTION: This snippet demonstrates a basic implementation of the React counter component. It takes a 'value' prop to display the number and allows customization of 'fontSize', 'gap', and 'textColor'. The 'motion' library is a dependency for animations.

SOURCE: https://www.reactbits.dev/components/counter

LANGUAGE: jsx
CODE:
```
import Counter from 'your-counter-library';

function App() {
  return (
    <Counter
      value={12345}
      fontSize={80}
      gap={10}
      textColor="white"
    />
  );
}
```

--------------------------------

TITLE: Rotating Text Component Example
DESCRIPTION: This is an example of how to use the Rotating Text component in a React application. It demonstrates passing different props to customize the text rotation and animation.

SOURCE: https://www.reactbits.dev/text-animations/rotating-text

LANGUAGE: javascript
CODE:
```
import React from 'react';
import RotatingText from './RotatingText'; // Assuming RotatingText is in the same directory

function App() {
  const textsToRotate = ['Creative', 'Coding', 'Fun'];

  return (
    <div>
      <h1>Welcome to Reactbits</h1>
      <RotatingText 
        texts={textsToRotate}
        rotationInterval={3000} 
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-120%", opacity: 0 }}
        staggerDuration={0.03}
        splitBy="characters"
        loop={true}
        auto={true}
      />
    </div>
  );
}

export default App;

```

--------------------------------

TITLE: Pixel Blast Dependencies
DESCRIPTION: Lists the external libraries or modules that the Pixel Blast component relies on to function correctly. These dependencies must be installed for the component to work as intended.

SOURCE: https://www.reactbits.dev/backgrounds/pixel-blast

LANGUAGE: markdown
CODE:
```
## Dependencies
threepostprocessing
```

--------------------------------

TITLE: Logo Loop Component Example
DESCRIPTION: This section showcases the basic usage of the Logo Loop component. It requires an array of logo items, which can be React nodes or image sources. The component supports various customization props for animation and display.

SOURCE: https://www.reactbits.dev/animations/logo-loop

LANGUAGE: jsx
CODE:
```
import LogoLoop from './LogoLoop';

function App() {
  const logos = [
    'path/to/logo1.png',
    <img src="path/to/logo2.svg" alt="Logo 2" />,
    'path/to/logo3.png'
  ];

  return (
    <LogoLoop
      logos={logos}
      speed={100}
      logoHeight={60}
      gap={60}
      direction="right"
      pauseOnHover={true}
      fadeOut={true}
      scaleOnHover={true}
    />
  );
}
```

--------------------------------

TITLE: Scroll Stack Component Usage
DESCRIPTION: Example of how to use the Scroll Stack component with nested ScrollStackItem components. It demonstrates basic setup for scroll-based animations.

SOURCE: https://www.reactbits.dev/components/scroll-stack

LANGUAGE: jsx
CODE:
```
import ScrollStack from '@react-three/scroll-trigger/ScrollStack';
import ScrollStackItem from '@react-three/scroll-trigger/ScrollStackItem';

function MyComponent() {
  return (
    <ScrollStack>
      <ScrollStackItem>
        {/* Content for item 1 */}
      </ScrollStackItem>
      <ScrollStackItem>
        {/* Content for item 2 */}
      </ScrollStackItem>
      {/* ... more items */}
    </ScrollStack>
  );
}
```

--------------------------------

TITLE: Electric Button Component Usage
DESCRIPTION: Shows an example of using the Electric Button component, highlighting its electric border effect.

SOURCE: https://www.reactbits.dev/animations/electric-border

LANGUAGE: javascript
CODE:
```
import React from 'react';
import { ElectricButton } from './ElectricButton';

function MyComponent() {
  return (
    <ElectricButton onClick={() => alert('Clicked!')}>
      Click Me
    </ElectricButton>
  );
}

export default MyComponent;
```

--------------------------------

TITLE: Control Cursor Interaction Effects
DESCRIPTION: This example illustrates how to control the interactive effects of the waves component, specifically limiting cursor movement influence and adjusting the tension of the wave points using `maxCursorMove` and `tension` props.

SOURCE: https://www.reactbits.dev/backgrounds/waves

LANGUAGE: jsx
CODE:
```
import Waves from 'react-waves';

function MyWaves() {
  return (
    <Waves 
      maxCursorMove={50}
      tension={0.6}
    />
  );
}
```

--------------------------------

TITLE: Customize Waves Color and Speed
DESCRIPTION: This example demonstrates how to customize the color of the wave lines and adjust the horizontal speed of the wave animation using the `lineColor` and `waveSpeedX` props.

SOURCE: https://www.reactbits.dev/backgrounds/waves

LANGUAGE: jsx
CODE:
```
import Waves from 'react-waves';

function MyWaves() {
  return (
    <Waves 
      lineColor="#007bff" 
      waveSpeedX={0.05}
    />
  );
}
```

--------------------------------

TITLE: Shuffle Component - Scroll Trigger
DESCRIPTION: Explains how to use scroll-based triggering for the shuffle animation. 'threshold' and 'rootMargin' control when the animation starts.

SOURCE: https://www.reactbits.dev/text-animations/shuffle

LANGUAGE: jsx
CODE:
```
import Shuffle from './Shuffle';

function App() {
  return (
    <div style={{ height: '100vh' }}> {/* Placeholder for scrollable container */}
      <Shuffle 
        text="Scroll to Animate"
        threshold={0.5}
        rootMargin="-50px"
        triggerOnce={true}
      />
    </div>
  );
}
```

--------------------------------

TITLE: Count Up with Gradient Text
DESCRIPTION: Demonstrates how to wrap the CountUp component with another component, like GradientText, to apply custom styling. This example implies the existence of a GradientText component.

SOURCE: https://www.reactbits.dev/text-animations/count-up

LANGUAGE: jsx
CODE:
```
import React from 'react';
import CountUp from 'react-countup';
// Assuming GradientText is defined elsewhere
// import GradientText from './GradientText'; 

function App() {
  return (
    <div>
      {/* <GradientText> */}
        <CountUp end={98} />
      {/* </GradientText> */}
    </div>
  );
}
```

--------------------------------

TITLE: Shiny Text with Custom Speed and Disabled State in React
DESCRIPTION: This example shows how to customize the Shiny Text component by setting the 'speed' prop to control animation duration and the 'disabled' prop to turn off the effect. The 'className' prop can be used for additional styling.

SOURCE: https://www.reactbits.dev/text-animations/shiny-text

LANGUAGE: jsx
CODE:
```
import ShinyText from 'react-shiny-text';

function App() {
  return (
    <div>
      <ShinyText speed={10} disabled={true} className="custom-class">Slow and Disabled Text</ShinyText>
    </div>
  );
}
```

--------------------------------

TITLE: Basic Glare Hover Component Usage (React)
DESCRIPTION: Demonstrates the basic usage of the Glare Hover component in a React application. It shows how to import and render the component with its children.

SOURCE: https://www.reactbits.dev/animations/glare-hover

LANGUAGE: jsx
CODE:
```
import GlareHover from 'react-glare-hover';

function App() {
  return (
    <GlareHover>
      Hover Me
    </GlareHover>
  );
}
```

--------------------------------

TITLE: Dither Component Dependencies
DESCRIPTION: Lists the external libraries required for the Dither component to function correctly. These include 'three', '@react-three/fiber', and '@react-three/postprocessing'.

SOURCE: https://www.reactbits.dev/backgrounds/dither

LANGUAGE: Markdown
CODE:
```
threepostprocessing@react-three/fiber@react-three/postprocessing
```

--------------------------------

TITLE: Spring Animation Configuration
DESCRIPTION: Defines the configuration options for the spring animation used in the Dock component. This includes parameters like mass, stiffness, and damping to control the animation's behavior.

SOURCE: https://www.reactbits.dev/components/dock

LANGUAGE: typescript
CODE:
```
interface SpringOptions {
  mass?: number;
  stiffness?: number;
  damping?: number;
}
```

--------------------------------

TITLE: Model Viewer Dependencies
DESCRIPTION: Lists the external libraries required for the Model Viewer component to function correctly. These include `three`, `react-three/fiber`, and `react-three/drei`.

SOURCE: https://www.reactbits.dev/components/model-viewer

LANGUAGE: bash
CODE:
```
npm install three @react-three/fiber @react-three/drei
# or
yarn add three @react-three/fiber @react-three/drei
```

--------------------------------

TITLE: Shuffle Component - Basic Usage
DESCRIPTION: Demonstrates the basic usage of the Shuffle component to animate text. It takes 'text' as a prop to define the content to be shuffled.

SOURCE: https://www.reactbits.dev/text-animations/shuffle

LANGUAGE: jsx
CODE:
```
import Shuffle from './Shuffle';

function App() {
  return (
    <Shuffle text="Hello World" />
  );
}
```

--------------------------------

TITLE: Model Viewer Props Reference
DESCRIPTION: A detailed breakdown of the properties available for the Model Viewer component, including their types, default values, and descriptions. This helps in understanding how to customize the 3D model display.

SOURCE: https://www.reactbits.dev/components/model-viewer

LANGUAGE: markdown
CODE:
```
Property| Type| Default| Description  
---|---|---|---
url| string| -| URL of the 3D model file (glb/gltf/fbx/obj)  
width| number | string| 400| Width of the canvas container  
height| number | string| 400| Height of the canvas container  
modelXOffset| number| 0| Horizontal offset of the model  
modelYOffset| number| 0| Vertical offset of the model  
defaultRotationX| number| -50| Initial rotation on the X axis in degrees  
defaultRotationY| number| 20| Initial rotation on the Y axis in degrees  
defaultZoom| number| 0.5| Initial zoom distance factor  
minZoomDistance| number| 0.5| Minimum zoom distance  
maxZoomDistance| number| 10| Maximum zoom distance  
enableMouseParallax| boolean| true| Enable mouse-based parallax effect  
enableManualRotation| boolean| true| Enable manual rotation via drag  
enableHoverRotation| boolean| true| Enable rotation on hover based on cursor  
enableManualZoom| boolean| true| Enable manual zoom via mouse wheel or gestures  
ambientIntensity| number| 0.3| Intensity of ambient light  
keyLightIntensity| number| 1| Intensity of key light  
fillLightIntensity| number| 0.5| Intensity of fill light  
rimLightIntensity| number| 0.8| Intensity of rim light  
environmentPreset| string| "forest"| Environment preset for scene lighting  
autoFrame| boolean| false| Automatically frame the model in view  
fadeIn| boolean| false| Enable fade-in transition on load  
autoRotate| boolean| false| Enable automatic rotation animation  
autoRotateSpeed| number| 0.35| Speed of automatic rotation  
showScreenshotButton| boolean| true| Show the screenshot button overlay  
placeholderSrc| string| -| Placeholder image source while loading  
onModelLoaded| function| -| Callback when model finishes loading  
```

--------------------------------

TITLE: Model Viewer Component Usage
DESCRIPTION: Demonstrates how to use the Model Viewer component in a React application. It highlights setting the model URL and controlling various visual aspects like environment and offsets.

SOURCE: https://www.reactbits.dev/components/model-viewer

LANGUAGE: jsx
CODE:
```
import ModelViewer from './ModelViewer';

function App() {
  return (
    <ModelViewer
      url="/path/to/your/model.glb"
      width={800}
      height={600}
      modelXOffset={0.5}
      modelYOffset={0}
      environmentPreset="city"
      enableMouseParallax={true}
      autoRotate={true}
      autoRotateSpeed={0.5}
    />
  );
}
```

--------------------------------

TITLE: React Dot Grid Component Props
DESCRIPTION: This section lists and describes the available properties for the React dot grid component. These properties allow customization of dot appearance, interaction behavior, and styling.

SOURCE: https://www.reactbits.dev/backgrounds/dot-grid

LANGUAGE: javascript
CODE:
```
Property| Type| Default| Description  
---|---|---|---  
dotSize| number| 16| Size of each dot in pixels.  
gap| number| 32| Gap between each dot in pixels.  
baseColor| string| '#5227FF'| Base color of the dots.  
activeColor| string| '#5227FF'| Color of dots when hovered or activated.  
proximity| number| 150| Radius around the mouse pointer within which dots react.  
speedTrigger| number| 100| Mouse speed threshold to trigger inertia effect.  
shockRadius| number| 250| Radius of the shockwave effect on click.  
shockStrength| number| 5| Strength of the shockwave effect on click.  
maxSpeed| number| 5000| Maximum speed for inertia calculation.  
resistance| number| 750| Resistance for the inertia effect.  
returnDuration| number| 1.5| Duration for dots to return to their original position after inertia.  
className| string| ''| Additional CSS classes for the component.  
style| React.CSSProperties| {}| Inline styles for the component.
```

--------------------------------

TITLE: Bubble Menu Component API
DESCRIPTION: This section details the properties available for customizing the Bubble Menu component.

SOURCE: https://www.reactbits.dev/components/bubble-menu

LANGUAGE: APIDOC
CODE:
```
## Bubble Menu Component

### Description
Component for a bubble menu with customizable animations and styles.

### Props
#### Required Props
- **logo** (ReactNode) - Logo content shown in the central bubble (string src or JSX).
- **onMenuClick** ((open: boolean) => void) - Callback fired whenever the menu toggle changes; receives open state.

#### Optional Props
- **className** (string) - Additional class names for the root nav wrapper.
- **style** (CSSProperties) - Inline styles applied to the root nav wrapper.
- **menuAriaLabel** (string) - Accessible aria-label for the toggle button. Default: `"Toggle menu"`.
- **menuBg** (string) - Background color for the logo & toggle bubbles and base pill background. Default: `"#fff"`.
- **menuContentColor** (string) - Color for the menu icon lines and default pill text. Default: `"#111"`.
- **useFixedPosition** (boolean) - If true positions the menu with fixed instead of absolute (follows viewport). Default: `false`.
- **items** (MenuItem[]) - Custom menu items; each = { label, href, ariaLabel?, rotation?, hoverStyles?: { bgColor?, textColor? } }. Default: `DEFAULT_ITEMS`.
- **animationEase** (string) - GSAP ease string used for bubble scale-in animation. Default: `"back.out(1.5)"`.
- **animationDuration** (number) - Duration (s) for each bubble & label animation. Default: `0.5`.
- **staggerDelay** (number) - Base stagger (s) between bubble animations (with slight random variance). Default: `0.12`.

### Dependencies
- gsap
```

--------------------------------

TITLE: Elastic Slider Component Usage (React)
DESCRIPTION: Demonstrates the basic usage and customization of the Elastic Slider component. It shows how to set initial values, enable stepped increments, and use custom icons.

SOURCE: https://www.reactbits.dev/components/elastic-slider

LANGUAGE: jsx
CODE:
```
import React, { useState } from 'react';
import ElasticSlider from 'react-bits-elastic-slider';

function App() {
  const [value, setValue] = useState(50);

  return (
    <div>
      <h2>Default Slider</h2>
      <ElasticSlider 
        defaultValue={50} 
        onChange={(newValue) => setValue(newValue)}
      />
      <p>Current Value: {value}</p>

      <h2>Stepped Slider</h2>
      <ElasticSlider 
        isStepped={true} 
        stepSize={10} 
        defaultValue={20}
      />

      <h2>Custom Values & Icons</h2>
      <ElasticSlider 
        startingValue={-10}
        maxValue={20}
        defaultValue={0}
        leftIcon={<>MIN</>}
        rightIcon={<>MAX</>}
      />
    </div>
  );
}
```

--------------------------------

TITLE: Split Text Component with Default Props
DESCRIPTION: Demonstrates the basic usage of the Split Text component with its default HTML tag ('p') and text content. It's ready to be animated.

SOURCE: https://www.reactbits.dev/text-animations/split-text

LANGUAGE: jsx
CODE:
```
import SplitText from '@gsap/react/SplitText';

function MyComponent() {
  return (
    <SplitText text="Hello, you!" />
  );
}
```

--------------------------------

TITLE: Customize Magic Bento Component Props
DESCRIPTION: Demonstrates how to configure the Magic Bento component using its various props. This includes enabling/disabling animations, effects like spotlight and stars, and controlling visual properties like radius and color.

SOURCE: https://www.reactbits.dev/components/magic-bento

LANGUAGE: javascript
CODE:
```
const BentoComponent = () => (
  <MagicBento
    spotlightRadius={400}
    enableStars={true}
    enableSpotlight={true}
    enableBorderGlow={true}
    disableAnimations={false}
    particleCount={12}
    enableTilt={false}
    glowColor="132, 0, 255"
    clickEffect={true}
    enableMagnetism={true}
  >
    {/* Content goes here */}
  </MagicBento>
);
```

--------------------------------

TITLE: Pixel Blast Props Documentation
DESCRIPTION: This section details the various properties (props) available for the Pixel Blast React component. It includes information on the expected data type, default value, and a description of each prop's functionality, covering visual aspects like shape, color, size, and animation effects.

SOURCE: https://www.reactbits.dev/backgrounds/pixel-blast

LANGUAGE: markdown
CODE:
```
## Props
Property| Type| Default| Description  
---|---|---|---  
variant| 'square'|'circle'|'triangle'|'diamond'| 'square'| Pixel shape variant.  
pixelSize| number| 4| Base pixel size (auto scaled for DPI).  
color| string| '#B19EEF'| Pixel color.  
patternScale| number| 2| Noise/pattern scale.  
patternDensity| number| 1| Pattern density adjustment.  
pixelSizeJitter| number| 0| Random jitter applied to coverage.  
enableRipples| boolean| true| Enable click ripple waves.  
rippleSpeed| number| 0.3| Ripple propagation speed.  
rippleThickness| number| 0.1| Ripple ring thickness.  
rippleIntensityScale| number| 1| Ripple intensity multiplier.  
liquid| boolean| false| Enable liquid distortion effect.  
liquidStrength| number| 0.1| Liquid distortion strength.  
liquidRadius| number| 1| Liquid touch brush radius scale.  
liquidWobbleSpeed| number| 4.5| Liquid wobble frequency.  
speed| number| 0.5| Animation time scale.  
edgeFade| number| 0.25| Edge fade distance (0-1).  
noiseAmount| number| 0| Post noise amount.  
transparent| boolean| true| Transparent background.  
```

--------------------------------

TITLE: Applying Custom Styling and Callbacks
DESCRIPTION: Shows how to apply additional CSS classes for styling and use the onLetterAnimationComplete callback to execute custom logic after animations finish.

SOURCE: https://www.reactbits.dev/text-animations/split-text

LANGUAGE: jsx
CODE:
```
import SplitText from '@gsap/react/SplitText';

function handleAnimationComplete() {
  console.log('All letter animations finished!');
}

function MyComponent() {
  return (
    <SplitText 
      text="Styled and Callback"
      className="my-custom-class"
      textAlign="center"
      onLetterAnimationComplete={handleAnimationComplete}
    />
  );
}
```

--------------------------------

TITLE: Counter Component Props
DESCRIPTION: This table outlines the available properties for the counter component. Each property details its type, default value, and a description of its purpose. Key properties include 'value', 'fontSize', 'gap', and styling options like 'containerStyle' and 'digitStyle'.

SOURCE: https://www.reactbits.dev/components/counter

LANGUAGE: javascript
CODE:
```
Property| Type| Default| Description
---|---|---|---
value| number| N/A (required)| The numeric value to display in the counter.
fontSize| number| 100| The base font size used for the counter digits.
padding| number| 0| Additional padding added to the digit height.
places| number[]| [100, 10, 1]| An array of place values to determine which digits to display.
gap| number| 8| The gap (in pixels) between each digit.
borderRadius| number| 4| The border radius (in pixels) for the counter container.
horizontalPadding| number| 8| The horizontal padding (in pixels) for the counter container.
textColor| string| 'white'| The text color for the counter digits.
fontWeight| string | number| 'bold'| The font weight of the counter digits.
containerStyle| React.CSSProperties| {}| Custom inline styles for the outer container.
counterStyle| React.CSSProperties| {}| Custom inline styles for the counter element.
digitStyle| React.CSSProperties| {}| Custom inline styles for each digit container.
gradientHeight| number| 16| The height (in pixels) of the gradient overlays.
gradientFrom| string| 'black'| The starting color for the gradient overlays.
gradientTo| string| 'transparent'| The ending color for the gradient overlays.
topGradientStyle| React.CSSProperties| undefined| Custom inline styles for the top gradient overlay.
bottomGradientStyle| React.CSSProperties| undefined| Custom inline styles for the bottom gradient overlay.
```

--------------------------------

TITLE: Shiny Text Component in React
DESCRIPTION: This snippet demonstrates the basic usage of the Shiny Text component in a React application. It requires no external dependencies beyond the component itself.

SOURCE: https://www.reactbits.dev/text-animations/shiny-text

LANGUAGE: jsx
CODE:
```
import ShinyText from 'react-shiny-text';

function App() {
  return (
    <div>
      <ShinyText>Shiny Text</ShinyText>
    </div>
  );
}
```

--------------------------------

TITLE: Dock Component Props
DESCRIPTION: Lists the properties available for customizing the Dock component. These include data for dock items, styling options like className and panelHeight, and animation parameters such as distance, baseItemSize, magnification, and spring configuration.

SOURCE: https://www.reactbits.dev/components/dock

LANGUAGE: typescript
CODE:
```
interface DockProps {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
}
```

--------------------------------

TITLE: Dock Item Data Structure
DESCRIPTION: Defines the structure for each item in the dock. Each item requires an icon, a label, and an onClick handler. An optional className can also be provided for custom styling.

SOURCE: https://www.reactbits.dev/components/dock

LANGUAGE: typescript
CODE:
```
interface DockItemData {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}
```

--------------------------------

TITLE: Text Pressure Layout and Scaling Options
DESCRIPTION: Illustrates the layout and scaling functionalities of the Text Pressure component, including flex layout and vertical scaling to fit container height.

SOURCE: https://www.reactbits.dev/text-animations/text-pressure

LANGUAGE: jsx
CODE:
```
import TextPressure from 'text-pressure';

function App() {
  return (
    <div style={{ height: '200px' }}>
      <TextPressure 
        text="Scaled Text"
        flex={false}
        scale
      />
    </div>
  );
}
```

--------------------------------

TITLE: Displaying Text with Text Pressure
DESCRIPTION: Basic usage of the Text Pressure component to display "Hello!". It utilizes default settings for font family and animation.

SOURCE: https://www.reactbits.dev/text-animations/text-pressure

LANGUAGE: jsx
CODE:
```
import TextPressure from 'text-pressure';

function App() {
  return (
    <TextPressure text="Hello!" />
  );
}
```

--------------------------------

TITLE: React Dither Component Usage
DESCRIPTION: This section outlines the properties available for customizing the Dither component.

SOURCE: https://www.reactbits.dev/backgrounds/dither

LANGUAGE: APIDOC
CODE:
```
## Dither Component Properties

### Description
Customizes the retro dithered waves effect for UI enhancement.

### Method
N/A (Component Props)

### Endpoint
N/A (Component)

### Parameters
#### Props
- **waveSpeed** (number) - Optional - Default: `0.05` - Speed of the wave animation.
- **waveFrequency** (number) - Optional - Default: `3` - Frequency of the wave pattern.
- **waveAmplitude** (number) - Optional - Default: `0.3` - Amplitude of the wave pattern.
- **waveColor** ([number, number, number]) - Optional - Default: `[0.5, 0.5, 0.5]` - Color of the wave, defined as an RGB array.
- **colorNum** (number) - Optional - Default: `4` - Number of colors to use in the dithering effect.
- **pixelSize** (number) - Optional - Default: `2` - Size of the pixels for the dithering effect.
- **disableAnimation** (boolean) - Optional - Default: `false` - Disable the wave animation when true.
- **enableMouseInteraction** (boolean) - Optional - Default: `true` - Enables mouse interaction to influence the wave effect.
- **mouseRadius** (number) - Optional - Default: `1` - Radius for the mouse interaction effect.

### Request Example
```jsx
<Dither waveSpeed={0.1} waveColor={[1, 0, 0]} disableAnimation={true} />
```

### Response
N/A (Component renders visually)

### Dependencies
- `postprocessing`
- `@react-three/fiber`
- `@react-three/postprocessing`
```

--------------------------------

TITLE: Gooey Nav Props Documentation
DESCRIPTION: This section details the properties available for the Gooey Nav component. It includes the property name, its type, default value, and a description of its purpose. Key props include 'items', 'animationTime', 'particleCount', and 'colors'.

SOURCE: https://www.reactbits.dev/components/gooey-nav

LANGUAGE: Markdown
CODE:
```
Property| Type| Default| Description  
---|---|---|---
items| GooeyNavItem[]| []| Array of navigation items.  
animationTime| number| 600| Duration (ms) of the main animation.  
particleCount| number| 15| Number of bubble particles per transition.  
particleDistances| [number, number]| [90, 10]| Outer and inner distances of bubble spread.  
particleR| number| 100| Radius factor influencing random particle rotation.  
timeVariance| number| 300| Random time variance (ms) for particle animations.  
colors| number[]| [1, 2, 3, 1, 2, 3, 1, 4]| Color indices used when creating bubble particles.  
initialActiveIndex| number| 0| Which item is selected on mount.  
```

--------------------------------

TITLE: Noise Component Properties
DESCRIPTION: This section details the available properties for customizing the Noise component, including pattern size, scaling, refresh interval, and alpha.

SOURCE: https://www.reactbits.dev/animations/noise

LANGUAGE: APIDOC
CODE:
```
## Noise Component Properties

### Description
Customization options for the Noise component.

### Method
N/A (Component Properties)

### Endpoint
N/A (Component Properties)

### Parameters
#### Properties
- **patternSize** (number) - Optional - Defines the size of the grain pattern.
- **patternScaleX** (number) - Optional - Scaling factor for the X-axis of the grain pattern.
- **patternScaleY** (number) - Optional - Scaling factor for the Y-axis of the grain pattern.
- **patternRefreshInterval** (number) - Optional - Number of frames before the grain pattern refreshes.
- **patternAlpha** (number) - Optional - Opacity of the grain pattern (0-255).

### Request Example
```json
{
  "patternSize": 250,
  "patternScaleX": 2,
  "patternScaleY": 2,
  "patternAlpha": 15
}
```

### Response
#### Success Response (N/A)
- Component renders with specified properties.

#### Response Example
N/A
```

--------------------------------

TITLE: Card Swap Component Props
DESCRIPTION: Defines the properties available for customizing the Card Swap component. These include dimensions, spacing, animation timing, hover behavior, click handling, skew, easing, and the content of the cards themselves.

SOURCE: https://www.reactbits.dev/components/card-swap

LANGUAGE: javascript
CODE:
```
Property| Type| Default| Description  
---|---|---|---
width| number | string| 500| Width of the card container  
height| number | string| 400| Height of the card container  
cardDistance| number| 60| X-axis spacing between cards  
verticalDistance| number| 70| Y-axis spacing between cards  
delay| number| 5000| Milliseconds between card swaps  
pauseOnHover| boolean| false| Whether to pause animation on hover  
onCardClick| (idx: number) => void| undefined| Callback function when a card is clicked  
skewAmount| number| 6| Degree of slope for top/bottom edges  
easing| 'linear' | 'elastic'| 'elastic'| Animation easing type  
children| ReactNode| required| Card components to display in the stack  
```

--------------------------------

TITLE: Staggered Menu Props and Usage
DESCRIPTION: Defines the properties for the Staggered Menu component, including types, default values, and descriptions for each prop. This allows developers to customize the menu's appearance and behavior.

SOURCE: https://www.reactbits.dev/components/staggered-menu

LANGUAGE: typescript
CODE:
```
interface StaggeredMenuItem {
  label: string;
  icon?: React.ReactNode;
  url: string;
}

interface StaggeredMenuSocialItem {
  label: string;
  icon?: React.ReactNode;
  url: string;
}

interface StaggeredMenuProps {
  position?: "left" | "right";
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}
```

--------------------------------

TITLE: Dither Component Props
DESCRIPTION: Lists the configurable properties for the Dither component, including their types, default values, and descriptions. These props allow customization of wave speed, frequency, amplitude, color, dithering effect, pixel size, animation, and mouse interaction.

SOURCE: https://www.reactbits.dev/backgrounds/dither

LANGUAGE: Markdown
CODE:
```
Property| Type| Default| Description  
---|---|---|---
waveSpeed| number| 0.05| Speed of the wave animation.  
waveFrequency| number| 3| Frequency of the wave pattern.  
waveAmplitude| number| 0.3| Amplitude of the wave pattern.  
waveColor| [number, number, number]| [0.5, 0.5, 0.5]| Color of the wave, defined as an RGB array.  
colorNum| number| 4| Number of colors to use in the dithering effect.  
pixelSize| number| 2| Size of the pixels for the dithering effect.  
disableAnimation| boolean| false| Disable the wave animation when true.  
enableMouseInteraction| boolean| true| Enables mouse interaction to influence the wave effect.  
mouseRadius| number| 1| Radius for the mouse interaction effect.  
```

--------------------------------

TITLE: Pixel Transition Component Props
DESCRIPTION: Defines the properties available for the React Pixel Transition component. These include content display, grid configuration, animation timing, and styling options. The component depends on GSAP for animations.

SOURCE: https://www.reactbits.dev/animations/pixel-transition

LANGUAGE: javascript
CODE:
```
interface PixelTransitionProps {
  firstContent?: ReactNode;
  secondContent?: ReactNode;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  aspectRatio?: string;
  className?: string;
  style?: object;
}
```

--------------------------------

TITLE: React Glass Surface Component Props
DESCRIPTION: This table lists the available props for the Glass Surface React component. Each prop details its type, default value, and a description of its function, allowing developers to customize the visual appearance and behavior of the glass effect.

SOURCE: https://www.reactbits.dev/components/glass-surface

LANGUAGE: javascript
CODE:
```
/**
 * Props for the Glass Surface component.
 */
interface GlassSurfaceProps {
  /** Content to display inside the glass surface */
  children?: React.ReactNode;
  /** Width of the glass surface (pixels or CSS value like '100%') */
  width?: number | string;
  /** Height of the glass surface (pixels or CSS value like '100vh') */
  height?: number | string;
  /** Border radius in pixels */
  borderRadius?: number;
  /** Border width factor for displacement map */
  borderWidth?: number;
  /** Brightness percentage for displacement map */
  brightness?: number;
  /** Opacity of displacement map elements */
  opacity?: number;
  /** Input blur amount in pixels */
  blur?: number;
  /** Output blur (stdDeviation) */
  displace?: number;
  /** Background frost opacity (0-1) */
  backgroundOpacity?: number;
  /** Backdrop filter saturation factor */
  saturation?: number;
  /** Main displacement scale */
  distortionScale?: number;
  /** Red channel extra displacement offset */
  redOffset?: number;
  /** Green channel extra displacement offset */
  greenOffset?: number;
  /** Blue channel extra displacement offset */
  blueOffset?: number;
  /** X displacement channel selector */
  xChannel?: 'R' | 'G' | 'B';
  /** Y displacement channel selector */
  yChannel?: 'R' | 'G' | 'B';
  /** Mix blend mode for displacement map */
  mixBlendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';
  /** Additional CSS class names */
  className?: string;
  /** Inline styles object */
  style?: React.CSSProperties;
}

```

--------------------------------

TITLE: Shuffle Component - Looping and Callbacks
DESCRIPTION: Demonstrates how to make the shuffle animation loop indefinitely and trigger a callback when the animation completes. 'loop', 'loopDelay', and 'onShuffleComplete' are used.

SOURCE: https://www.reactbits.dev/text-animations/shuffle

LANGUAGE: jsx
CODE:
```
import Shuffle from './Shuffle';

function App() {
  const handleComplete = () => {
    console.log("Shuffle animation complete!");
  };

  return (
    <Shuffle 
      text="Looping Shuffle"
      loop={true}
      loopDelay={1}
      onShuffleComplete={handleComplete}
    />
  );
}
```

--------------------------------

TITLE: React Beams Component Props
DESCRIPTION: This section details the customizable properties (props) available for the React Beams component.

SOURCE: https://www.reactbits.dev/backgrounds/beams

LANGUAGE: APIDOC
CODE:
```
## React Beams Component

### Description
Radiant beams for creative user interfaces.

### Props

#### Props Table
| Property | Type | Default | Description |
|---|---|---|---|
| beamWidth | number | 2 | Width of each beam. |
| beamHeight | number | 15 | Height of each beam. |
| beamNumber | number | 12 | Number of beams to display. |
| lightColor | string | '#ffffff' | Color of the directional light. |
| speed | number | 2 | Speed of the animation. |
| noiseIntensity | number | 1.75 | Intensity of the noise effect overlay. |
| scale | number | 0.2 | Scale of the noise pattern. |
| rotation | number | 0 | Rotation of the entire beams system in degrees. |

### Dependencies
- three
- @react-three/fiber
- @react-three/drei
```

--------------------------------

TITLE: Blob Cursor Component API
DESCRIPTION: This section details the properties available for configuring the Blob Cursor component.

SOURCE: https://www.reactbits.dev/animations/blob-cursor

LANGUAGE: APIDOC
CODE:
```
## Component: BlobCursor

### Description
This component provides a customizable blob cursor effect.

### Props

#### blobType
- **Type**: 'circle' | 'square'
- **Default**: 'circle'
- **Description**: Shape of the blobs.

#### fillColor
- **Type**: string
- **Default**: '#5227FF'
- **Description**: Background color of each blob.

#### trailCount
- **Type**: number
- **Default**: 3
- **Description**: How many trailing blobs.

#### sizes
- **Type**: number[]
- **Default**: [60, 125, 75]
- **Description**: Sizes (px) of each blob. Length must be ≥ trailCount.

#### innerSizes
- **Type**: number[]
- **Default**: [20, 35, 25]
- **Description**: Sizes (px) of inner dots. Length must be ≥ trailCount.

#### innerColor
- **Type**: string
- **Default**: 'rgba(255,255,255,0.8)'
- **Description**: Background color of the inner dot.

#### opacities
- **Type**: number[]
- **Default**: [0.6, 0.6, 0.6]
- **Description**: Opacity of each blob. Length ≥ trailCount.

#### shadowColor
- **Type**: string
- **Default**: 'rgba(0,0,0,0.75)'
- **Description**: Box-shadow color.

#### shadowBlur
- **Type**: number
- **Default**: 5
- **Description**: Box-shadow blur radius (px).

#### shadowOffsetX
- **Type**: number
- **Default**: 10
- **Description**: Box-shadow X offset (px).

#### shadowOffsetY
- **Type**: number
- **Default**: 10
- **Description**: Box-shadow Y offset (px).

#### filterId
- **Type**: string
- **Default**: 'blob'
- **Description**: Optional custom filter ID (for multiple instances).

#### filterStdDeviation
- **Type**: number
- **Default**: 30
- **Description**: feGaussianBlur stdDeviation for SVG filter.

#### filterColorMatrixValues
- **Type**: string
- **Default**: '1 0 0 ...'
- **Description**: feColorMatrix values for SVG filter.

#### useFilter
- **Type**: boolean
- **Default**: true
- **Description**: Enable the SVG filter.

#### fastDuration
- **Type**: number
- **Default**: 0.1
- **Description**: GSAP duration for the lead blob.

#### slowDuration
- **Type**: number
- **Default**: 0.5
- **Description**: GSAP duration for the following blobs.

#### fastEase
- **Type**: string
- **Default**: 'power3.out'
- **Description**: GSAP ease for the lead blob.

#### slowEase
- **Type**: string
- **Default**: 'power1.out'
- **Description**: GSAP ease for the following blobs.

#### zIndex
- **Type**: number
- **Default**: 100
- **Description**: CSS z-index of the whole component.

### Dependencies
- gsap
```

--------------------------------

TITLE: Sticker Peel Component Usage
DESCRIPTION: This snippet demonstrates how to import and use the Sticker Peel component in a React application. It requires the 'gsap' library for animations. The component takes various props to customize the peel effect, image source, and appearance.

SOURCE: https://www.reactbits.dev/animations/sticker-peel

LANGUAGE: javascript
CODE:
```
import React from 'react';
import StickerPeel from './StickerPeel'; // Assuming StickerPeel is in the same directory

function App() {
  return (
    <div className="App">
      <StickerPeel
        imageSrc="path/to/your/image.jpg"
        rotate={30}
        peelBackHoverPct={30}
        peelBackActivePct={40}
        peelDirection={0}
        peelEasing="power3.out"
        peelHoverEasing="power2.out"
        width={200}
        shadowIntensity={0.6}
        lightingIntensity={0.1}
        initialPosition="center"
        className="my-sticker"
      />
    </div>
  );
}

export default App;

```

--------------------------------

TITLE: Customizing Text Pressure: Font and Color
DESCRIPTION: Demonstrates how to customize the Text Pressure component by specifying the font family, providing a font URL, setting text color, and stroke color.

SOURCE: https://www.reactbits.dev/text-animations/text-pressure

LANGUAGE: jsx
CODE:
```
import TextPressure from 'text-pressure';

function App() {
  return (
    <TextPressure 
      text="Styled Text"
      fontFamily="Inter"
      fontUrl="/fonts/Inter.woff2"
      textColor="#00FF00"
      strokeColor="#FFFFFF"
    />
  );
}
```

--------------------------------

TITLE: Apply Inline Styles and Custom Class
DESCRIPTION: Demonstrates applying custom inline styles to the waves container and adding a custom CSS class for further styling through the `style` and `className` props.

SOURCE: https://www.reactbits.dev/backgrounds/waves

LANGUAGE: jsx
CODE:
```
import Waves from 'react-waves';

function MyWaves() {
  const customStyles = {
    border: '1px solid #ccc',
    borderRadius: '8px'
  };

  return (
    <Waves 
      style={customStyles}
      className="my-custom-waves"
    />
  );
}
```

--------------------------------

TITLE: Applying Minimum Font Size with Text Pressure
DESCRIPTION: Demonstrates how to set a minimum font size for the Text Pressure component to prevent text from becoming too small on different screen sizes.

SOURCE: https://www.reactbits.dev/text-animations/text-pressure

LANGUAGE: jsx
CODE:
```
import TextPressure from 'text-pressure';

function App() {
  return (
    <TextPressure 
      text="Minimum Size"
      minFontSize={36}
    />
  );
}
```

--------------------------------

TITLE: Profile Card Props Documentation
DESCRIPTION: This section details the properties (props) available for the React Profile Card component. It covers image sources for avatars and patterns, gradient customization for background effects, tilt effect controls for 3D interaction, and display options for user information like name, title, and status.

SOURCE: https://www.reactbits.dev/components/profile-card

LANGUAGE: JSTS
CODE:
```
avatarUrl: string | "<Placeholder for avatar URL>" | URL for the main avatar image displayed on the card
iconUrl: string | "<Placeholder for icon URL>" | Optional URL for an icon pattern overlay on the card background
grainUrl: string | "<Placeholder for grain URL>" | Optional URL for a grain texture overlay effect
behindGradient: string | undefined | Custom CSS gradient string for the background gradient effect
innerGradient: string | undefined | Custom CSS gradient string for the inner card gradient
showBehindGradient: boolean | true | Whether to display the background gradient effect
className: string | "" | Additional CSS classes to apply to the card wrapper
enableTilt: boolean | true | Enable or disable the 3D tilt effect on mouse hover
enableMobileTilt: boolean | false | Enable or disable the 3D tilt effect on mobile devices
mobileTiltSensitivity: number | 5 | Sensitivity of the 3D tilt effect on mobile devices
miniAvatarUrl: string | undefined | Optional URL for a smaller avatar in the user info section
name: string | "Javi A. Torres" | User's display name
title: string | "Software Engineer" | User's job title or role
handle: string | "javicodes" | User's handle or username (displayed with @ prefix)
status: string | "Online" | User's current status
contactText: string | "Contact" | Text displayed on the contact button
showUserInfo: boolean | true | Whether to display the user information section
onContactClick: function | undefined | Callback function called when the contact button is clicked
```

--------------------------------

TITLE: Pill Nav Component Structure
DESCRIPTION: This snippet outlines the basic structure of the Pill Nav component, including its list of navigation items.

SOURCE: https://www.reactbits.dev/components/pill-nav

LANGUAGE: javascript
CODE:
```
  * Home
  * About
  * Contact
```

--------------------------------

TITLE: Cursor Customization Options
DESCRIPTION: Details the properties related to the cursor's appearance and behavior within the typing animation. This includes the character used for the cursor, its blinking animation duration, and optional styling via CSS classes.

SOURCE: https://www.reactbits.dev/text-animations/text-type

LANGUAGE: javascript
CODE:
```
cursorCharacter| string | React.ReactNode| || Character or React node to use as cursor
cursorBlinkDuration| number| 0.5| Animation duration for cursor blinking
cursorClassName| string| ''| Optional class name for cursor styling
```

--------------------------------

TITLE: Enabling Text Pressure Animation Effects
DESCRIPTION: Shows how to enable various animation effects for the Text Pressure component, including alpha (opacity based on cursor distance), stroke, width, weight, and italic variations.

SOURCE: https://www.reactbits.dev/text-animations/text-pressure

LANGUAGE: jsx
CODE:
```
import TextPressure from 'text-pressure';

function App() {
  return (
    <TextPressure 
      text="Animated!"
      alpha
      stroke
      width
      weight
      italic
    />
  );
}
```

--------------------------------

TITLE: Click Spark Component Properties
DESCRIPTION: Defines the customizable properties for the Click Spark React component, including color, size, count, and animation duration.

SOURCE: https://www.reactbits.dev/animations/click-spark

LANGUAGE: javascript
CODE:
```
interface SparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: string;
  extraScale?: number;
  children?: React.ReactNode;
}
```