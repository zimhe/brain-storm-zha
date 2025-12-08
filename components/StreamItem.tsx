import React, { useState } from 'react';
import { ProcessImage } from '../types';
import { Plus } from 'lucide-react';

interface StreamItemProps {
  image: ProcessImage;
  index: number;
  onClick: (img: ProcessImage) => void;
}

const StreamItem: React.FC<StreamItemProps> = ({ image, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group w-full mb-12 md:mb-24 flex flex-col items-center opacity-0 animate-slide-up"
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connector Line (The Stream) */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-white/0 via-white/20 to-white/0 -translate-x-1/2 -z-10 h-[120%]"></div>

      {/* Timestamp Marker */}
      <div className="mb-4 px-3 py-1 bg-black border border-white/20 rounded-full">
        <span className="text-[10px] text-white/60 font-mono tracking-widest">{image.timestamp}</span>
      </div>

      {/* Image Card */}
      <div
        onClick={() => onClick(image)}
        className="relative cursor-pointer w-full max-w-md md:max-w-2xl bg-gray-900/40 backdrop-blur-sm border border-white/10 hover:border-white/40 transition-all duration-500 ease-out transform hover:scale-[1.02] overflow-hidden rounded-sm"
      >
        <div className="relative aspect-video w-full overflow-hidden">
           {/* Image */}
          <img
            src={image.thumbnail}
            alt={image.description}
            className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${isHovered ? 'scale-110 grayscale-0' : 'scale-100 grayscale-[30%]'}`}
            loading="lazy"
          />
          
          {/* Overlay on Hover */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
                <Plus className="text-white" />
            </div>
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="p-4 border-t border-white/5 flex justify-between items-center">
            <h3 className="text-sm text-white/90 font-light tracking-wide">{image.description}</h3>
            <span className="text-xs text-white/30 font-mono">#{image.id.split('-')[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default StreamItem;
