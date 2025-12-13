import React, { useEffect } from 'react';
import { ProcessImage } from '../types';
import { X, Download, Maximize2 } from 'lucide-react';

interface ImageViewerProps {
  image: ProcessImage | null;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ image, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleDownload = async () => {
    if (!image) return;

    try {
      // 检测是否是移动设备
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // 移动端：在新窗口打开图片，用户可以长按保存到相册
        window.open(image.url, '_blank');
        return;
      }
      
      // 桌面端：下载图片文件
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `brainstorm-${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download failed:', error);
      // 回退方案：直接使用图片URL
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `brainstorm-${image.id}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Controls */}
      <div className="absolute top-6 right-6 flex items-center space-x-4">
        <button
          onClick={handleDownload}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-md border border-white/10 group"
          title="Download High Res"
        >
          <Download size={20} className="group-hover:scale-110 transition-transform" />
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
