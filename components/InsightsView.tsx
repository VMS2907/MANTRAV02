
import React from 'react';
import { Sparkles, Brain, Clock, Shuffle, Lightbulb, Sun, BookOpen, RefreshCw } from 'lucide-react';
import { MoodEntry, Insight } from '../types';
import { Button } from './Button';

interface InsightsViewProps {
  entries: MoodEntry[];
  userName: string;
  insights: Insight[];
  onGenerate: () => void;
  isLoading: boolean;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ 
  entries, 
  userName,
  insights,
  onGenerate,
  isLoading
}) => {
  
  const getIcon = (type: Insight['type']) => {
    switch(type) {
      case 'pattern_detection': return <Brain className="text-purple-400" size={24} />;
      case 'temporal_patterns': return <Clock className="text-orange-400" size={24} />;
      case 'emotional_complexity': return <Shuffle className="text-pink-400" size={24} />;
      case 'what_helps': return <Lightbulb className="text-yellow-400" size={24} />;
      case 'predictions': return <Sun className="text-blue-400" size={24} />;
      case 'diary_themes': return <BookOpen className="text-indigo-400" size={24} />;
      default: return <Sparkles className="text-gray-400" size={24} />;
    }
  };

  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto no-scrollbar pb-32">
      <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
        <h2 className="text-3xl font-bold text-white tracking-tight">Your Insights</h2>
        <p className="text-sm text-gray-500 mt-1">Deep dive into your emotional patterns.</p>
      </div>

      {entries.length < 3 ? (
        <div className="text-center py-12 px-6 glass-card rounded-3xl border border-dashed border-white/10">
          <div className="bg-white/5 p-4 rounded-full inline-block mb-4">
            <Brain size={32} className="text-gray-500" />
          </div>
          <h3 className="font-medium text-gray-300 mb-2">Need more data</h3>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-[250px] mx-auto">
            Log at least 3 mood entries to unlock personalized AI analysis.
          </p>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden max-w-[200px] mx-auto">
             <div className="bg-violet-600 h-full transition-all duration-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]" style={{ width: `${Math.min((entries.length / 3) * 100, 100)}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">{entries.length}/3 entries</p>
        </div>
      ) : (
        <>
          {insights.length === 0 && !isLoading && (
            <div className="glass-card p-8 rounded-3xl text-center border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-violet-500/10 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <Sparkles className="mx-auto text-violet-400 mb-4 relative z-10" size={40} />
              <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Ready to analyze</h3>
              <p className="text-gray-400 text-sm mb-6 relative z-10 leading-relaxed">
                Mantra AI will look for hidden patterns in your emotional history.
              </p>
              <Button onClick={onGenerate} className="shadow-[0_0_20px_rgba(139,92,246,0.3)] relative z-10">
                Generate Insights
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto text-violet-400 animate-pulse" size={28} />
              </div>
              <p className="text-white font-medium mb-1 text-lg">Connecting dots...</p>
              <p className="text-xs text-gray-500">Analyzing {entries.length} data points</p>
            </div>
          )}

          <div className="space-y-4">
            {insights.map((insight, idx) => (
              <div 
                key={insight.id} 
                className="glass-card p-6 rounded-2xl animate-in slide-in-from-bottom-4 duration-500 border border-white/5 hover:border-white/10 transition-all group"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 shrink-0 group-hover:scale-110 transition-transform">
                    {getIcon(insight.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold tracking-wider uppercase opacity-60 text-gray-400 block truncate mb-1">
                      {insight.type.replace('_', ' ')}
                    </span>
                    <h3 className="font-bold text-white leading-tight">{insight.title}</h3>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line pl-1">
                  {insight.content}
                </p>
              </div>
            ))}
          </div>
          
          {insights.length > 0 && !isLoading && (
            <div className="mt-10 text-center pb-8">
              <button 
                onClick={onGenerate}
                className="text-xs text-gray-500 hover:text-violet-400 flex items-center justify-center gap-2 mx-auto px-5 py-3 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
              >
                <RefreshCw size={14} /> Regenerate Analysis
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
