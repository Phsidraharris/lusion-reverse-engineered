import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TextAnimation } from "../TextAnimation";
import Button from "./Button";
import ShuffleText from "./ShuffleText";
import MorphingBlob from "./MorphingBlob";

function OurMission() {
  const textRef = useRef(null);

  // Using useEffect to ensure animation triggers after the component has mounted
  useEffect(() => {
    TextAnimation(textRef); // Trigger the animation after the component mounts
  }, []);

  return (
    <section
      className="2xl:px-40 lg:px-22 px-6 bg-cover bg-center py-10 relative overflow-hidden"
      style={{ backgroundColor: "azure" }}
    >
      {/* Add morphing blob background */}
      <MorphingBlob colors={['#ffffff', '#f0f8ff', '#e6f3ff']} />
      
      <div className="w-full relative py-12 lg:py-16 2xl:py-26 max-w-full-screen mx-auto px-5 md:px-5 lg:px-12">
        <motion.div 
          className="relative flex justify-between items-center"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="text-white text-[14px] font-starcil">
              <ShuffleText text="OUR MISSION" />
            </p>
          </div>
          <div className="hidden lg:block">
            <Button
              title="JOIN OUR TEAM"
              bgColor="bg-white"
              textColor="text-black"
              textSize="text-[15px]"
            />
          </div>
        </motion.div>
        <motion.div 
          className="relative flex justify-center items-center md:px-44 sm:px-36 my-28"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div>
            <p
              ref={textRef}
              className="2xl:text-7xl lg:text-5xl md:text-4xl text-3xl text-white text-center font-staread"
            >
              Do whatever it takes to scale intelligence to serve humanity
            </p>
          </div>
        </motion.div>
        <div className="relative grid md:grid-cols-3 grid-cols-1 gap-8 font-serif">
          <motion.div 
            className="flex justify-start items-start gap-3 text-white lg:pr-20"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div>
              <h3>1.</h3>
            </div>
            <div>
              <span className="uppercase">Do whatever it takes</span>
              <div className="mt-4">We work tirelessly towards our goals.</div>
            </div>
          </motion.div>
          <motion.div 
            className="flex justify-start items-start gap-3 text-white lg:pr-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <div>
              <h3>2.</h3>
            </div>
            <div>
              <span className="uppercase">TO scale intelligence</span>
              <div className="mt-4">
                We want to make intelligence abundant, affordable, and
                accessible.
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="flex justify-start items-start gap-3 text-white lg:pr-20"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            viewport={{ once: true }}
          >
            <div>
              <h3>3.</h3>
            </div>
            <div>
              <span className="uppercase">to serve humanity</span>
              <div className="mt-4">
                We build our technology to benefit people and positively impact
                the world.
              </div>
            </div>
          </motion.div>
        </div>
        <div className="lg:hidden relative flex md:justify-end items-center my-10">
          <div className="flex grow">
            <Button
              title="JOIN OUR TEAM"
              bgColor="bg-white"
              textColor="text-black"
              textSize="text-[15px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurMission;
