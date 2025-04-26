import React from 'react';
import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 p-6"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-6xl w-full mx-auto text-center"
      >
        <motion.div
          className="mb-8 flex justify-center"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="p-4 bg-blue-500 rounded-full">
            <Camera size={48} className="text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold mb-6 text-white"
        >
          Pixora Booth
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 mb-10 text-lg max-w-2xl mx-auto"
        >
          Abadikan Setiap Momen Berharga dengan Sentuhan Seni. Ciptakan Kenangan Tak Terlupakan.
        </motion.p>

        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-lg mb-16"
        >
          Start
        </motion.button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto"
        >
          <FeatureCard
            title="Tangkap Momen"
            description="Tangkap setiap detik berharga dengan kualitas HD terbaik, lengkap dengan pengaturan kamera profesional seperti timer, flash, dan panduan grid untuk hasil sempurna."
            delay={0.7}
          />
          <FeatureCard
            title="Filter Eksklusif"
            description="Percantik foto Anda dengan filter real-time berkelas, mulai dari nuansa grayscale, sepia klasik, hingga efek vintage yang memikat."
            delay={0.8}
          />
          <FeatureCard
            title="Stiker Kreatif"
            description="Ekspresikan diri dengan koleksi stiker menarik. Tempatkan, sesuaikan, dan hiasi foto Anda sesuka hati untuk tampilan yang lebih hidup."
            delay={0.9}
          />
          <FeatureCard
            title="Pesan Pribadi"
            description="Tambahkan teks khusus dengan beragam pilihan warna dan ukuran, menghadirkan sentuhan personal dalam setiap karya Anda."
            delay={1.0}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, delay }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-transform duration-300"
    >
      <h3 className="text-xl font-semibold text-blue-400 mb-3">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default StartScreen;