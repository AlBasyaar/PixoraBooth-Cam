import React, { useEffect, useState, useRef } from 'react';
import { Camera } from 'lucide-react';

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
  currentFilter: string;
  stickers: Array<{ id: string; src: string; x: number; y: number }>;
  messages: Array<{ id: string; text: string; x: number; y: number; color: string; fontSize: number }>;
  cameraSettings: {
    resolution: string;
    timer: number;
    flash: boolean;
    gridLines: boolean;
    facingMode: string;
  };
  canvasRef: React.RefObject<HTMLCanvasElement>;
  mediaStreamRef: React.RefObject<MediaStream>;
  collageLayout: 'single' | 'vertical-2' | 'vertical-3';
}

const CameraView: React.FC<CameraViewProps> = ({
  onCapture,
  currentFilter,
  stickers,
  messages,
  cameraSettings,
  canvasRef,
  mediaStreamRef,
  collageLayout
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [collageImages, setCollageImages] = useState<string[]>([]);
  
  useEffect(() => {
    let mounted = true;
    
    const setupCamera = async () => {
      try {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
        }
        
        const constraints = {
          video: {
            width: cameraSettings.resolution === 'hd' ? 1280 : 640,
            height: cameraSettings.resolution === 'hd' ? 720 : 480,
            facingMode: cameraSettings.facingMode
          },
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (mounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          mediaStreamRef.current = stream;
          setIsCameraReady(true);
          setCameraError(null);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        if (mounted) {
          setCameraError('Could not access camera. Please check permissions.');
          setIsCameraReady(false);
        }
      }
    };
    
    setupCamera();
    
    return () => {
      mounted = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraSettings.resolution, cameraSettings.facingMode, mediaStreamRef]);
  
  const handleCaptureClick = () => {
    if (cameraSettings.timer > 0) {
      startCountdown();
    } else {
      capturePhoto();
    }
  };
  
  const startCountdown = () => {
    setIsCountingDown(true);
    setCountdown(cameraSettings.timer);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCountingDown(false);
          capturePhoto();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions based on collage layout
    if (collageLayout === 'single') {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    } else {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight * (collageLayout === 'vertical-2' ? 2 : 3);
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Add flash effect if enabled
    if (cameraSettings.flash) {
      const flashDiv = document.createElement('div');
      flashDiv.style.position = 'fixed';
      flashDiv.style.top = '0';
      flashDiv.style.left = '0';
      flashDiv.style.width = '100%';
      flashDiv.style.height = '100%';
      flashDiv.style.backgroundColor = 'white';
      flashDiv.style.opacity = '0.8';
      flashDiv.style.zIndex = '9999';
      flashDiv.style.transition = 'opacity 0.5s';
      
      document.body.appendChild(flashDiv);
      
      setTimeout(() => {
        flashDiv.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(flashDiv);
        }, 500);
      }, 50);
    }
    
    // Handle collage capture
    const newImage = document.createElement('canvas');
    newImage.width = video.videoWidth;
    newImage.height = video.videoHeight;
    const newCtx = newImage.getContext('2d');
    if (!newCtx) return;
    
    // Draw current frame
    newCtx.drawImage(video, 0, 0, newImage.width, newImage.height);
    
    // Apply filter
    if (currentFilter !== 'none') {
      applyFilter(newCtx, currentFilter, newImage.width, newImage.height);
    }
    
    // Add to collage images
    const newCollageImages = [...collageImages, newImage.toDataURL('image/png')];
    setCollageImages(newCollageImages);
    
    // If we have enough images for the collage, create and save it
    const requiredImages = collageLayout === 'vertical-2' ? 2 : (collageLayout === 'vertical-3' ? 3 : 1);
    
    if (newCollageImages.length >= requiredImages) {
      // Create final collage
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      newCollageImages.forEach((img, index) => {
        const image = new Image();
        image.onload = () => {
          ctx.drawImage(
            image,
            0,
            index * video.videoHeight,
            video.videoWidth,
            video.videoHeight
          );
          
          // If this is the last image, save the collage
          if (index === newCollageImages.length - 1) {
            // Draw stickers
            stickers.forEach(sticker => {
              const stickerImg = new Image();
              stickerImg.onload = () => {
                const stickerX = (sticker.x / 100) * canvas.width;
                const stickerY = (sticker.y / 100) * canvas.height;
                ctx.drawImage(stickerImg, stickerX, stickerY, 100, 100);
              };
              stickerImg.src = sticker.src;
            });
            
            // Draw messages
            messages.forEach(message => {
              const messageX = (message.x / 100) * canvas.width;
              const messageY = (message.y / 100) * canvas.height;
              
              ctx.font = `${message.fontSize}px Arial`;
              ctx.fillStyle = message.color;
              ctx.fillText(message.text, messageX, messageY);
            });
            
            const finalImage = canvas.toDataURL('image/png');
            onCapture(finalImage);
            setCollageImages([]);
          }
        };
        image.src = img;
      });
    }
  };
  
  const applyFilter = (ctx: CanvasRenderingContext2D, filter: string, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    switch (filter) {
      case 'grayscale':
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }
        break;
      case 'sepia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        break;
      case 'invert':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
        }
        break;
      case 'vintage':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = data[i] * 1.2;
          data[i + 1] = data[i + 1] * 0.9;
          data[i + 2] = data[i + 2] * 0.8;
        }
        break;
    }
    
    ctx.putImageData(imageData, 0, 0);
  };
  
  return (
    <div className="relative h-full flex flex-col items-center justify-center">
      {cameraError ? (
        <div className="text-center p-6">
          <p className="text-red-500 mb-4">{cameraError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="relative max-w-3xl w-full h-auto">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-auto border-4 rounded-lg ${
                currentFilter === 'grayscale' ? 'filter grayscale' :
                currentFilter === 'sepia' ? 'filter sepia' :
                currentFilter === 'invert' ? 'filter invert' :
                currentFilter === 'vintage' ? 'filter brightness-110 contrast-105 saturate-90' :
                ''
              }`}
              style={{ 
                aspectRatio: cameraSettings.resolution === 'hd' ? '16/9' : '4/3',
                transform: cameraSettings.facingMode === 'user' ? 'scaleX(-1)' : 'none',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              }}
            />
            
            {cameraSettings.gridLines && (
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
                <div className="border-r border-b border-white/30"></div>
                <div className="border-r border-l border-b border-white/30"></div>
                <div className="border-l border-b border-white/30"></div>
                <div className="border-r border-t border-b border-white/30"></div>
                <div className="border-r border-l border-t border-b border-white/30"></div>
                <div className="border-l border-t border-b border-white/30"></div>
                <div className="border-r border-t border-white/30"></div>
                <div className="border-r border-l border-t border-white/30"></div>
                <div className="border-l border-t border-white/30"></div>
              </div>
            )}
            
            {isCountingDown && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <div className="text-6xl font-bold text-white animate-pulse">{countdown}</div>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <button 
              onClick={handleCaptureClick}
              disabled={!isCameraReady || isCountingDown}
              className={`bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none transform transition-all duration-200 ${
                isCameraReady && !isCountingDown ? 'hover:scale-105 active:scale-95' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center">
                <Camera size={20} className="mr-2" />
                <span>
                  {collageLayout === 'single' 
                    ? 'Capture Photo' 
                    : `Capture ${collageImages.length + 1} of ${collageLayout === 'vertical-2' ? '2' : '3'}`
                  }
                </span>
              </div>
            </button>
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </div>
  );
};

export default CameraView;