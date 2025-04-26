import React, { useState } from 'react';
import { Download, Trash2, Image, Eye, Grid, Layout } from 'lucide-react';
import { motion } from 'framer-motion';

const Gallery = ({ images, setImages }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [collageTemplate, setCollageTemplate] = useState('2x2');
  
  const templates = [
    { id: '1x2', name: '1×2 Grid', cols: 1, rows: 2 },
    { id: '2x2', name: '2×2 Grid', cols: 2, rows: 2 },
    { id: '3x3', name: '3×3 Grid', cols: 3, rows: 3 },
    { id: 'vertical', name: 'Vertical Strip', cols: 1, rows: 3 },
    { id: 'horizontal', name: 'Horizontal Strip', cols: 3, rows: 1 },
  ];
  
  const handleImageClick = (imageSrc) => {
    if (selectedImages.includes(imageSrc)) {
      setSelectedImages(prev => prev.filter(img => img !== imageSrc));
    } else {
      setSelectedImages(prev => [...prev, imageSrc]);
    }
  };
  
  const handleCloseModal = () => {
    setSelectedImage(null);
  };
  
  const handleDownload = (imageSrc) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `photobooth-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (imageToDelete) => {
    const updatedImages = images.filter(img => img !== imageToDelete);
    setImages(updatedImages);
    if (selectedImage === imageToDelete) {
      setSelectedImage(null);
    }
    setSelectedImages(prev => prev.filter(img => img !== imageToDelete));
  };
  
  const createCollage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const template = templates.find(t => t.id === collageTemplate);
    
    if (!template) return;
    
    const imageSize = 400;
    canvas.width = imageSize * template.cols;
    canvas.height = imageSize * template.rows;
    
    // Fill background
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Load and draw images
    const promises = selectedImages.slice(0, template.cols * template.rows).map((src, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const row = Math.floor(index / template.cols);
          const col = index % template.cols;
          const x = col * imageSize;
          const y = row * imageSize;
          
          // Calculate scaling to maintain aspect ratio
          const scale = Math.min(imageSize / img.width, imageSize / img.height);
          const width = img.width * scale;
          const height = img.height * scale;
          
          // Center image in its cell
          const xOffset = x + (imageSize - width) / 2;
          const yOffset = y + (imageSize - height) / 2;
          
          ctx.drawImage(img, xOffset, yOffset, width, height);
          resolve();
        };
        img.src = src;
      });
    });
    
    Promise.all(promises).then(() => {
      const collageImage = canvas.toDataURL('image/png');
      handleDownload(collageImage);
    });
  };
  
  return (
    <div className="h-full bg-gray-800 p-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Image size={24} className="text-blue-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Photo Gallery</h2>
          </div>
          
          {selectedImages.length > 0 && (
            <div className="flex items-center space-x-4">
              <select
                value={collageTemplate}
                onChange={(e) => setCollageTemplate(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <button
                onClick={createCollage}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Layout size={16} className="mr-2" />
                Create Collage
              </button>
            </div>
          )}
        </div>
        
        {images.length === 0 ? (
          <div className="bg-gray-700 rounded-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-600 rounded-full flex items-center justify-center mb-4">
              <Image className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Belum ada foto</h3>
            <p className="text-gray-400">
            Abadikan beberapa momen indah untuk melihatnya di sini!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`bg-gray-700 rounded-lg overflow-hidden group relative ${
                  selectedImages.includes(image) ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <img 
                  src={image} 
                  alt={`Captured image ${index + 1}`} 
                  className="w-full aspect-square object-cover cursor-pointer"
                  onClick={() => handleImageClick(image)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setSelectedImage(image)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                      aria-label="View photo"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => handleDownload(image)}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
                      aria-label="Download photo"
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(image)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                      aria-label="Delete photo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full bg-gray-800 rounded-lg overflow-hidden relative">
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white p-1 rounded-full bg-gray-700 hover:bg-gray-600 z-10"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="p-4">
              <img 
                src={selectedImage} 
                alt="Selected photo" 
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
            
            <div className="bg-gray-900 p-4 flex justify-end space-x-4">
              <button 
                onClick={() => handleDownload(selectedImage)}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center"
              >
                <Download size={16} className="mr-2" />
                Download
              </button>
              <button 
                onClick={() => handleDelete(selectedImage)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;