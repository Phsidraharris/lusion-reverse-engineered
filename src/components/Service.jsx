import React, { useState, useEffect } from 'react';
import growth from '../assets/growth.png';
import model from '../assets/model.png';
import FeatureSection from './FeatureSection';
import ShuffleText from './ShuffleText';

function Service() {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="2xl:px-40 lg:px-22 px-6 bg-brand-background flex flex-col gap-y-12 py-16 text-brand-text">
      {/* Hero Section */}
      <div className="relative flex items-center justify-between flex-wrap gap-y-6 md:flex-nowrap w-full py-12">
        <div className="sm:w-full md:w-3/4 xl:w-[50%] lg:w-[70%]">
          <div className="flex gap-3 mb-3">
            <section id="video-panel-section">
              <div className="about-headers">
                <div className="animated-h1-container">
                  <h1 id="h1-topline" className={`text-brand-text ${isAnimated ? 'animate' : ''}`}>
                    <ShuffleText text="BEYOND VISIONS" />
                  </h1>
                </div>
                <div className="animated-h1-container">
                  <h1 id="h1-tagline" className={`text-brand-text ${isAnimated ? 'animate' : ''}`}>
                    <ShuffleText text="WITHIN REACH" />
                  </h1>
                </div>
              </div>
            </section>
          </div>
          <div>
            <p className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight text-brand-text/90">
              Our models are designed to augment and elevate the global
              workforce, so businesses can thrive and stay competitive in the AI
              era.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <img alt="" className="max-w-full h-auto" />
        </div>
      </div>

      {/* Features */}
      <FeatureSection
        image={growth}
        imagePosition="right"
        tags={[
          <p
            key="new"
            className="px-2 py-1 bg-brand-accent rounded-md text-white font-semibold"
          >
            NEW
          </p>,
          <p key="command" className="text-brand-text/80">
            COMMAND
          </p>,
          <img
            key="icon"
            src="https://cdn.sanity.io/images/rjtqmwfu/production/a1909385aa103bc3e54a2d23908601d7efbab49f-16x16.svg"
            alt=""
            className="w-4 h-4"
          />,
        ]}
        title="Rodiax Command, powering innovation with enterprise GenAI"
        description="Command models are used by companies to build production-ready, scalable and efficient AI-powered applications."
      />

      <FeatureSection
        image={model}
        imagePosition="left"
        tags={[
          <p key="embed" className="text-brand-text/80">
            Embed
          </p>,
          <img
            key="icon"
            src="https://cdn.sanity.io/images/rjtqmwfu/production/edc039dd5d2fa738f669b38dba03cd6de786a7ef-16x16.svg"
            alt=""
            className="w-4 h-4"
          />,
        ]}
        title="Rodiax Embed, unlocking the full potential of your enterprise data"
        description="We have trained our models on the language of business to enable the most accurate and efficient solution. Scale your Enterprise AI strategy starting with the highest performing embedding model, which supports over 100 languages."
      />

      <FeatureSection
        image={growth}
        imagePosition="right"
        tags={[
          <p key="rerank" className="text-brand-text/80">
            RETRIEVAL & RERANK
          </p>,
          <img
            key="icon"
            src="https://cdn.sanity.io/images/rjtqmwfu/production/3a6986e934884dcfd228cf2bdd4680c1915d8d43-16x16.svg"
            alt=""
            className="w-4 h-4"
          />,
        ]}
        title="Rodiax Rerank, surfacing the industry’s most accurate responses."
        description="The combination of Rerank and Embed delivers the most reliable and up-to-date responses for your application, grounding retrieval-augmented generation (RAG) in your data."
      />
    </div>
  );
}

export default Service;
