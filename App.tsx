import React, { useEffect, useState } from 'react';
import ParticleBackground from './components/ParticleBackground';
import Header from './components/Header';
import ImageViewer from './components/ImageViewer';
import StreamItem from './components/StreamItem';
import { fetchProcessData, getGuidFromUrl } from './services/dataService';
import { ProcessData, ProcessImage } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProcessData | null>(null);
  const [selectedImage, setSelectedImage] = useState<ProcessImage | null>(null);

  useEffect(() => {
    const init = async () => {
      const guid = getGuidFromUrl();
      const processData = await fetchProcessData(guid);
      setData(processData);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <div className="min-h-screen relative text-white">
      {/* Background Layer */}
      <ParticleBackground />

      {/* Header Layer */}
      <Header guid={data?.guid} />

      {/* Main Content Area */}
      <main className="relative pt-32 pb-20 px-4 md:px-0 max-w-5xl mx-auto min-h-screen">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <Loader2 className="animate-spin text-white mb-4" size={32} />
            <p className="text-xs font-mono tracking-widest uppercase animate-pulse">Initializing Neural Link...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center relative z-10">
            {data?.images.map((image, index) => (
              <StreamItem 
                key={image.id} 
                image={image} 
                index={index} 
                onClick={setSelectedImage} 
              />
            ))}
            
            {/* End of Stream Indicator */}
            <div className="mt-12 flex flex-col items-center opacity-50 animate-fade-in">
              <div className="w-2 h-2 bg-white rounded-full mb-2"></div>
              <p className="text-[10px] font-brand tracking-widest">SESSION END</p>
            </div>
          </div>
        )}
      </main>

      {/* Modal Layer */}
      <ImageViewer 
        image={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />

      {/* CSS for custom keyframe animations */}
      <style>{`
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation-name: slide-up;
          animation-duration: 0.8s;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default App;
