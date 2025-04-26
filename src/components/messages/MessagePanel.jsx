import React, { useState } from 'react';
import { MessageSquare, Plus, Type, PaintBucket, MoveHorizontal } from 'lucide-react';

const MessagePanel = ({ messages, setMessages }) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(24);
  
  const colors = [
    '#ffffff', // white
    '#f87171', // red
    '#fb923c', // orange
    '#facc15', // yellow
    '#4ade80', // green
    '#38bdf8', // blue
    '#a78bfa', // purple
    '#f9a8d4', // pink
  ];
  
  const fontSizes = [
    { value: 16, label: 'S' },
    { value: 24, label: 'M' },
    { value: 32, label: 'L' },
    { value: 40, label: 'XL' },
  ];
  
  const handleAddMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMessageObj = {
      id: `message-${Date.now()}`,
      text: newMessage,
      x: 50,
      y: 50,
      color: selectedColor,
      fontSize,
    };
    
    setMessages(prev => [...prev, newMessageObj]);
    setNewMessage('');
  };
  
  const handleRemoveMessage = (id) => {
    setMessages(prev => prev.filter(message => message.id !== id));
  };
  
  return (
    <div className="h-full bg-gray-800 p-6 overflow-y-auto">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-8">
          <MessageSquare size={24} className="text-blue-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Add Text</h2>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Type size={14} className="inline mr-1" /> Message Text
            </label>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter your message..."
              className="w-full bg-gray-600 text-white border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px] resize-y"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <PaintBucket size={14} className="inline mr-1" /> Text Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full ${
                    selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-gray-700 ring-white' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Type size={14} className="inline mr-1" /> Font Size
            </label>
            <div className="flex gap-2">
              {fontSizes.map(size => (
                <button
                  key={size.value}
                  onClick={() => setFontSize(size.value)}
                  className={`flex-1 py-2 rounded-lg text-center ${
                    fontSize === size.value 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleAddMessage}
            disabled={!newMessage.trim()}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center ${
              !newMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Plus size={18} className="mr-2" />
            Add Message
          </button>
        </div>
        
        {messages.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Current Messages</h3>
            <div className="space-y-3">
              {messages.map(message => (
                <div 
                  key={message.id}
                  className="bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-grow mr-4">
                      <div className="flex items-center mb-2">
                        <div 
                          className="w-4 h-4 rounded-full mr-2" 
                          style={{ backgroundColor: message.color }}
                        />
                        <div className="text-xs text-gray-400 flex items-center">
                          <MoveHorizontal size={10} className="mr-1" />
                          <span>Position: {message.x.toFixed(0)}%, {message.y.toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded p-3">
                        <p 
                          className="text-white whitespace-pre-wrap break-words" 
                          style={{ fontSize: `${message.fontSize / 16}rem` }}
                        >
                          {message.text}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveMessage(message.id)}
                      className="text-gray-400 hover:text-red-500 flex-shrink-0"
                    >
                      <span className="sr-only">Remove</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="mt-4 text-sm text-gray-400">
              Drag and position text messages on the preview screen after adding them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePanel;