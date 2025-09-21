import React from "react";
import { motion } from "framer-motion";
import Button from "./Button";
import SplitText from "./SplitText";
import ShuffleText from "./ShuffleText";

function DeploymentOption() {
  const deploymentOptions = [
    "https://cdn.sanity.io/images/rjtqmwfu/production/0adbf394439f4cd0ab8b5b3b6fe1da10c8099024-201x200.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/production/3121e36c6a2270a890e2721ecb40b9637fa7055f-201x200.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/production/643f6e32aa0ce3ac6540bcbccb5274a0a4af1ba0-201x200.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/production/53437df4220d35e45d5a0a66fbde6110366bf0e2-201x200.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/production/1455da306f9f50dc2b28eb81ef080f7c1c8b8e6d-201x200.svg",
    "https://cdn.sanity.io/images/rjtqmwfu/production/870d461f4de551ead02c43531936113310be9389-201x200.svg",
  ];
  return (
    <section>
      <div className="bg-[#E6E3DB] relative flex justify-between items-center lg:gap-x-36 md:gap-x-10 gap-y-10 flex-wrap md:flex-nowrap py-16 2xl:px-44 lg:px-24 px-5">
        <motion.div 
          className="md:w-[40%] w-full flex flex-col gap-y-8"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div>
            <motion.div 
              className="mb-3"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <ShuffleText text="DEPLOYMENT OPTIONS" />
            </motion.div>
            <div className="lg:text-4xl md:text-3xl text-2xl">
              <SplitText text="Enterprise-grade AI deployment on any cloud or on-premises" />
            </div>
          </div>
          <motion.div 
            className="text-[17px] mb-10 text-justify"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Only Rodiax provides flexible and secure deployment options. Bring
            our models to your data.
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Button
              bgColor="bg-black"
              textColor="text-white"
              textSize="text-[14px]"
              title="TRY THE PLAYGROUND"
            />
          </motion.div>
        </motion.div>
        <motion.div 
          className="w-full grid md:grid-cols-3 grid-cols-2 md:gap-5 gap-y-5 gap-x-5"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {deploymentOptions.map((option, index) => (
            <motion.img 
              key={index} 
              className="w-full" 
              src={option} 
              alt=""
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              viewport={{ once: true }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default DeploymentOption;
