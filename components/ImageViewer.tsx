import React, { useEffect, useState } from 'react';
import { ProcessImage } from '../types';
import { X, Download, Maximize2, Share2 } from 'lucide-react';

interface ImageViewerProps {
  image: ProcessImage | null;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ image, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 检测是否是移动设备
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleDownload = async () => {
    if (!image) return;

    // 移动端优先尝试使用 Web Share API
    if (isMobile && navigator.share) {
      try {
        // 获取图片作为 Blob
        const response = await fetch(image.url);
        const blob = await response.blob();
        const file = new File([blob], `brainstorm-${image.id}.jpg`, { type: 'image/jpeg' });
        
        // 使用 Web Share API 分享
        await navigator.share({
          files: [file],
          title: 'Brainstorming Image',
          text: image.description || 'Generated image from Brainstorming'
        });
      } catch (error) {
        console.log('Share failed or was cancelled:', error);
        // 如果分享失败，回退到传统下载方式
        downloadImage();
      }
    } else {
      // 桌面端或不支持 Web Share API 的移动端，使用传统下载
      downloadImage();
    }
  };

  const downloadImage = () => {
    if (!image) return;
    
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `brainstorm-${image.id}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link)
  };

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Controls */}
      <div className="absolute top-6 right-6 flex items-center space-x-4">
        <button
          onClick={handleDownload}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-md border border-white/10 group"
          title={isMobile ? "Share/Save Image" : "Download High Res"}
        >
          {isMobile ? (
            <Share2 size={20} className="group-hover:scale-110 transition-transform" />
          ) : (
            <Download size={20} className="group-hover:scale-110 transition-transform" />
          )}
        </button>
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-md border border-white/10 group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform" />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="w-full h-full p-4 md:p-12 flex flex-col items-center justify-center">
        <div className="relative max-w-full max-h-[85vh] group">
          <img
            src={image.url}
            alt={image.description}
            className="max-w-full max-h-[80vh] object-contain shadow-[0_0_50px_rgba(255,255,255,0.1)] rounded-sm"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <p className="text-white/60 text-xs font-mono mb-1">{image.timestamp}</p>
            <p className="text-white font-medium tracking-wide">{image.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
