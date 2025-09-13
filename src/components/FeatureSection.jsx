import React from 'react';
import Button from './Button';
import { motion } from 'framer-motion';

const FeatureSection = ({
  image,
  imagePosition = 'left',
  tags,
  title,
  description,
  buttonText = 'Learn more',
}) => {
  const imageOrder = imagePosition === 'left' ? 'md:order-1' : 'md:order-2';
  const textOrder = imagePosition === 'left' ? 'md:order-2' : 'md:order-1';

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const imageVariants = {
    hidden: {
      opacity: 0,
      x: imagePosition === 'left' ? -100 : 100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      x: imagePosition === 'left' ? 100 : -100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="relative flex items-center justify-between flex-wrap gap-y-10 md:flex-nowrap w-full py-14 font-serif font-medium bg-brand-background/10 backdrop-blur rounded-3xl border border-brand-text/10"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className={`w-full md:w-1/2 flex justify-center md:justify-end order-2 ${imageOrder}`}
        variants={imageVariants}
      >
        <img src={image} alt="" className="max-w-full h-auto" />
      </motion.div>
      <motion.div
        className={`sm:w-full md:w-3/4 lg:w-[60%] xl:w-[50%] flex justify-start flex-wrap flex-col 2xl:px-20 lg:px-10 px-4 order-1 ${textOrder}`}
        variants={textVariants}
      >
        {tags && (
          <div className="flex gap-3 items-center text-[11px] tracking-wide my-2 uppercase">
            {tags.map((tag, index) => (
              <React.Fragment key={index}>{tag}</React.Fragment>
            ))}
          </div>
        )}

        <div>
          <p className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 leading-tight text-brand-text">
            {title}
          </p>
          <p className="mb-8 text-base leading-relaxed text-brand-text/90">
            {description}
          </p>
          <Button
            bgColor="bg-brand-accent hover:bg-brand-accent-hover"
            textColor="text-white"
            textSize="text-sm tracking-wide"
            title={buttonText}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FeatureSection;
