import { motion } from 'framer-motion';

function Button({
  title,
  bgColor = 'bg-gray-900',
  textSize = 'text-[17px]',
  textColor = 'text-white',
  className = '',
}) {
  return (
    <motion.button
      whileHover="hover"
      className={`relative overflow-hidden rounded-lg px-6 py-3 font-semibold ${bgColor} ${textColor} ${textSize} ${className}`}
    >
      <span className="relative z-10">{title}</span>
      <motion.div
        className="absolute inset-0 bg-white/20"
        variants={{
          hover: {
            x: '100%',
            transition: {
              ease: 'linear',
              duration: 0.5,
            },
          },
        }}
        initial={{ x: '-100%' }}
      />
    </motion.button>
  );
}

export default Button;
