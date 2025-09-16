import { Environment, Lightformer, MeshTransmissionMaterial, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, N8AO } from '@react-three/postprocessing';
import { BallCollider, CuboidCollider, Physics, RigidBody } from '@react-three/rapier';
import { easing } from 'maath';
import { useMemo, useReducer, useRef } from 'react';
import * as THREE from 'three';
import Button from "./Button";
import LogoCarousel from './LogoCarousel';




function Home() {
  const heroAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const wordAnimation = {
    hidden: { y: '100%' },
    visible: {
      y: 0,
      transition: {
        ease: 'circOut',
        duration: 0.8,
      },
    },
  };

  const rotatingWords = [
    'Enterprise AI Platform',
    'Generative AI Solution',
    'Intelligence Platform',
    'AI Development Hub'
  ];

  return (
    <div className="w-full relative">
      {/* Single shared canvas (kept) */}
      <canvas id="canvas" className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />
       <div
          id="hero-with-physics"
          className="relative w-full py-6 lg:py-16 2xl:py-26 max-w-screen-xl mx-auto pt-28 lg:pt-36"
        >
          {/* Physics target (background layer) */}
            {/* This div defines the area PhysicsSandbox will size to.
                Absolutely positioned, behind the text. */}
          <div
            id="physics-sandbox-div"
            className="absolute inset-0 -z-10 pointer-events-none"
          />

          <div className="flex flex-col justify-between lg:gap-y-12 gap-y-6 pb-10 relative">
            <div className="lg:mb-0 md:mb-4">
              <h1 className="2xl:text-7xl text-5xl font-[serif]">
                <span>The Leading</span>
                <br /> <span>Enterprise AI Platform</span>
              </h1>
            </div>
            <div className="lg:mb-10 mb-6">
              <p className="2xl:text-[38px] text-2xl font-starcil font-extrabold">
                Built on the language of business
              </p>
            </div>
            <div className="lg:mb-0 md:mb-4">
              <p className="2xl:text-2xl text-[18px] font-starcil font-extrabold">
                <span> Optimized for enterprise generative AI,</span> <br />
                <span>search and discovery, and advanced retrieval.</span>
              </p>
            </div>
            <div className="flex flex-col gap-y-3">
              <Button
                bgColor="bg-[#212121]"
                title="Contact Sales"
                textSize="text-[14px]"
              />
              <div className="relative rounded-lg cursor-pointer">
                <div className="absolute text-black text-sm top-1 -left-5 ml-8 mt-1 rounded-lg sm:w-auto w-full">
                  TRY THE PLAYGROUND
                </div>
                <input
                  className="sm:w-auto w-full text-white px-16 py-2 text-left border-black border-[1px] rounded-lg cursor-pointer"
                  type="text"
                  aria-label="search"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

    </div>
  );
}
export default Home;
