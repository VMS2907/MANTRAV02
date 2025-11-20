
import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Flame, Plus, CalendarDays, PieChart, Calendar as CalendarIcon } from 'lucide-react';
import { MoodEntry, MoodType } from '../types';
import { MOODS, formatDate } from '../constants';
import { Button } from './Button';

interface CalendarViewProps {
  entries: MoodEntry[];
  onSelectDate: (date: string) => void;
  onAddToday: () => void;
  onAddEntry: (date: string) => void;
  onEditEntry: (entry: MoodEntry) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ 
  entries, 
  onSelectDate, 
  onAddToday,
  onAddEntry,
  onEditEntry
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Streak Calculation
  const streak = useMemo(() => {
    if (entries.length === 0) return 0;
    let count = 0;
    const today = new Date();
    let checkDate = new Date(today);
    const todayStr = formatDate(today);
    const hasToday = entries.some(e => e.date === todayStr);
    if (!hasToday) checkDate.setDate(checkDate.getDate() - 1);

    while (true) {
        const dateStr = formatDate(checkDate);
        const hasEntry = entries.some(e => e.date === dateStr);
        if (hasEntry) {
            count++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    return count;
  }, [entries]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sunday
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Stats for current month
  const monthStats = useMemo(() => {
    const currentMonthStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const monthEntries = entries.filter(e => e.date.startsWith(currentMonthStr));
    
    const counts: Record<string, number> = {};
    monthEntries.forEach(e => {
        counts[e.mood] = (counts[e.mood] || 0) + 1;
    });
    
    return { counts, total: monthEntries.length };
  }, [entries, currentDate, year]);

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(<div key={`empty-${i}`} className="aspect-square w-full" />);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
      const dateStr = formatDate(dateObj);
      const dayEntries = entries.filter(e => e.date === dateStr);
      // Sort entries by time if possible, or timestamp
      const sortedEntries = dayEntries.sort((a, b) => a.timestamp - b.timestamp);
      const primaryEntry = sortedEntries[0]; // First entry of the day
      const otherEntries = sortedEntries.slice(1);

      const config = primaryEntry ? MOODS[primaryEntry.mood] : null;
      const isToday = dateStr === formatDate(new Date());

      days.push(
        <button
          key={dateStr}
          onClick={() => {
             if (dayEntries.length > 0) onSelectDate(dateStr);
             else onAddEntry(dateStr);
          }}
          className={`
            aspect-square w-full rounded-xl sm:rounded-2xl flex flex-col items-center justify-center relative transition-all duration-500 select-none overflow-hidden group
            ${dayEntries.length === 0 
                ? `cursor-pointer bg-white/[0.02] border border-white/[0.02] hover:bg-white/5 hover:border-white/10 ${isToday ? 'ring-1 ring-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]' : ''}` 
                : 'cursor-pointer hover:scale-105 active:scale-95 border-t border-l border-white/10 shadow-lg'
            }
          `}
          style={primaryEntry ? {
            background: showHeatmap 
                ? config?.color 
                : `linear-gradient(135deg, ${config?.color}25, ${config?.color}05)`,
            borderColor: !showHeatmap ? `${config?.color}30` : 'transparent',
            opacity: showHeatmap ? (config?.intensity || 1) * 0.15 + 0.5 : 1,
            boxShadow: !showHeatmap ? `0 4px 20px -5px ${config?.color}20` : 'none'
          } : undefined}
        >
          {/* Date Number */}
          <span className={`absolute top-1 left-1.5 text-[10px] font-bold z-10 ${primaryEntry ? (showHeatmap ? 'text-black/60 mix-blend-overlay' : 'text-white/50') : (isToday ? 'text-violet-400' : 'text-gray-700 group-hover:text-gray-500')}`}>
            {d}
          </span>
          
          {/* Today Indicator Dot if empty */}
          {isToday && !primaryEntry && (
              <div className="absolute bottom-2 w-1 h-1 rounded-full bg-violet-500 shadow-[0_0_5px_#8b5cf6]"></div>
          )}

          {primaryEntry && !showHeatmap && (
            <div className="relative flex flex-col items-center mt-1 w-full h-full justify-center">
               <span className="text-xl sm:text-2xl filter drop-shadow-lg animate-in zoom-in duration-500 leading-none transform group-hover:scale-110 transition-transform">
                  {primaryEntry.moodEmoji}
               </span>
               
               {/* Multiple Entry Indicators */}
               {otherEntries.length > 0 && (
                  <div className="flex gap-0.5 absolute bottom-1.5 opacity-80">
                     {otherEntries.slice(0, 3).map((e, i) => (
                        <div key={i} className="w-1 h-1 rounded-full shadow-sm" style={{ backgroundColor: MOODS[e.mood].color }}></div>
                     ))}
                     {otherEntries.length > 3 && <div className="w-1 h-1 rounded-full bg-white/50"></div>}
                  </div>
               )}
            </div>
          )}

          {!primaryEntry && !showHeatmap && (
             <Plus size={12} className="text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100" />
          )}
        </button>
      );
    }
    return days;
  };

  const isEmptyState = entries.length === 0;

  return (
    <div className="flex flex-col h-full p-6 pb-32 overflow-y-auto no-scrollbar relative">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 animate-in slide-in-from-top-4 duration-500">
        <div>
          <h2 className="text-4xl font-thin text-white tracking-tight flex items-baseline gap-2">
            {monthName} <span className="text-lg text-gray-600 font-light font-mono">{year}</span>
          </h2>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 text-orange-400 text-xs font-medium mt-1 pl-1">
              <Flame size={12} className="fill-orange-400 animate-[pulse_3s_ease-in-out_infinite]" />
              <span>{streak} Day Streak</span>
            </div>
          )}
        </div>
        {!isEmptyState && (
          <div className="flex gap-1 bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-md shadow-lg">
             <button onClick={() => setShowHeatmap(!showHeatmap)} className={`p-2 rounded-full transition-all duration-300 ${showHeatmap ? 'bg-white/10 text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.2)]' : 'hover:bg-white/5 text-gray-400'}`}>
               {showHeatmap ? <PieChart size={16} /> : <CalendarIcon size={16} />}
             </button>
             <div className="w-px h-4 bg-white/10 mx-1 self-center"></div>
            <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
              <ChevronLeft size={16} />
            </button>
            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {isEmptyState ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center -mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-violet-500 blur-[60px] opacity-20 rounded-full group-hover:opacity-30 transition-opacity"></div>
            <div className="bg-gradient-to-br from-gray-800 to-black p-8 rounded-3xl border border-white/10 relative z-10 shadow-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500">
              <CalendarDays size={48} className="text-violet-400" strokeWidth={1} />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-white mb-2">Your story starts here</h3>
          <p className="text-gray-400 mb-8 max-w-xs font-light leading-relaxed">
            Every day is a blank page. Fill this calendar with your journey.
          </p>
          <Button onClick={onAddToday} className="shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            Start Tracking
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 sm:gap-3 mb-2 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <div key={d} className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{d}</div>
            ))}
          </div>
    
