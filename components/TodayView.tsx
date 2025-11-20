
import React, { useState, useEffect, useMemo } from 'react';
import { Sun, Moon, Sunrise, Sunset, Flame, ArrowRight, CheckCircle2, Play, MessageCircle, Music, Clock, Plus, Edit3, Sparkles, RefreshCw, Lock, Zap } from 'lucide-react';
import { MoodEntry, UserProfile, Intention, Insight } from '../types';
import { MOODS, formatDate } from '../constants';
import { Button } from './Button';

interface TodayViewProps {
  userProfile: UserProfile | null;
  entries: MoodEntry[];
  insights: Insight[];
  onCheckIn: () => void;
  onViewEntry: (entry: MoodEntry) => void;
  onViewCalendar: () => void;
  intention: Intention | null;
  onSaveIntention: (text: string) => void;
  onToggleIntention: () => void;
  onGenerateForecast: () => void;
  isGeneratingForecast: boolean;
}

export const TodayView: React.FC<TodayViewProps> = ({ 
  userProfile, 
  entries,
  insights,
  onCheckIn, 
  onViewEntry,
  onViewCalendar,
  intention,
  onSaveIntention,
  onToggleIntention,
  onGenerateForecast,
  isGeneratingForecast
}) => {
  const [timeOfDay, setTimeOfDay] = useState('');
  const [newIntention, setNewIntention] = useState('');
  const [isEditingIntention, setIsEditingIntention] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('Good morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('Good afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('Good evening');
    else setTimeOfDay('Good night');
  }, []);

  const todayDate = formatDate(new Date());
  const yesterdayDate = formatDate(new Date(new Date().setDate(new Date().getDate() - 1)));

  const todayEntries = useMemo(() => 
    entries.filter(e => e.date === todayDate).sort((a, b) => b.timestamp - a.timestamp), 
  [entries, todayDate]);

  const yesterdayEntries = useMemo(() => 
    entries.filter(e => e.date === yesterdayDate).sort((a, b) => b.timestamp - a.timestamp), 
  [entries, yesterdayDate]);

  // Logic to find today's forecast from AI insights
  const forecastInsight = useMemo(() => 
    insights.find(i => i.type === 'predictions'), 
  [insights]);

  const hasEnoughData = entries.length > 0;

  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto no-scrollbar pb-32">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 animate-in slide-in-from-top-4 duration-500">
        <div>
          <div className="flex items-center gap-2 text-violet-300 text-sm font-medium mb-1">
            {timeOfDay.includes('morning') && <Sunrise size={16} />}
            {timeOfDay.includes('afternoon') && <Sun size={16} />}
            {timeOfDay.includes('evening') && <Sunset size={16} />}
            {timeOfDay.includes('night') && <Moon size={16} />}
            <span>{timeOfDay}</span>
          </div>
          <h1 className="text-3xl font-bold text-white">{userProfile?.name || 'Friend'}!</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="bg-orange-500/10 px-3 py-2 rounded-xl border border-orange-500/20 flex flex-col items-center">
           <Flame size={20} className="text-orange-400 fill-orange-400 animate-pulse" />
           <span className="text-orange-400 font-bold text-sm">{userProfile?.streak || 0}</span>
        </div>
      </div>

      {/* Right Now Card */}
      <div className="glass-card rounded-3xl p-6 mb-6 relative overflow-hidden border border-violet-500/20 shadow-[0_0_40px_rgba(139,92,246,0.15)] animate-in zoom-in duration-500">
        <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           Right Now
        </h2>
        
        {todayEntries.length === 0 ? (
          <div>
            <p className="text-xl text-white font-medium mb-6 leading-tight">
               Your daily story hasn't started yet.
            </p>
            <Button onClick={onCheckIn} className="w-full shadow-[0_0_20px_rgba(139,92,246,0.4)] py-4">
              How are you feeling?
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="text-6xl filter drop-shadow-2xl animate-[bounce_2s_infinite]">{todayEntries[0].moodEmoji}</div>
              <div>
                <div className="text-3xl font-bold text-white">{MOODS[todayEntries[0].mood].label}</div>
                <div className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                  <Clock size={12} /> {todayEntries[0].time}
                </div>
              </div>
            </div>
            {todayEntries[0].context && (
               <div className="bg-white/5 p-4 rounded-2xl text-sm text-gray-300 mb-5 italic border-l-2 border-violet-500 leading-relaxed">
                 "{todayEntries[0].context}"
               </div>
            )}
            <div className="flex gap-2">
               <button 
                  onClick={onCheckIn}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-gray-300 flex items-center justify-center gap-2 transition-all active:scale-95"
               >
                  <Plus size={16} /> Log Moment
               </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Forecast Section */}
      <div className="mb-6">
        <div className="glass-panel rounded-2xl p-1 relative overflow-hidden">
            {/* Gradient Border */}
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${hasEnoughData ? 'via-blue-500/50' : 'via-gray-700/50'} to-transparent opacity-30`}></div>
            
            <div className="bg-[#09090B]/90 backdrop-blur-xl rounded-xl p-5 relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${hasEnoughData ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-800 text-gray-500'}`}>
                            {hasEnoughData ? <Sparkles size={14} /> : <Lock size={14} />}
                        </div>
                        <h3 className={`font-bold text-sm tracking-wide ${hasEnoughData ? 'text-white' : 'text-gray-500'}`}>
                            Daily Forecast
                        </h3>
                    </div>
                    {hasEnoughData && forecastInsight && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 font-mono uppercase">AI Ready</span>
                            <button 
                                onClick={onGenerateForecast} 
                                disabled={isGeneratingForecast}
                                className={`text-blue-400 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full ${isGeneratingForecast ? 'animate-spin' : ''}`}
                            >
                                <RefreshCw size={14} />
                            </button>
                        </div>
                    )}
                </div>

                {!hasEnoughData ? (
                    <div className="flex flex-col items-center text-center py-2">
                        <p className="text-gray-400 text-sm mb-3">
                            Log your <span className="text-white font-bold">first entry</span> to unlock AI predictions.
                        </p>
                    </div>
                ) : forecastInsight ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <p className="text-gray-200 text-sm leading-relaxed font-light border-l-2 border-blue-500/30 pl-3 py-1">
                            {forecastInsight.content}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-1">
                         <p className="text-gray-400 text-xs mb-3">Your data is ready for analysis.</p>
                         <Button 
                            onClick={onGenerateForecast} 
                            disabled={isGeneratingForecast}
                            className="w-full bg-gradient-to-r from-blue-600/20 to-violet-600/20 hover:from-blue-600/30 hover:to-violet-600/30 border border-blue-500/30 text-blue-200 py-3"
                         >
                            {isGeneratingForecast ? (
                                <span className="flex items-center gap-2"><Sparkles size={14} className="animate-spin" /> Analyzing Patterns...</span>
                            ) : (
                                <span className="flex items-center gap-2"><Zap size={14} /> Generate Forecast</span>
                            )}
                         </Button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Intention */}
      <div className="glass-card rounded-3xl p-6 mb-6 border border-white/5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Today's Intention</h2>
          {intention && !isEditingIntention && (
             <button onClick={() => setIsEditingIntention(true)} className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
               <Edit3 size={14} />
             </button>
          )}
        </div>

        {(!intention || isEditingIntention) ? (
          <div className="animate-in fade-in">
            <div className="relative mb-4">
                <input
                type="text"
                value={newIntention}
                onChange={(e) => setNewIntention(e.target.value)}
                placeholder="I will..."
                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 pl-5 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all"
                autoFocus
                />
            </div>
            
            {(!intention || isEditingIntention) && !newIntention && (
              <div className="flex flex-wrap gap-2 mb-5">
                {["Take a 10-min break", "Drink water", "Text a friend", "Be kind to myself"].map(txt => (
                  <button 
                    key={txt}
                    onClick={() => setNewIntention(txt)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-xs text-gray-400 transition-colors"
                  >
                    {txt}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-3">
                {isEditingIntention && (
                    <Button variant="ghost" onClick={() => setIsEditingIntention(false)} className="flex-1">Cancel</Button>
                )}
                <Button 
                    onClick={() => {
                        onSaveIntention(newIntention);
                        setIsEditingIntention(false);
                        setNewIntention('');
                    }} 
                    fullWidth 
                    disabled={!newIntention.trim()}
                    className="flex-1 shadow-lg"
                >
                    Set Intention
                </Button>
            </div>
          </div>
        ) : (
          <div 
            className={`flex items-start gap-4 p-2 rounded-xl transition-colors ${intention.completed ? 'opacity-60' : ''}`}
            onClick={onToggleIntention}
          >
            <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 cursor-pointer shrink-0 ${intention.completed ? 'bg-green-500 border-green-500 scale-110' : 'border-gray-600 hover:border-violet-400'}`}>
              {intention.completed && <CheckCircle2 size={14} className="text-white" />}
            </div>
            <div className="flex-1 cursor-pointer">
               <p className={`text-lg font-medium transition-all duration-500 ${intention.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                 "{intention.text}"
               </p>
               <p className="text-xs text-gray-500 mt-1 font-medium">
                 {intention.completed ? 'Great job fulfilling your promise!' : 'Tap checkbox when done.'}
               </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Wins */}
      <div className="mb-8">
         <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pl-2">Quick Wins</h2>
         <div className="grid grid-cols-2 gap-3">
            <a href="spotify:" className="glass-panel p-4 rounded-2xl flex flex-col gap-3 hover:bg-white/10 transition-colors group border border-white/5">
               <div className="flex justify-between items-start">
                   <div className="p-2.5 bg-green-500/20 text-green-400 rounded-xl group-hover:scale-110 transition-transform">
                     <Music size={18} />
                   </div>
                   <ArrowRight size={14} className="text-gray-600 group-hover:text-white -rotate-45" />
               </div>
               <div>
                 <h3 className="font-bold text-gray-200 text-sm">Comfort Playlist</h3>
                 <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">10 mins</p>
               </div>
            </a>
            <a href="sms:" className="glass-panel p-4 rounded-2xl flex flex-col gap-3 hover:bg-white/10 transition-colors group border border-white/5">
               <div className="flex justify-between items-start">
                   <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                     <MessageCircle size={18} />
                   </div>
                   <ArrowRight size={14} className="text-gray-600 group-hover:text-white -rotate-45" />
               </div>
               <div>
                 <h3 className="font-bold text-gray-200 text-sm">Reach Out</h3>
                 <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">Message Friend</p>
               </div>
            </a>
         </div>
      </div>

      {/* Yesterday */}
      <div className="glass-card p-5 rounded-2xl border border-white/5 mb-4">
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Yesterday Reflection</h2>
            <span className="text-[10px] font-mono text-gray-600 px-2 py-1 bg-white/5 rounded-md">{yesterdayDate}</span>
        </div>
        {yesterdayEntries.length > 0 ? (
             <div>
                <div className="flex items-center gap-3 mb-3">
                   <span className="text-3xl filter drop-shadow-lg">{yesterdayEntries[0].moodEmoji}</span>
                   <span className="text-gray-300 text-sm">You felt mostly <span className="text-white font-bold">{MOODS[yesterdayEntries[0].mood].label}</span></span>
                </div>
                <div className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed border-l-2 border-white/10 pl-3 italic">
                   "{yesterdayEntries[0].note || yesterdayEntries[0].context || 'No detailed notes added.'}"
                </div>
                <button onClick={() => onViewEntry(yesterdayEntries[0])} className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-violet-300 transition-colors">
                   View Full Entry
                </button>
             </div>
        ) : (
            <p className="text-gray-500 text-sm italic text-center py-2">No entry yesterday. Today is a fresh start!</p>
        )}
      </div>

      <button onClick={onViewCalendar} className="w-full py-4 text-gray-500 text-sm font-medium hover:text-white transition-colors mb-4">
        View Full Calendar
      </button>
    </div>
  );
};
