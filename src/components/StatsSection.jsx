import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const StatItem = ({ value, label }) => {
  return (
    <motion.div
      className="text-center"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
          },
        },
      }}
    >
      <div className="text-4xl lg:text-6xl font-bold text-brand-accent">
        <CountUp end={value} duration={3} enableScrollSpy />
+
      </div>
      <div className="text-sm lg:text-base text-brand-text/80 mt-2">
        {label}
      </div>
    </motion.div>
  );
};

const StatsSection = () => {
  return (
    <motion.div
      className="max-w-screen-lg mx-auto px-6 py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatItem value={100} label="Languages Supported" />
        <StatItem value={5} label="Million Models Trained" />
        <StatItem value={99} label="Uptime SLA" />
      </div>
    </motion.div>
  );
};

export default StatsSection;
