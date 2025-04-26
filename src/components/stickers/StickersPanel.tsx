import React from 'react';
import { Sticker, Plus } from 'lucide-react';

interface StickersPanelProps {
  stickers: Array<{ id: string; src: string; x: number; y: number }>;
  setStickers: React.Dispatch<React.SetStateAction<Array<{ id: string; src: string; x: number; y: number }>>>;
}

const StickersPanel: React.FC<StickersPanelProps> = ({ stickers, setStickers }) => {
  const stickerOptions = [
    { id: 'emoji-1', src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f600.png', name: 'Grinning Face' },
    { id: 'emoji-2', src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f60d.png', name: 'Heart Eyes' },
    { id: 'emoji-3', src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f525.png', name: 'Fire' },
    { id: 'emoji-4', src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f389.png', name: 'Party Popper' },
    { id: 'emoji-5', src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f44d.png', name: 'Thumbs Up' },
    { id: 'emoji-6', src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f480.png', name: 'Skull' },
    { id: 'emoji-7', src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4a5.png', name: 'Collision' },
    { id: 'emoji-8', src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f984.png', name: 'Unicorn' },
    { id: 'emoji-9', src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3a5.png', name: 'Movie Camera' },
    { id: 'emoji-10', src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f680.png', name: 'Rocket' },
    { id: 'emoji-11', src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f308.png', name: 'Rainbow' },
    { id: 'emoji-12', src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f451.png', name: 'Crown' },
  ];
  
  const handleAddSticker = (sticker: { id: string; src: string }) => {
    const newSticker = {
      id: `${sticker.id}-${Date.now()}`,
      src: sticker.src,
      x: 50, // center position (percentage)
      y: 50, // center position (percentage)
    };
    
    setStickers(prev => [...prev, newSticker]);
  };
  
  const handleRemoveSticker = (id: string) => {
    setStickers(prev => prev.filter(sticker => sticker.id !== id));
  };
  
  return (
    <div className="h-full bg-gray-800 p-6 overflow-y-auto">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-8">
          <Sticker size={24} className="text-blue-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Stickers</h2>
        </div>
        
        {stickers.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-4">Applied Stickers</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {stickers.map(sticker => (
                <div key={sticker.id} className="relative group">
                  <img 
                    src={sticker.src} 
                    alt="Sticker" 
                    className="w-12 h-12 object-contain bg-gray-700 rounded-lg p-2" 
                  />
                  <button 
                    onClick={() => handleRemoveSticker(sticker.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Available Stickers</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
            {stickerOptions.map(sticker => (
              <div 
                key={sticker.id}
                onClick={() => handleAddSticker(sticker)}
                className="bg-gray-700 rounded-lg p-3 flex flex-col items-center cursor-pointer hover:bg-gray-600 transition-colors"
              >
                <img 
                  src={sticker.src} 
                  alt={sticker.name} 
                  className="w-12 h-12 object-contain"
                />
                <div className="mt-2 flex items-center text-xs text-white">
                  <Plus size={12} className="mr-1" />
                  <span>Add</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-700 rounded-lg text-sm text-gray-300">
          <p>Drag and position stickers on the preview screen after adding them.</p>
        </div>
      </div>
    </div>
  );
};

export default StickersPanel;