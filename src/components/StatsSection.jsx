import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const StatItem = ({ value, label }) => {
  // Memoize animation variants to prevent recreation
  const variants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }), []);

  return (
    <motion.div
      className="text-center"
      variants={variants}
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
  // Memoize stats data array
  const statsData = useMemo(() => [
    { value: 100, label: "Languages Supported" },
    { value: 5, label: "Million Models Trained" },
    { value: 99, label: "Uptime SLA" }
  ], []);

  // Memoize container animation props
  const containerProps = useMemo(() => ({
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: 0.5 },
    transition: { staggerChildren: 0.3 }
  }), []);

  return (
    <motion.div
      className="max-w-screen-lg mx-auto px-6 py-16"
      {...containerProps}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statsData.map((stat, index) => (
          <StatItem key={index} value={stat.value} label={stat.label} />
        ))}
      </div>
    </motion.div>
  );
};

export default StatsSection;
