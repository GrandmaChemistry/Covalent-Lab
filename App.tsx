
import React, { useState, useEffect } from 'react';
import { BondType } from './types';
import { ORBITAL_DATA } from './constants';
import OrbitalVisualizer from './components/OrbitalVisualizer';

const App: React.FC = () => {
  const [selectedBond, setSelectedBond] = useState<BondType>(BondType.SS_SIGMA);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(0.005);

  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      if (isPlaying) {
        setProgress(prev => {
          if (prev >= 1) return 0; 
          return Math.min(1, prev + speed);
        });
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, speed]);

  const handleManualProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    setIsPlaying(false); 
  };

  const currentInfo = ORBITAL_DATA.find(d => d.id === selectedBond);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-lg shadow-lg shadow-cyan-500/20 flex items-center justify-center font-bold text-white italic">
              C
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              共价键实验室<span className="text-cyan-400">.io</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">轨道重叠可视化</span>
          </nav>
          <div className="flex items-center gap-3">
            <button className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-4 py-2 rounded-full transition-all shadow-lg shadow-cyan-500/20">
              保存学习进度
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 左侧控制栏 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">选择键类型 (Bond Type)</h2>
            <div className="grid grid-cols-1 gap-2">
              {ORBITAL_DATA.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedBond(item.id);
                    setProgress(0);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                    selectedBond === item.id 
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-100 shadow-inner' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  {item.id}
                </button>
              ))}
            </div>
          </div>

          {/* 速度调节 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">播放速度调节</h2>
            <div className="space-y-4 px-2">
              <input 
                type="range" 
                min="0.001" 
                max="0.02" 
                step="0.001"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 uppercase font-mono">
                <span>慢速</span>
                <span>标准</span>
                <span>快速</span>
              </div>
            </div>
          </div>

          {currentInfo && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4 border-l-4 border-l-cyan-500 animate-in fade-in slide-in-from-left-4 duration-500">
              <span className="inline-block px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                {currentInfo.energyLevel}
              </span>
              <h3 className="text-xl font-bold">{currentInfo.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {currentInfo.description}
              </p>
            </div>
          )}
        </div>

        {/* 右侧展示区 */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">轨道重叠可视化演示</h2>
              <p className="text-slate-400 text-sm">观察电子云密度的变化与动态成键过程</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-lg"
                title={isPlaying ? "暂停" : "播放"}
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                )}
              </button>
              <button 
                onClick={() => {
                  setProgress(0);
                  setIsPlaying(false);
                }}
                className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                title="重置"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <OrbitalVisualizer type={selectedBond} progress={progress} />
            
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">手动进度控制</span>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                  {Math.round(progress * 100)}% 形成进度
                </span>
              </div>
              <div className="relative group">
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.001"
                  value={progress}
                  onChange={handleManualProgress}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-emerald-400 transition-all"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 uppercase font-mono tracking-tighter">
                <span>自由原子</span>
                <div className="flex gap-4">
                  <div className="w-px h-2 bg-slate-800" />
                  <span>接触重叠</span>
                  <div className="w-px h-2 bg-slate-800" />
                </div>
                <span>完成成键</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>实时轨道动力学引擎 已就绪</span>
            </div>
          </div>
          <p>© 2025 BondLab 教学实验室 - 探索微观世界的奥秘</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
