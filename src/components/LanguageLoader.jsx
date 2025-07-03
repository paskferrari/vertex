import React from 'react';
import { motion } from 'framer-motion';

/**
 * Loading component shown during language change
 */
const LanguageLoader = () => {
  return (
    <div className="fixed inset-0 bg-dark bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        className="bg-dark-lighter p-6 rounded-xl shadow-lg flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex space-x-2 mb-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-primary rounded-full"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: 'loop',
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
        <p className="text-white text-sm">Cambiando lingua...</p>
      </motion.div>
    </div>
  );
};

export default LanguageLoader;