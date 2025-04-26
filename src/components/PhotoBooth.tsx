import React, { useState, useRef, useEffect } from 'react';
import { Camera, Settings, Image as ImageIcon, Brush, Sticker, MessageSquare, Home, FlipHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CameraView from './camera/CameraView';
import SettingsPanel from './settings/SettingsPanel';
import FiltersPanel from './filters/FiltersPanel';
import StickersPanel from './stickers/StickersPanel';
import MessagePanel from './messages/MessagePanel';
import Gallery from './gallery/Gallery';
import StartScreen from './StartScreen';

type PhotoBoothTab = 'start' | 'camera' | 'settings' | 'gallery' | 'filters' | 'stickers' | 'messages';
type CollageLayout = 'single' | 'vertical-2' | 'vertical-3';

const PhotoBooth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PhotoBoothTab>('start');
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string>('none');
  const [stickers, setStickers] = useState<Array<{ id: string; src: string; x: number; y: number }>>([]);
  const [messages, setMessages] = useState<Array<{ id: string; text: string; x: number; y: number; color: string; fontSize: number }>>([]);
  const [collageLayout, setCollageLayout] = useState<CollageLayout>('single');
  const [cameraSettings, setCameraSettings] = useState({
    resolution: 'hd',
    timer: 3,
    flash: false,
    gridLines: false,
    facingMode: 'user'
  });

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCapture = (imageSrc: string) => {
    setCapturedImages(prev => [...prev, imageSrc]);
  };

  const handleStartClick = () => {
    setActiveTab('camera');
  };

  const handleSwitchCamera = () => {
    setCameraSettings(prev => ({
      ...prev,
      facingMode: prev.facingMode === 'user' ? 'environment' : 'user'
    }));
  };

  const renderContent = () => {
    const content = (() => {
      switch (activeTab) {
        case 'start':
          return <StartScreen onStart={handleStartClick} />;
        case 'camera':
          return (
            <div className="relative h-full">
              <CameraView
                onCapture={handleCapture}
                currentFilter={currentFilter}
                stickers={stickers}
                messages={messages}
                cameraSettings={cameraSettings}
                canvasRef={canvasRef}
                mediaStreamRef={mediaStreamRef}
                collageLayout={collageLayout}
              />
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-4 right-4 z-10"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSwitchCamera}
                  className="bg-gray-800/50 hover:bg-gray-700/50 text-white p-3 rounded-full backdrop-blur-sm"
                  title="Switch Camera"
                >
                  <FlipHorizontal size={24} />
                </motion.button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 z-10"
              >
                <select
                  value={collageLayout}
                  onChange={(e) => setCollageLayout(e.target.value as CollageLayout)}
                  className="bg-gray-800/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-200 hover:bg-gray-700/50"
                >
                  <option value="single">Single Photo</option>
                  <option value="vertical-2">Vertical (2 Photos)</option>
                  <option value="vertical-3">Vertical (3 Photos)</option>
                </select>
              </motion.div>
            </div>
          );
        case 'settings':
          return <SettingsPanel settings={cameraSettings} onUpdateSettings={setCameraSettings} />;
        case 'gallery':
          return <Gallery images={capturedImages} />;
        case 'filters':
          return <FiltersPanel currentFilter={currentFilter} onFilterChange={setCurrentFilter} />;
        case 'stickers':
          return <StickersPanel stickers={stickers} setStickers={setStickers} />;
        case 'messages':
          return <MessagePanel messages={messages} setMessages={setMessages} />;
        default:
          return null;
      }
    })();

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  };

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow relative overflow-hidden">
        {renderContent()}
      </main>

      {activeTab !== 'start' && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="bg-gray-800 p-4 flex justify-center items-center"
        >
          <div className="flex space-x-6 sm:space-x-8 md:space-x-12">
            <NavButton
              icon={<Home size={24} />}
              label="Start"
              active={activeTab === 'start'}
              onClick={() => setActiveTab('start')}
            />
            <NavButton
              icon={<Camera size={24} />}
              label="Capture"
              active={activeTab === 'camera'}
              onClick={() => setActiveTab('camera')}
            />
            <NavButton
              icon={<Settings size={24} />}
              label="Settings"
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
            <NavButton
              icon={<Brush size={24} />}
              label="Filters"
              active={activeTab === 'filters'}
              onClick={() => setActiveTab('filters')}
            />
            <NavButton
              icon={<Sticker size={24} />}
              label="Stickers"
              active={activeTab === 'stickers'}
              onClick={() => setActiveTab('stickers')}
            />
            <NavButton
              icon={<MessageSquare size={24} />}
              label="Messages"
              active={activeTab === 'messages'}
              onClick={() => setActiveTab('messages')}
            />
            <NavButton
              icon={<ImageIcon size={24} />}
              label="Gallery"
              active={activeTab === 'gallery'}
              onClick={() => setActiveTab('gallery')}
            />
          </div>
        </motion.nav>
      )}
    </div>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`flex flex-col items-center transition-all duration-200 ${active ? 'text-blue-400 scale-110' : 'text-gray-400 hover:text-white'
        }`}
      onClick={onClick}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </motion.button>
  );
};

export default PhotoBooth;