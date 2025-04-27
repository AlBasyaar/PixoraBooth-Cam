import React from 'react';
import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="h-screen w-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen w-full bg-gradient-to-b from-gray-800 to-gray-900 p-4 sm:p-6"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-6xl w-full mx-auto text-center py-8 sm:py-12"
        >
          <motion.div
            className="mb-6 sm:mb-8 flex justify-center"
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
            <div className="p-3 sm:p-4 bg-blue-500 rounded-full">
              <Camera size={32} className="text-white sm:hidden" />
              <Camera size={48} className="text-white hidden sm:block" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white"
          >
            Pixora Booth
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 mb-6 sm:mb-10 text-base sm:text-lg max-w-2xl mx-auto px-4"
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
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-lg mb-10 sm:mb-16"
          >
            Start
          </motion.button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-2 sm:px-4"
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
          
          {/* Extra content to ensure scrolling is visible */}
          <div className="mt-24 py-8 border-t border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Kenapa Memilih Pixora Booth?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
              <div className="bg-gray-800/40 p-4 rounded-lg">
                <h3 className="text-blue-400 font-medium mb-2">Kualitas Premium</h3>
                <p className="text-gray-300 text-sm">Hasil foto dengan resolusi tinggi dan detail yang tajam, sempurna untuk dicetak atau dibagikan di media sosial.</p>
              </div>
              <div className="bg-gray-800/40 p-4 rounded-lg">
                <h3 className="text-blue-400 font-medium mb-2">Kemudahan Penggunaan</h3>
                <p className="text-gray-300 text-sm">Antarmuka yang intuitif memudahkan siapa saja untuk mengoperasikan tanpa pelatihan khusus.</p>
              </div>
              <div className="bg-gray-800/40 p-4 rounded-lg">
                <h3 className="text-blue-400 font-medium mb-2">Berbagi Instan</h3>
                <p className="text-gray-300 text-sm">Bagikan kenangan langsung ke media sosial atau kirim melalui email dan pesan dalam hitungan detik.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 mb-12">
            <p className="text-gray-400 text-sm">© 2025 Pixora Booth. Semua Hak Dilindungi.</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
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
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 transform hover:scale-105 transition-transform duration-300"
    >
      <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-2 sm:mb-3">{title}</h3>
      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default StartScreen;