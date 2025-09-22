import React, { Suspense } from "react";
import Button from "./Button";
import SplitText from "./SplitText";
import { LazyParticleField } from "./LazyComponents";
import { motion } from "framer-motion";

function RetrievalModels() {
  return (
    <section>
      <div className="bg-[#0C1210] text-gray-50 relative flex justify-between items-center lg:gap-x-20 md:gap-x-16 gap-y-10 flex-wrap md:flex-nowrap py-16 2xl:px-44 lg:px-24 px-5 overflow-hidden">
        {/* Add particle field for tech aesthetic with lazy loading */}
        <Suspense fallback={null}>
          <LazyParticleField 
            particleCount={80} 
            particleColor="rgba(96, 165, 250, 0.3)"
            animationSpeed={0.5}
          />
        </Suspense>
        <motion.div 
          className="2xl:w-full md:w-[50%] w-full flex flex-col gap-y-16"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="lg:text-5xl md:text-4xl text-2xl">
            <SplitText text="Build with Advanced Retrieval" />
          </div>
          <motion.div 
            className="text-[17px] mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Our Generative AI and Advanced Retrieval models work seamlessly
            together for applications requiring RAG. It's easy to connect and
            retrieve information from documents and enterprise data sources to
            build more powerful AI applications.
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Button
              bgColor="bg-white"
              textColor="text-black"
              textSize="text-[14px]"
              title="TRY THE PLAYGROUND"
            />
          </motion.div>
        </motion.div>
        <motion.div 
          className="w-full"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <img
            className="w-full"
            src="https://cdn.sanity.io/images/rjtqmwfu/production/4c7a6d577e79c43f4e0415b3f56f943616dff916-647x531.svg"
            alt=""
          />
        </motion.div>
      </div>
    </section>
  );
}

export default RetrievalModels;
