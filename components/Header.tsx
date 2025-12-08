import React from 'react';

interface HeaderProps {
  guid?: string;
}

const Header: React.FC<HeaderProps> = ({ guid }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-xs tracking-[0.3em] text-gray-400 font-brand mb-2">
          Zaha Hadid Architects
        </h2>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Brain Storm
        </h1>
        {guid && (
          <div className="mt-4 flex items-center space-x-2">
            <div className="h-px w-8 bg-white/20"></div>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
              SESSION ID: <span className="text-white/70">{guid.slice(0, 8)}...</span>
            </p>
            <div className="h-px w-8 bg-white/20"></div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
