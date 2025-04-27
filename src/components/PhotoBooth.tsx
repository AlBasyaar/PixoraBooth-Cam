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
  const contentRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

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

  // Reset scroll position when changing tabs
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    
    // Scroll active tab into view when tab changes
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTab]);

  // Cleanup media streams when component unmounts
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
                  className="bg-gray-800/50 hover:bg-gray-700/50 text-white p-2 sm:p-3 rounded-full backdrop-blur-sm"
                  title="Switch Camera"
                >
                  <FlipHorizontal size={20} className="sm:hidden" />
                  <FlipHorizontal size={24} className="hidden sm:block" />
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
                  className="bg-gray-800/50 text-white text-sm sm:text-base px-2 py-1 sm:px-4 sm:py-2 rounded-lg backdrop-blur-sm transition-all duration-200 hover:bg-gray-700/50"
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

  return (
    <div className="flex flex-col h-screen">
      <main ref={contentRef} className="flex-grow relative overflow-y-auto">
        {renderContent()}
      </main>

      {activeTab !== 'start' && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="bg-gray-800 shadow-lg border-t border-gray-700"
        >
          {/* Horizontal scrollable navigation with indicator arrows */}
          <div className="relative">
            {/* Scroll indicator - left */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-gray-800 to-transparent z-10 pointer-events-none" />
            
            {/* Navigation container - horizontally scrollable */}
            <div className="flex overflow-x-auto py-3 px-4 hide-scrollbar">
              <div className="flex space-x-4 sm:space-x-8 min-w-max mx-auto">
                <NavButton
                  icon={<Home size={18} />}
                  label="Start"
                  active={activeTab === 'start'}
                  onClick={() => setActiveTab('start')}
                  ref={activeTab === 'start' ? activeTabRef : null}
                />
                <NavButton
                  icon={<Camera size={18} />}
                  label="Capture"
                  active={activeTab === 'camera'}
                  onClick={() => setActiveTab('camera')}
                  ref={activeTab === 'camera' ? activeTabRef : null}
                />
                <NavButton
                  icon={<Settings size={18} />}
                  label="Settings"
                  active={activeTab === 'settings'}
                  onClick={() => setActiveTab('settings')}
                  ref={activeTab === 'settings' ? activeTabRef : null}
                />
                <NavButton
                  icon={<Brush size={18} />}
                  label="Filters"
                  active={activeTab === 'filters'}
                  onClick={() => setActiveTab('filters')}
                  ref={activeTab === 'filters' ? activeTabRef : null}
                />
                <NavButton
                  icon={<Sticker size={18} />}
                  label="Stickers"
                  active={activeTab === 'stickers'}
                  onClick={() => setActiveTab('stickers')}
                  ref={activeTab === 'stickers' ? activeTabRef : null}
                />
                <NavButton
                  icon={<MessageSquare size={18} />}
                  label="Messages"
                  active={activeTab === 'messages'}
                  onClick={() => setActiveTab('messages')}
                  ref={activeTab === 'messages' ? activeTabRef : null}
                />
                <NavButton
                  icon={<ImageIcon size={18} />}
                  label="Gallery"
                  active={activeTab === 'gallery'}
                  onClick={() => setActiveTab('gallery')}
                  ref={activeTab === 'gallery' ? activeTabRef : null}
                />
              </div>
            </div>
            
            {/* Scroll indicator - right */}
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-gray-800 to-transparent z-10 pointer-events-none" />
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
  ref?: React.RefObject<HTMLButtonElement> | null;
}

const NavButton = React.forwardRef<HTMLButtonElement, Omit<NavButtonProps, 'ref'>>(
  ({ icon, label, active, onClick }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`flex flex-col items-center justify-center w-16 sm:w-20 transition-all duration-200 ${
          active ? 'text-blue-400' : 'text-gray-400 hover:text-white'
        }`}
        onClick={onClick}
      >
        <div className="p-2 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs font-medium truncate w-full text-center">{label}</span>
      </motion.button>
    );
  }
);

export default PhotoBooth;