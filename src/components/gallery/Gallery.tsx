import React, { useState } from 'react';
import { Download, Trash2, Image, Eye } from 'lucide-react';

interface GalleryProps {
  images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };
  
  const handleCloseModal = () => {
    setSelectedImage(null);
  };
  
  const handleDownload = (imageSrc: string) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `photobooth-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="h-full bg-gray-800 p-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <Image size={24} className="text-blue-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Photo Gallery</h2>
        </div>
        
        {images.length === 0 ? (
          <div className="bg-gray-700 rounded-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-600 rounded-full flex items-center justify-center mb-4">
              <Image className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No photos yet</h3>
            <p className="text-gray-400">
              Capture some beautiful moments to see them here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="bg-gray-700 rounded-lg overflow-hidden group relative">
                <img 
                  src={image} 
                  alt={`Captured image ${index + 1}`} 
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleImageClick(image)}
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal for viewing selected image */}
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
            
            <div className="bg-gray-900 p-4 flex justify-end">
              <button 
                onClick={() => handleDownload(selectedImage)}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center"
              >
                <Download size={16} className="mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;