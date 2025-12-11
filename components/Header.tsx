import React, { useState } from 'react';
import { Copy, Check, Share2, Home, Hash } from 'lucide-react';

interface HeaderProps {
  guid?: string;
  showShareButton?: boolean;
  onBackToHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ guid, showShareButton = false, onBackToHome }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSessionId, setCopiedSessionId] = useState(false);

  const handleCopyLink = async () => {
    try {
      const currentUrl = window.location.origin + window.location.pathname + `?id=${guid}`;
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = window.location.origin + window.location.pathname + `?id=${guid}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopySessionId = async () => {
    if (!guid) return;
    
    try {
      await navigator.clipboard.writeText(guid);
      setCopiedSessionId(true);
      setTimeout(() => setCopiedSessionId(false), 2000);
    } catch (error) {
      console.error('Failed to copy session ID:', error);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = guid;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedSessionId(true);
      setTimeout(() => setCopiedSessionId(false), 2000);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-xs tracking-[0.3em] text-gray-400 font-medium mb-2" style={{ fontFamily: 'Noto Sans, sans-serif' }}>
          Zaha Hadid Architects
        </h2>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Brainstorming
        </h1>
        {guid && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-px w-8 bg-white/20"></div>
              <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
                SESSION ID: <span className="text-white/70">{guid.slice(0, 8)}...</span>
              </p>
              <div className="h-px w-8 bg-white/20"></div>
            </div>
            
            {showShareButton && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  {/* Copy Session ID Button */}
                  <button
                    onClick={handleCopySessionId}
                    className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-lg transition-all duration-300 group"
                  >
                    {copiedSessionId ? (
                      <>
                        <Check className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400 font-mono tracking-wider">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Hash className="w-3 h-3 text-white/70 group-hover:text-white transition-colors" />
                        <span className="text-xs text-white/70 group-hover:text-white font-mono tracking-wider transition-colors">COPY ID</span>
                      </>
                    )}
                  </button>
                  
                  {/* Share Link Button */}
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-lg transition-all duration-300 group"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400 font-mono tracking-wider">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3 h-3 text-white/70 group-hover:text-white transition-colors" />
                        <span className="text-xs text-white/70 group-hover:text-white font-mono tracking-wider transition-colors">SHARE LINK</span>
                      </>
                    )}
                  </button>

                  {/* Back to Home Button */}
                  {onBackToHome && (
                    <button
                      onClick={onBackToHome}
                      className="flex items-center justify-center px-3 py-2 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 rounded-lg transition-all duration-300 group"
                      title="Back to Home"
                    >
                      <Home className="w-3 h-3 text-white/60 group-hover:text-white/80 transition-colors" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
