
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, PlusCircle, Sparkles, User, LayoutDashboard } from 'lucide-react';
import { CalendarView } from './components/CalendarView';
import { CheckInFlow } from './components/CheckInFlow';
import { InsightsView } from './components/InsightsView';
import { ProfileView } from './components/ProfileView';
import { Onboarding } from './components/Onboarding';
import { TodayView } from './components/TodayView';
import { MomentsView } from './components/MomentsView';
import { MoodEntry, ViewState, UserProfile, Intention, Insight } from './types';
import { generateId, formatDate, formatTime, MOODS, CRISIS_KEYWORDS } from './constants';
import { Logo } from './components/Logo';
import { generateInsights } from './services/aiService';

export default function App() {
  // STATE
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('today'); // Default to Today
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [intention, setIntention] = useState<Intention | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  // Edit/Add specific date state
  const [targetDate, setTargetDate] = useState<string>(formatDate(new Date()));
  const [editingEntry, setEditingEntry] = useState<MoodEntry | undefined>(undefined);
  
  // Persistence Load
  useEffect(() => {
    const loadData = () => {
      try {
        const savedEntries = localStorage.getItem('mantra_entries');
        const savedProfile = localStorage.getItem('mantra_profile');
        const savedIntention = localStorage.getItem('mantra_intention');
        const savedInsights = localStorage.getItem('mantra_insights');
        
        if (savedEntries) setEntries(JSON.parse(savedEntries));
        if (savedProfile) setUserProfile(JSON.parse(savedProfile));
        if (savedInsights) setInsights(JSON.parse(savedInsights));
        if (savedIntention) {
           const parsedIntention = JSON.parse(savedIntention);
           // Reset intention if not from today
           if (parsedIntention.date === formatDate(new Date())) {
             setIntention(parsedIntention);
           }
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Persistence Save
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('mantra_entries', JSON.stringify(entries));
    }
  }, [entries, isLoading]);

  useEffect(() => {
    if (!isLoading && userProfile) {
      localStorage.setItem('mantra_profile', JSON.stringify(userProfile));
    }
  }, [userProfile, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('mantra_insights', JSON.stringify(insights));
    }
  }, [insights, isLoading]);

  useEffect(() => {
     if (!isLoading) {
       if (intention) localStorage.setItem('mantra_intention', JSON.stringify(intention));
       else localStorage.removeItem('mantra_intention');
     }
  }, [intention, isLoading]);

  const handleOnboardingComplete = (name: string) => {
    const newProfile: UserProfile = {
      name,
      onboarded: true,
      streak: 0,
      lastCheckIn: 0,
      createdAt: Date.now(),
      preferences: { language: 'en', theme: 'light' }
    };
    setUserProfile(newProfile);
    setCurrentView('today');
  };

  const checkForCrisis = (text: string) => {
    return CRISIS_KEYWORDS.some(keyword => text.toLowerCase().includes(keyword));
  };

  const handleGenerateInsights = async () => {
    if (entries.length === 0) return;
    setIsGeneratingInsights(true);
    try {
      const results = await generateInsights(entries, userProfile?.name || 'Friend');
      setInsights(results);
    } catch (error) {
      console.error("Insight generation failed", error);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  // View switching handlers
  const startCheckIn = (date: string = formatDate(new Date())) => {
      setTargetDate(date);
      setEditingEntry(undefined);
      setCurrentView('checkin');
  };

  const startEdit = (entry: MoodEntry) => {
      setTargetDate(entry.date);
      setEditingEntry(entry);
      setCurrentView('checkin');
  };

  const handleSaveEntry = (data: any) => {
    const isCrisis = checkForCrisis(data.note);
    
    if (isCrisis) {
        setCrisisDetected(true);
    }

    if (editingEntry) {
        // Update existing entry
        const updatedEntry: MoodEntry = {
            ...editingEntry,
            mood: data.mood,
            moodEmoji: MOODS[data.mood].emoji,
            secondaryMoods: data.secondaryMoods,
            context: data.context,
            note: data.note,
            transcription: data.transcription,
            isCrisis,
            isQuickMoment: data.isQuickMoment
        };
        setEntries(prev => prev.map(e => e.id === editingEntry.id ? updatedEntry : e));
    } else {
        // Create new entry
        const newEntry: MoodEntry = {
            id: generateId(),
            date: targetDate, // Use the selected date
            time: formatTime(new Date()),
            mood: data.mood,
            moodEmoji: MOODS[data.mood].emoji,
            secondaryMoods: data.secondaryMoods,
            context: data.context,
            note: data.note,
            transcription: data.transcription,
            timestamp: Date.now(),
            isCrisis,
            isQuickMoment: data.isQuickMoment
        };

        // Update Streak
        let newStreak = userProfile?.streak || 0;
        const lastCheckInDate = userProfile ? new Date(userProfile.lastCheckIn) : new Date(0);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastCheckInDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays <= 1 && diffDays > 0) newStreak += 1; // Continued streak
        else if (diffDays > 2) newStreak = 1; // Broken streak reset
        else if (newStreak === 0) newStreak = 1; // First streak

        if (userProfile) {
            setUserProfile({
                ...userProfile,
                streak: newStreak,
                lastCheckIn: Date.now()
            });
        }

        setEntries(prev => [...prev, newEntry]);
    }

    // Reset
    setEditingEntry(undefined);
    setTargetDate(formatDate(new Date()));
    setCurrentView('today');
  };

  const handleReset = () => {
      if(confirm("Delete all data? This cannot be undone.")) {
        localStorage.clear();
        window.location.reload();
    }
  };

  const saveIntention = (text: string) => {
     setIntention({
        id: generateId(),
        text,
        completed: false,
        date: formatDate(new Date())
     });
  };

  const toggleIntention = () => {
     if (intention) setIntention({ ...intention, completed: !intention.completed });
  };

  if (isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center font-sans selection:bg-violet-500/30 selection:text-violet-200 overflow-hidden">
      {/* Main Mobile Container - Optimized for dvh */}
      <div className="w-full max-w-md bg-[#09090B] h-[100dvh] sm:h-[90vh] sm:rounded-[40px] sm:shadow-[0_0_50px_rgba(255,255,255,0.05)] sm:border-[1px] sm:border-white/10 overflow-hidden relative flex flex-col">
        
        {/* Background Ambiance */}
        <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[40%] bg-violet-900/20 blur-[80px] rounded-full pointer-events-none transform-gpu z-0"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-blue-900/10 blur-[80px] rounded-full pointer-events-none transform-gpu z-0"></div>

        {/* Onboarding Overlay */}
        {(!userProfile || !userProfile.onboarded) && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}

        {/* Crisis Modal */}
        {crisisDetected && (
            <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="glass-card rounded-3xl p-6 text-center shadow-2xl max-w-sm border border-red-500/20 w-full">
                    <h2 className="text-2xl font-bold text-white mb-2">We care about you</h2>
                    <p className="text-gray-400 mb-6">We noticed you might be going through a hard time. You don't have to face this alone.</p>
                    <div className="space-y-3">
                        <a href="tel:1800-233-3330" className="block w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 transition-colors">
                            Call Helpline (24/7)
                        </a>
                        <button onClick={() => setCrisisDetected(false)} className="block w-full py-3 text-gray-400 hover:bg-white/5 rounded-xl font-medium">
                            I'm OK, continue
                        </button>
                    </div>
                </div>
            </div>
        )}
        
        {/* Header Logo */}
        {currentView !== 'checkin' && !(!userProfile || !userProfile.onboarded) && (
          <div className="absolute top-0 left-0 w-full px-6 pt-6 pb-2 z-20 bg-gradient-to-b from-[#09090B] via-[#09090B]/90 to-transparent pointer-events-none">
             <div className="flex items-center gap-3 opacity-90">
                <Logo className="w-8 h-8 text-violet-500" />
                <span className="font-bold text-white tracking-widest text-sm uppercase font-outfit">Mantra</span>
             </div>
          </div>
        )}

        {/* View Content Area */}
        <div className={`flex-1 relative overflow-hidden flex flex-col z-10 ${currentView !== 'checkin' && currentView !== 'moments' ? 'pt-16' : ''}`}>
           
           {currentView === 'today' && (
             <TodayView 
               userProfile={userProfile}
               entries={entries}
               insights={insights}
               onCheckIn={() => startCheckIn()}
               onViewEntry={startEdit}
               onViewCalendar={() => setCurrentView('calendar')}
               intention={intention}
               onSaveIntention={saveIntention}
               onToggleIntention={toggleIntention}
               onGenerateForecast={handleGenerateInsights}
               isGeneratingForecast={isGeneratingInsights}
             />
           )}

           {currentView === 'calendar' && (
             <CalendarView 
                entries={entries} 
                onSelectDate={(date) => {
                   setTargetDate(date);
                   setCurrentView('moments');
                }} 
                onAddToday={() => startCheckIn()} 
                onAddEntry={(date) => startCheckIn(date)}
                onEditEntry={startEdit}
             />
           )}

           {currentView === 'moments' && (
             <MomentsView 
               entries={entries}
               selectedDate={targetDate}
               onClose={() => setCurrentView('calendar')}
               onAddMoment={() => startCheckIn(targetDate)}
             />
           )}
           
           {currentView === 'checkin' && (
             <CheckInFlow 
               onComplete={handleSaveEntry}
               onCancel={() => setCurrentView('today')}
               initialData={editingEntry}
             />
           )}

           {currentView === 'insights' && (
             <InsightsView 
                entries={entries} 
                userName={userProfile?.name || 'Friend'}
                insights={insights}
                onGenerate={handleGenerateInsights}
                isLoading={isGeneratingInsights}
             />
           )}

            {currentView === 'profile' && (
             <ProfileView profile={userProfile} entries={entries} onReset={handleReset} />
           )}
        </div>

        {/* Bottom Navigation Bar */}
        {currentView !== 'checkin' && currentView !== 'moments' && (
          <nav className="glass-panel border-t border-white/5 px-6 py-4 pb-8 sm:pb-4 flex justify-between items-center absolute bottom-0 w-full z-30 backdrop-blur-xl bg-[#09090B]/80">
            
            <button 
              onClick={() => setCurrentView('today')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentView === 'today' ? 'text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)] scale-105' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <LayoutDashboard size={24} strokeWidth={currentView === 'today' ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide">Today</span>
            </button>

            <button 
              onClick={() => setCurrentView('calendar')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentView === 'calendar' ? 'text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)] scale-105' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <CalendarIcon size={24} strokeWidth={currentView === 'calendar' ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide">Calendar</span>
            </button>

            <button 
              onClick={() => startCheckIn()}
              className="bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white p-4 rounded-full -mt-10 shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all active:scale-95 hover:scale-110 hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] ring-4 ring-[#09090B] z-40 relative group"
            >
              <PlusCircle size={28} />
              <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20 group-hover:opacity-40"></div>
            </button>

            <button 
              onClick={() => setCurrentView('insights')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentView === 'insights' ? 'text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)] scale-105' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Sparkles size={24} strokeWidth={currentView === 'insights' ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide">Insights</span>
            </button>

            <button 
              onClick={() => setCurrentView('profile')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentView === 'profile' ? 'text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)] scale-105' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <User size={24} strokeWidth={currentView === 'profile' ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide">You</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
