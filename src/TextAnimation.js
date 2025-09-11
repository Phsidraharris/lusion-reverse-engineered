import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const TextAnimation = (textRef) => {
  // Ensure textRef is valid and current
  if (!textRef?.current) {
    console.error("Invalid textRef. Please ensure it is a valid React ref.");
    return;
  }

  const textElement = textRef.current; // Access the DOM element

  // Split text into individual letters and wrap each letter in a span
  const textContent = textElement.textContent;
  const splitText = textContent
    .split("")
    .map((letter) => `<span class="letter">${letter}</span>`)
    .join("");
  textElement.innerHTML = splitText; // Set the innerHTML to the split text

  // GSAP animation logic for each letter
  gsap.fromTo(
    textElement.querySelectorAll(".letter"),
    {
      opacity: 0,
      y: 20, // Initial position is slightly below
      x: 0, // Keep it aligned horizontally at the start
    },
    {
      opacity: 1,
      y: 0, // Move to its original position
      x: 0, // Keep the original horizontal position
      duration: 5, // Slower animation duration (increase as necessary)
      ease: "ease",
      stagger: 0.5, // Delay between each letter animation (increase for slower effect)
      scrollTrigger: {
        trigger: textElement, // Element triggering the animation
        start: "top 80%", // Start animation when the element enters the viewport
        end: "bottom 50%", // End animation at this point
        scrub: 1, // Smooth scrubbing
      },
    }
  );
};
