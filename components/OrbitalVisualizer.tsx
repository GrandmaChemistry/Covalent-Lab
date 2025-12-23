
import React from 'react';
import { BondType } from '../types';

interface Props {
  type: BondType;
  progress: number;
}

const OrbitalVisualizer: React.FC<Props> = ({ type, progress }) => {
  const stage1Limit = 0.5;
  const stage1Prog = Math.min(1, progress / stage1Limit);
  const stage2Prog = progress > stage1Limit ? (progress - stage1Limit) / (1 - stage1Limit) : 0;
  
  const fusionStart = 0.5; // 修改此处：从 0.8 改为 0.5，使其在接触时就开始出现
  const resultOpacity = progress > fusionStart 
    ? (progress - fusionStart) / (1 - fusionStart) 
    : 0;

  const atomicOpacity = 0.6; 
  const sRad = 28;
  const pWidth = 22;
  const pLength = 34;

  const getGapConfig = () => {
    switch (type) {
      case BondType.SS_SIGMA: return { initial: 160, touching: 28, final: 15 }; 
      case BondType.SP_SIGMA: return { initial: 160, touching: 48, final: 38 };
      case BondType.PP_SIGMA: return { initial: 160, touching: 68, final: 55 };
      case BondType.PP_PI: return { initial: 160, touching: 22, final: 12 }; 
      default: return { initial: 160, touching: 65, final: 52 };
    }
  };

  const { initial, touching, final } = getGapConfig();

  const currentGap = progress <= stage1Limit 
    ? initial - (initial - touching) * stage1Prog
    : touching - (touching - final) * stage2Prog;

  const S_Orbital = ({ x, y, color = "fill-cyan-400" }: { x: number, y: number, color?: string }) => (
    <circle cx={x} cy={y} r={sRad} className={color} style={{ opacity: atomicOpacity }} />
  );

  const P_Orbital = ({ x, y, rotation = 0, color = "fill-emerald-400", customOpacity = 1 }: { x: number, y: number, rotation?: number, color?: string, customOpacity?: number }) => (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`} style={{ opacity: atomicOpacity * customOpacity }}>
      <ellipse cx="0" cy={-pLength} rx={pWidth} ry={pLength} className={color} />
      <ellipse cx="0" cy={pLength} rx={pWidth} ry={pLength} className={color} />
    </g>
  );

  const Hybrid_Orbital = ({ x, y, rotation = 0, scale = 0.9, color = "fill-indigo-400" }: { x: number, y: number, rotation?: number, scale?: number, color?: string }) => (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`} style={{ opacity: atomicOpacity }}>
      <path d="M 0,0 C 10,-40 65,-35 65,0 C 65,35 10,40 0,0" className={color} />
      <circle cx="-14" cy="0" r="14" className={color} style={{ opacity: 0.4 }} />
    </g>
  );

  const PiLobe = ({ centerX, centerY, width, height, isBottom = false, color = "fill-pink-300" }: any) => {
    const flip = isBottom ? 1 : -1;
    const offset = 26 * flip; 
    const glowColor = color.includes('pink') ? 'rgba(244,114,182,0.4)' : 'rgba(239,68,68,0.4)';
    return (
      <ellipse cx={centerX} cy={centerY + offset} rx={width / 2} ry={height / 2} className={`${color} drop-shadow-[0_0_8px_${glowColor}]`} />
    );
  };

  const RenderFinalResult = ({ centerY }: { centerY: number }) => {
    const y = centerY;
    const centerX = 200;
    const style = { opacity: resultOpacity };
    switch (type) {
      case BondType.SS_SIGMA:
        return <path d={`M ${centerX-38},${y} C ${centerX-38},${y-24} ${centerX+38},${y-24} ${centerX+38},${y} C ${centerX+38},${y+24} ${centerX-38},${y+24} ${centerX-38},${y}`} className="fill-cyan-300 drop-shadow-[0_0_10px_rgba(103,232,249,0.5)]" style={style} />;
      case BondType.SP_SIGMA:
        return (
          <g style={style}>
            <path d={`M ${centerX - 35},${y} C ${centerX - 35},${y-20} ${centerX - 10},${y-25} ${centerX + 15},${y-32} C ${centerX + 65},${y-40} ${centerX + 65},${y+40} ${centerX + 15},${y+32} C ${centerX - 10},${y+25} ${centerX - 35},${y+20} ${centerX - 35},${y} Z`} className="fill-cyan-300 drop-shadow-[0_0_10px_rgba(103,232,249,0.5)]" />
            <ellipse cx={centerX + 64} cy={y} rx="16" ry="14" className="fill-emerald-400 opacity-50" />
          </g>
        );
      case BondType.PP_SIGMA:
        return (
          <g style={style}>
            <ellipse cx={centerX} cy={y} rx="58" ry="32" className="fill-blue-300 drop-shadow-[0_0_12px_rgba(147,197,253,0.5)]" />
            <ellipse cx={centerX - 75} cy={y} rx="22" ry="18" className="fill-blue-400 opacity-40" />
            <ellipse cx={centerX + 75} cy={y} rx="22" ry="18" className="fill-blue-400 opacity-40" />
          </g>
        );
      case BondType.PP_PI:
        return (
          <g style={style}>
            <PiLobe centerX={centerX} centerY={y} width={105} height={26} />
            <PiLobe centerX={centerX} centerY={y} width={105} height={26} isBottom={true} />
          </g>
        );
      default: return null;
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="relative w-full aspect-[2.8/1] bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
        <div className="absolute top-3 left-4 z-10 flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">原子轨道动态</span>
          <span className="text-[11px] font-bold text-cyan-400">
            {progress < stage1Limit ? "相互靠近中..." : "电子云重叠中..."}
          </span>
        </div>

        <svg viewBox="0 0 400 140" className="w-full h-full">
          <line x1="40" y1="70" x2="360" y2="70" stroke="white" strokeWidth="0.5" strokeDasharray="4,4" className="opacity-10" />
          {type === BondType.SS_SIGMA && <><S_Orbital x={200 - currentGap} y={70} /><S_Orbital x={200 + currentGap} y={70} /></>}
          {type === BondType.SP_SIGMA && <><S_Orbital x={200 - currentGap} y={70} /><P_Orbital x={200 + currentGap} y={70} rotation={90} /></>}
          {type === BondType.PP_SIGMA && <><P_Orbital x={200 - currentGap} y={70} rotation={90} color="fill-blue-400" /><P_Orbital x={200 + currentGap} y={70} rotation={90} color="fill-blue-400" /></>}
          {type === BondType.PP_PI && <><P_Orbital x={200 - currentGap} y={70} color="fill-pink-400" /><P_Orbital x={200 + currentGap} y={70} color="fill-pink-400" /></>}
          {type === BondType.ETHANE && (
            <><Hybrid_Orbital x={200 - currentGap} y={70} rotation={0} /><Hybrid_Orbital x={200 - currentGap} y={70} rotation={110} /><Hybrid_Orbital x={200 - currentGap} y={70} rotation={180} /><Hybrid_Orbital x={200 - currentGap} y={70} rotation={250} /><Hybrid_Orbital x={200 + currentGap} y={70} rotation={180} /><Hybrid_Orbital x={200 + currentGap} y={70} rotation={70} /><Hybrid_Orbital x={200 + currentGap} y={70} rotation={0} /><Hybrid_Orbital x={200 + currentGap} y={70} rotation={290} /></>
          )}
          {type === BondType.ETHENE && (
            <><Hybrid_Orbital x={200 - currentGap} y={70} rotation={0} /><Hybrid_Orbital x={200 - currentGap} y={70} rotation={140} scale={0.8} /><Hybrid_Orbital x={200 - currentGap} y={70} rotation={220} scale={0.8} /><P_Orbital x={200 - currentGap} y={70} color="fill-red-400" customOpacity={0.5} /><Hybrid_Orbital x={200 + currentGap} y={70} rotation={180} /><Hybrid_Orbital x={200 + currentGap} y={70} rotation={40} scale={0.8} /><Hybrid_Orbital x={200 + currentGap} y={70} rotation={320} scale={0.8} /><P_Orbital x={200 + currentGap} y={70} color="fill-red-400" customOpacity={0.5} /></>
          )}
          {type === BondType.ETHYNE && (
            <><Hybrid_Orbital x={200 - currentGap} y={70} rotation={0} /><Hybrid_Orbital x={200 - currentGap} y={70} rotation={180} /><P_Orbital x={200 - currentGap} y={70} color="fill-sky-400" customOpacity={0.5} rotation={0} /><P_Orbital x={200 - currentGap} y={70} color="fill-teal-400" customOpacity={0.3} rotation={45} /><Hybrid_Orbital x={200 + currentGap} y={70} rotation={180} /><Hybrid_Orbital x={200 + currentGap} y={70} rotation={0} /><P_Orbital x={200 + currentGap} y={70} color="fill-sky-400" customOpacity={0.5} rotation={0} /><P_Orbital x={200 + currentGap} y={70} color="fill-teal-400" customOpacity={0.3} rotation={45} /></>
          )}
          <circle cx={200 - currentGap} cy={70} r="3" className="fill-white shadow-lg shadow-white/50" />
          <circle cx={200 + currentGap} cy={70} r="3" className="fill-white shadow-lg shadow-white/50" />
        </svg>
      </div>

      {!(type === BondType.ETHANE || type === BondType.ETHENE || type === BondType.ETHYNE) && (
        <div className="relative w-full aspect-[4.2/1] bg-slate-900/40 rounded-xl border border-slate-800/50 overflow-hidden">
          <div className="absolute top-3 left-4 z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">成键终态模型</span>
          </div>
          <svg viewBox="0 0 400 95" className="w-full h-full">
            <RenderFinalResult centerY={47.5} />
            {resultOpacity > 0.05 && (
              <g style={{ opacity: resultOpacity }}>
                <circle 
                  cx={type === BondType.SP_SIGMA ? 200 - (final - 15) : 200 - final} 
                  cy={47.5} 
                  r="3" 
                  className="fill-white shadow-lg shadow-white/50" 
                />
                <circle cx={200 + final} cy={47.5} r="3" className="fill-white shadow-lg shadow-white/50" />
              </g>
            )}
          </svg>
        </div>
      )}
    </div>
  );
};

export default OrbitalVisualizer;
