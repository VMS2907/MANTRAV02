
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, PenLine } from 'lucide-react';
import { REFLECTION_PROMPTS, MOOD_SPECIFIC_PROMPTS, MOODS } from '../constants';
import { MoodType } from '../types';

interface ReflectionLibraryProps {
  onSelectPrompt: (prompt: string) => void;
  currentMood?: MoodType;
}

export const ReflectionLibrary: React.FC<ReflectionLibraryProps> = ({ onSelectPrompt, currentMood }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCat = (cat: string) => setExpandedCategory(expandedCategory === cat ? null : cat);

  return (
    <div className="h-full overflow-y-auto no-scrollbar p-6 pb-24">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
           <Sparkles className="text-violet-400" /> Reflection Prompts
        </h2>
        <p className="text-gray-500 text-sm">Overcome blank page syndrome.</p>
      </div>

      {/* Mood Specific */}
      {currentMood && MOOD_SPECIFIC_PROMPTS[currentMood] && (
         <div className="mb-6">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
               Because you felt <span style={{ color: MOODS[currentMood].color }}>{MOODS[currentMood].label}</span>
            </div>
            <div className="space-y-2">
               {MOOD_SPECIFIC_PROMPTS[currentMood].map((prompt, i) => (
                  <button 
                    key={i}
                    onClick={() => onSelectPrompt(prompt)}
                    className="w-full text-left p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl hover:bg-violet-500/20 transition-colors text-gray-200 text-sm"
                  >
                    "{prompt}"
                  </button>
               ))}
            </div>
         </div>
      )}

      {/* Categories */}
      <div className="space-y-3">
         {REFLECTION_PROMPTS.map((cat) => (
            <div key={cat.category} className="glass-card rounded-2xl overflow-hidden border border-white/5">
               <button 
                 onClick={() => toggleCat(cat.category)}
                 className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
               >
                  <span className="font-medium text-white">{cat.category}</span>
                  {expandedCategory === cat.category ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
               </button>
               
               {expandedCategory === cat.category && (
                  <div className="bg-black/20 p-2 space-y-1 border-t border-white/5">
                     {cat.prompts.map((p, i) => (
                        <button
                           key={i}
                           onClick={() => onSelectPrompt(p)}
                           className="w-full text-left p-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white text-sm flex items-start gap-3 transition-colors"
                        >
                           <PenLine size={14} className="mt-0.5 shrink-0 opacity-50" />
                           {p}
                        </button>
                     ))}
                  </div>
               )}
            </div>
         ))}
      </div>
    </div>
  );
};
