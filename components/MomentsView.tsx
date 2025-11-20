
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Mic, BookOpen, Plus, ArrowLeft } from 'lucide-react';
import { MoodEntry } from '../types';
import { MOODS, formatDate } from '../constants';
import { Button } from './Button';

interface MomentsViewProps {
  entries: MoodEntry[];
  selectedDate?: string;
  onClose: () => void;
  onAddMoment: () => void;
}

export const MomentsView: React.FC<MomentsViewProps> = ({ 
  entries, 
  selectedDate: initialDate,
  onClose,
  onAddMoment
}) => {
  const [currentDate, setCurrentDate] = useState(initialDate ? new Date(initialDate) : new Date());

  const dateStr = formatDate(currentDate);
  const dayEntries = useMemo(() => 
    entries.filter(e => e.date === dateStr).sort((a, b) => a.timestamp - b.timestamp), 
  [entries, dateStr]);

  const handlePrevDay = () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
  const handleNextDay = () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));

  return (
    <div className="flex flex-col h-full bg-[#09090B] animate-in slide-in-from-right duration-300">
       {/* Header */}
       <div className="p-6 pb-2 flex items-center justify-between">
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-4">
             <button onClick={handlePrevDay} className="text-gray-500 hover:text-white"><ChevronLeft size={20} /></button>
             <div className="text-center">
                <div className="text-white font-bold">{currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                <div className="text-xs text-gray-500">{dayEntries.length} Moments</div>
             </div>
             <button onClick={handleNextDay} className="text-gray-500 hover:text-white"><ChevronRight size={20} /></button>
          </div>
          <div className="w-10" />
       </div>

       {/* Timeline */}
       <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {dayEntries.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                <div className="text-4xl mb-4 grayscale opacity-50">🕰️</div>
                <p className="text-gray-400 mb-6">No moments captured this day.</p>
                <Button onClick={onAddMoment} variant="secondary">Capture a Moment</Button>
             </div>
          ) : (
             <div className="relative pl-4 border-l-2 border-white/5 space-y-8 py-4">
                {dayEntries.map((entry, idx) => (
                   <div key={entry.id} className="relative animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                      {/* Node */}
                      <div className="absolute -left-[23px] top-0 bg-[#09090B] p-1">
                         <div className="w-4 h-4 rounded-full" style={{ backgroundColor: MOODS[entry.mood].color, boxShadow: `0 0 10px ${MOODS[entry.mood].color}80` }}></div>
                      </div>

                      {/* Content */}
                      <div className="glass-panel p-4 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                         <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                               <span className="text-2xl">{entry.moodEmoji}</span>
                               <span className="font-bold text-white">{MOODS[entry.mood].label}</span>
                            </div>
                            <span className="text-xs text-gray-500 font-mono">{entry.time}</span>
                         </div>
                         
                         {entry.secondaryMoods.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                               {entry.secondaryMoods.map(s => (
                                  <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                                     {s}
                                  </span>
                               ))}
                            </div>
                         )}

                         {(entry.context || entry.note) && (
                            <div className="text-sm text-gray-300 mb-2 leading-relaxed">
                               "{entry.context || entry.note.split('\n')[0]}"
                            </div>
                         )}

                         {/* Badges */}
                         <div className="flex gap-3 mt-3 pt-3 border-t border-white/5">
                            {entry.transcription && (
                               <div className="flex items-center gap-1 text-xs text-violet-400">
                                  <Mic size={12} /> Voice Note
                               </div>
                            )}
                            {!entry.isQuickMoment && (
                               <div className="flex items-center gap-1 text-xs text-blue-400">
                                  <BookOpen size={12} /> Full Entry
                               </div>
                            )}
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          )}
       </div>

       <div className="p-6 pt-2">
          <Button onClick={onAddMoment} fullWidth className="shadow-lg">
             <Plus size={18} className="mr-2" /> Capture Moment
          </Button>
       </div>
    </div>
  );
};
