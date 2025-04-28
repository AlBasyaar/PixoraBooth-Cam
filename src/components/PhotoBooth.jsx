import React, { useState, useRef, useEffect } from 'react';
import { Camera, Settings, Image as ImageIcon, Brush, Sticker, MessageSquare, Home, FlipHorizontal, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CameraView from './camera/CameraView';
import SettingsPanel from './settings/SettingsPanel';
import FiltersPanel from './filters/FiltersPanel';
import StickersPanel from './stickers/StickersPanel';
import MessagePanel from './messages/MessagePanel';
import Gallery from './gallery/Gallery';
import StartScreen from './StartScreen';

const PhotoBooth = () => {
  const [activeTab, setActiveTab] = useState('start');
  const [capturedImages, setCapturedImages] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('none');
  const [stickers, setStickers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [collageLayout, setCollageLayout] = useState('single');
  const [cameraSettings, setCameraSettings] = useState({
    resolution: 'hd',
    timer: 3,
    flash: false,
    gridLines: false,
    facingMode: 'user'
  });
  
  const mediaStreamRef = useRef(null);
  const canvasRef = useRef(null);
  
  const handleCapture = (imageSrc) => {
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
                  onChange={(e) => setCollageLayout(e.target.value)}
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
          return <Gallery images={capturedImages} setImages={setCapturedImages} />;
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
          className="bg-gray-800 p-4"
        >
          <div className="flex justify-center items-center space-x-6 sm:space-x-8 md:space-x-12 mb-4">
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
              label="Pengaturan" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
            <NavButton 
              icon={<Brush size={24} />} 
              label="Filter" 
              active={activeTab === 'filters'} 
              onClick={() => setActiveTab('filters')} 
            />
            <NavButton 
              icon={<Sticker size={24} />} 
              label="Sticker" 
              active={activeTab === 'stickers'} 
              onClick={() => setActiveTab('stickers')} 
            />
            <NavButton 
              icon={<MessageSquare size={24} />} 
              label="Message" 
              active={activeTab === 'messages'} 
              onClick={() => setActiveTab('messages')} 
            />
            <NavButton 
              icon={<ImageIcon size={24} />} 
              label="Galleri" 
              active={activeTab === 'gallery'} 
              onClick={() => setActiveTab('gallery')} 
            />
          </div>
          
          <div className="flex justify-center items-center text-gray-400 text-sm border-t border-gray-700 pt-4">
            <a 
              href="https://github.com/AlBasyaar/PixoraBooth-Cam" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-white transition-colors"
            >
              <Github size={16} className="mr-2" />
              Made by Basyar
            </a>
          </div>
        </motion.nav>
      )}
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }) => {
  return (
    <motion.button 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`flex flex-col items-center transition-all duration-200 ${
        active ? 'text-blue-400 scale-110' : 'text-gray-400 hover:text-white'
      }`}
      onClick={onClick}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </motion.button>
  );
};

export default PhotoBooth;