
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { BondType } from '../types';

interface Props {
  currentBond: BondType;
}

const GeminiAssistant: React.FC<Props> = ({ currentBond }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const askTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(""); 
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `你是一位世界顶尖的化学教授。请解答关于共价键的问题，当前正在讲解的是 "${currentBond}"。
      用户问题: ${query}
      确保解释清晰、专业且具有教育意义。使用 Markdown 格式。请用中文回答。`;

      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "你是一位专门辅导大学化学的助教，能将复杂的概念简单化，回复请使用中文。",
        }
      });

      setResponse(res.text || "抱歉，我无法生成答案。");
    } catch (err) {
      console.error(err);
      setResponse("连接错误，请检查您的网络。");
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [response]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[500px] shadow-2xl">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-200">化学智能助教 (AI)</h3>
        </div>
        <span className="text-[10px] text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">双语教学支持</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {!response && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">你可以问我任何关于 {currentBond} 或化学键的问题。</p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {[
                '什么是轨道杂化？', 
                '为什么π键比σ键弱？', 
                '解释sp3和sp2的区别。',
                '为什么乙炔是直线型的？'
              ].map(q => (
                <button 
                  key={q}
                  onClick={() => setQuery(q)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-700 transition-colors text-slate-300"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {response && (
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 prose prose-invert prose-sm max-w-none">
            {response.split('\n').map((line, i) => (
              <p key={i} className="mb-2 last:mb-0 leading-relaxed text-slate-300">
                {line}
              </p>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 px-4 py-2 rounded-2xl flex items-center gap-2 border border-slate-700">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-xs text-slate-400">正在思考化学原理...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={askTutor} className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入你的化学疑问..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeminiAssistant;