          <div className="grid grid-cols-7 gap-1 sm:gap-3 mb-8">
            {renderCalendarDays()}
          </div>

          {/* Month Summary */}
          {monthStats.total > 0 && (
             <div className="glass-card p-6 rounded-3xl animate-in slide-in-from-bottom-4 duration-500 border border-white/5 mb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monthly Breakdown</h3>
                  <div className="px-2 py-1 bg-white/5 rounded-lg text-[10px] text-gray-400 font-mono">{monthStats.total} MOMENTS</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(monthStats.counts)
                        .sort(([,a], [,b]) => (b as number) - (a as number))
                        .slice(0, 6)
                        .map(([mood, count]) => {
                            const config = MOODS[mood as MoodType];
                            const pct = Math.round(((count as number) / monthStats.total) * 100);
                            return (
                                <div key={mood} className="flex flex-col gap-1.5 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-default">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xl filter drop-shadow-md">{config.emoji}</span>
                                        <span className="text-xs font-bold text-white font-mono">{pct}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full rounded-full transition-all duration-1000" 
                                            style={{ width: `${pct}%`, backgroundColor: config.color }} 
                                        />
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-medium uppercase">{config.label}</span>
                                </div>
                            )
                        })
                    }
                </div>
             </div>
          )}
        </>
      )}
    </div>
  );
};
