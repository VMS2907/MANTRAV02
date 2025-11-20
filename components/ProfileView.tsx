
import React from 'react';
import { UserProfile, MoodEntry } from '../types';
import { MENTAL_HEALTH_RESOURCES, MOODS } from '../constants';
import { Settings, Phone, Heart, BarChart3, LogOut } from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile | null;
  entries: MoodEntry[];
  onReset: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, entries, onReset }) => {
  const moodCounts = entries.reduce((acc, curr) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostFrequentMood = Object.entries(moodCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0];
  
  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto no-scrollbar pb-28">
      <h2 className="text-2xl font-bold text-white mb-6">You</h2>

      {/* Profile Card */}
      <div className="glass-card p-5 rounded-2xl mb-6 flex items-center gap-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-violet-500/20 rounded-full flex items-center justify-center text-2xl border border-violet-500/30 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.2)] shrink-0">
          {profile?.name?.[0] || 'U'}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-lg text-white truncate">{profile?.name}</h3>
          <p className="text-sm text-gray-500">Joined {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}</p>
        </div>
        <div className="ml-auto">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Settings size={20} className="text-gray-400" />
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20">
            <div className="text-2xl font-bold text-orange-400 mb-1 text-glow">{profile?.streak}</div>
            <div className="text-[10px] text-orange-500/60 font-medium uppercase tracking-wide">Current Streak</div>
        </div>
        <div className="bg-violet-500/10 p-4 rounded-2xl border border-violet-500/20">
            <div className="text-2xl font-bold text-violet-400 mb-1 text-glow">{entries.length}</div>
            <div className="text-[10px] text-violet-500/60 font-medium uppercase tracking-wide">Total Entries</div>
        </div>
      </div>

      {/* Quick Analytics */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Your Emotions</h3>
        <div className="glass-card rounded-2xl p-5">
            {entries.length > 0 ? (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-400">Most frequent:</span>
                        <span className="flex items-center gap-2 font-medium text-white">
                            {mostFrequentMood && MOODS[mostFrequentMood as any]?.emoji} 
                            {mostFrequentMood && MOODS[mostFrequentMood as any]?.label}
                        </span>
                    </div>
                    <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden flex">
                        {Object.entries(moodCounts).map(([mood, count]) => (
                            <div 
                                key={mood}
                                style={{ width: `${((count as number) / entries.length) * 100}%`, backgroundColor: MOODS[mood as any]?.color }}
                                className="h-full opacity-80"
                            />
                        ))}
                    </div>
                    <div className="mt-3 flex gap-3 flex-wrap">
                         {Object.entries(moodCounts).sort((a, b) => (b[1] as number) - (a[1] as number)).slice(0, 3).map(([mood, count]) => (
                            <div key={mood} className="text-xs flex items-center gap-1 text-gray-400">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MOODS[mood as any]?.color }} />
                                {MOODS[mood as any]?.label} ({Math.round((count as number)/entries.length * 100)}%)
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center text-gray-500 text-sm">Log moods to see stats</div>
            )}
        </div>
      </div>

      {/* Coping Strategies (Mock) */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Top Coping Strategies</h3>
        <div className="space-y-3">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                <div className="p-2 bg-green-500/20 text-green-400 rounded-lg shrink-0"><Heart size={16} /></div>
                <div className="flex-1">
                    <div className="font-medium text-sm text-gray-200">Talking to friends</div>
                    <div className="text-xs text-gray-500">Worked 78% of the time</div>
                </div>
            </div>
             <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg shrink-0"><BarChart3 size={16} /></div>
                <div className="flex-1">
                    <div className="font-medium text-sm text-gray-200">Deep Breathing</div>
                    <div className="text-xs text-gray-500">Worked 67% of the time</div>
                </div>
            </div>
        </div>
      </div>

      {/* Crisis Resources */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Support</h3>
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl overflow-hidden">
            {MENTAL_HEALTH_RESOURCES.map((res, i) => (
                <div key={res.name} className={`p-4 flex items-center justify-between ${i !== MENTAL_HEALTH_RESOURCES.length - 1 ? 'border-b border-red-500/10' : ''}`}>
                    <div>
                        <div className="font-bold text-red-400 text-sm">{res.name}</div>
                        <div className="text-xs text-red-500/60">{res.desc}</div>
                    </div>
                    <a href={`tel:${res.phone}`} className="p-2 bg-red-500/10 rounded-full text-red-400 hover:bg-red-500/20 transition-colors">
                        <Phone size={16} />
                    </a>
                </div>
            ))}
        </div>
      </div>

      <button 
        onClick={onReset}
        className="w-full p-4 text-red-400 text-sm font-medium hover:bg-red-500/10 rounded-xl flex items-center justify-center gap-2 transition-colors mb-6"
      >
        <LogOut size={16} /> Reset All Data
      </button>
    </div>
  );
};
