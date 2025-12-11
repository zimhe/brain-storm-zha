import React, { useState } from 'react';
import { Search, Brain } from 'lucide-react';

interface HomePageProps {
  onSessionIdSubmit: (sessionId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSessionIdSubmit }) => {
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId.trim()) {
      setIsLoading(true);
      onSessionIdSubmit(sessionId.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 pt-32 pb-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo and Title */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <Brain className="w-16 h-16 text-white opacity-80" />
          </div>
          <div>
            <h2 className="text-xs tracking-[0.3em] text-gray-400 font-mono mb-2">
              Zaha Hadid Architects
            </h2>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Brainstorming
            </h1>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            Enter your session ID to view the generated image stream from your creative process.
          </p>
          <div className="flex items-center justify-center space-x-2 opacity-60">
            <div className="h-px w-12 bg-white/20"></div>
            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
            <div className="h-px w-12 bg-white/20"></div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Enter Session ID"
              className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-300 text-center tracking-wider"
              disabled={isLoading}
            />
            {sessionId && (
              <div className="absolute inset-y-0 right-4 flex items-center">
                <Search className="w-4 h-4 text-white/60" />
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!sessionId.trim() || isLoading}
            className="w-full px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 rounded-lg text-white font-medium tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/10"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            ) : (
              'View Session'
            )}
          </button>
        </form>

        {/* Project Description */}
        <div className="space-y-6 pt-8 border-t border-white/10">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/90 tracking-wider uppercase">About the Project</h3>
            
            {/* Chinese Description */}
            <div className="space-y-3 text-left">
              <p className="text-xs text-gray-300 leading-relaxed">
                头脑风暴（Brainstorming）是一件互动装置艺术作品，该作品将强脑科技（BrainCo）的先进神经科技与扎哈·哈迪德建筑事务所（ZHA）的前沿设计能力相结合，通过参观者的脑电波模式生成个性化的建筑视觉体验。
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                该装置运用了强脑科技的OxyZen仰憩智能头戴设备的脑电波（EEG）技术，以实时记录参与者的数据，包括脑电波、心率、专注度以及血氧水平。采集到的数据通过蓝牙无线传输至专门开发的应用程序，并在Unity游戏引擎中进行实时可视化处理。每位参与者的数据都会被映射到展示环境中，驱动生成空间的动态表现。装置最多可同时连接三位参与者，环境的背景还会根据他们的平均数据作出响应。
              </p>
            </div>

            {/* Separator */}
            <div className="flex items-center justify-center space-x-2 py-2">
              <div className="h-px w-8 bg-white/20"></div>
              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
              <div className="h-px w-8 bg-white/20"></div>
            </div>

            {/* English Description */}
            <div className="space-y-3 text-left">
              <p className="text-xs text-gray-300 leading-relaxed">
                Brainstorming is an interactive installation merging BrainCo's advanced neurotechnology with Zaha Hadid Architects (ZHA) pioneering design capabilities to create personalised architectural-visual experiences from visitors' brainwave patterns.
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                The installation uses BrainCo's OxyZen EEG headband technology to record participants' real-time data, including EEG (Electroencephalogram) signals, heart rates, attention rates, and blood oxygen levels. The collected data is then wirelessly transmitted to a custom-made application through Bluetooth connection and processed in the Unity Game Engine for real-time visualisation. Each participant's data is mapped into the environment and drives the behaviour of generated space. With up to three participants connecting at the same time, the environment's background also responds to the averaged data of the group.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="space-y-2 pt-6">
          <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">
            Neural Network Visualization System
          </p>
          <div className="flex items-center justify-center space-x-1 opacity-40">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;