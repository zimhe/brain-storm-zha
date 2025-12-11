import React, { useEffect, useState } from 'react';
import ParticleBackground from './components/ParticleBackground';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ImageViewer from './components/ImageViewer';
import StreamItem from './components/StreamItem';
import { fetchProcessData, getGuidFromUrl } from './services/dataService';
import { ProcessData, ProcessImage } from './types';
import { Loader2 } from 'lucide-react';

type AppState = 'loading' | 'home' | 'session' | 'error';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [data, setData] = useState<ProcessData | null>(null);
  const [selectedImage, setSelectedImage] = useState<ProcessImage | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      // 检查URL中是否有session ID
      const urlGuid = getGuidFromUrl();
      
      if (urlGuid) {
        // URL中有session ID，尝试获取数据
        await loadSessionData(urlGuid);
      } else {
        // 没有session ID，显示主页
        setAppState('home');
      }
    };
    init();
  }, []);

  const loadSessionData = async (sessionId: string) => {
    setAppState('loading');
    setCurrentSessionId(sessionId);
    
    try {
      const processData = await fetchProcessData(sessionId);
      
      if (processData) {
        // 找到数据，显示图片流
        setData(processData);
        setAppState('session');
        
        // 更新URL但不刷新页面
        const newUrl = `${window.location.origin}${window.location.pathname}?id=${sessionId}`;
        window.history.pushState({}, '', newUrl);
      } else {
        // 没有找到数据，返回主页
        console.warn(`Session ${sessionId} 没有找到图片数据`);
        setAppState('home');
        
        // 清除URL参数
        window.history.pushState({}, '', `${window.location.origin}${window.location.pathname}`);
      }
    } catch (error) {
      console.error('加载session数据时出错:', error);
      setAppState('error');
    }
  };

  const handleSessionIdSubmit = (sessionId: string) => {
    loadSessionData(sessionId);
  };

  const handleBackToHome = () => {
    setAppState('home');
    setData(null);
    setCurrentSessionId('');
    window.history.pushState({}, '', `${window.location.origin}${window.location.pathname}`);
  };

  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return (
          <main className="relative pt-40 pb-20 px-4 md:px-0 max-w-5xl mx-auto min-h-screen">
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <Loader2 className="animate-spin text-white mb-4" size={32} />
              <p className="text-xs font-mono tracking-widest uppercase animate-pulse">
                {currentSessionId ? 'Loading Session...' : 'Initializing Neural Link...'}
              </p>
            </div>
          </main>
        );

      case 'home':
        return (
          <main className="relative min-h-screen">
            <HomePage onSessionIdSubmit={handleSessionIdSubmit} />
          </main>
        );

      case 'session':
        return (
          <main className="relative pt-40 pb-20 px-4 md:px-0 max-w-5xl mx-auto min-h-screen">
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
              
              {/* Back to Home Button */}
              <button
                onClick={handleBackToHome}
                className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-lg text-white/70 hover:text-white text-sm font-mono tracking-wider transition-all duration-300"
              >
                ← Back to Home
              </button>
            </div>
          </main>
        );

      case 'error':
        return (
          <main className="relative pt-32 pb-20 px-4 md:px-0 max-w-5xl mx-auto min-h-screen">
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
              <p className="text-red-400 text-sm">Error loading session data</p>
              <button
                onClick={handleBackToHome}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-lg text-white/70 hover:text-white text-sm font-mono tracking-wider transition-all duration-300"
              >
                ← Back to Home
              </button>
            </div>
          </main>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative text-white">
      {/* Background Layer */}
      <ParticleBackground />

      {/* Header Layer */}
      <Header 
        guid={data?.guid} 
        showShareButton={appState === 'session' && !!data}
        onBackToHome={handleBackToHome}
      />

      {/* Main Content */}
      {renderContent()}

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
