
import React, { useState, useEffect, useMemo } from 'react';
import { X, ArrowLeft, Search, CheckCircle2, Mic, BookOpen, Save, Sparkles, PenLine, Calendar, Clock } from 'lucide-react';
import { MOOD_LIST, SECONDARY_EMOODS, CONTEXT_TAGS } from '../constants';
import { MoodType, MoodEntry } from '../types';
import { Button } from './Button';
import { VoiceJournal } from './VoiceJournal';
import { ReflectionLibrary } from './ReflectionLibrary';

interface CheckInFlowProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
  initialData?: MoodEntry;
}

type Step = 'primary' | 'secondary' | 'context' | 'diary' | 'success' | 'prompts';

interface StepWrapperProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: string;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

const StepWrapper: React.FC<StepWrapperProps> = ({ children, title, subtitle, footer, noPadding = false }) => (
  <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Scrollable Content */}
      <div className={`flex-1 overflow-y-auto no-scrollbar ${noPadding ? '' : 'px-6'} pt-4 pb-32`}>
          {title && <h2 className="text-2xl sm:text-3xl font-light text-center text-white mb-2 mt-4 animate-in slide-in-from-bottom-2 duration-500">{title}</h2>}
          {subtitle && <p className="text-center text-gray-400 mb-8 font-light text-sm animate-in slide-in-from-bottom-3 duration-500 delay-75">{subtitle}</p>}
          <div className="animate-in fade-in duration-500 delay-100">
             {children}
          </div>
      </div>
      {/* Fixed Footer */}
      {footer && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#09090B] via-[#09090B] to-transparent z-20">
              {footer}
          </div>
      )}
  </div>
);

export const CheckInFlow: React.FC<CheckInFlowProps> = ({ onComplete, onCancel, initialData }) => {
  const [step, setStep] = useState<Step>('primary');
  
  // Form Data
  const [primaryMood, setPrimaryMood] = useState<MoodType | null>(initialData?.mood || null);
  const [secondaryMoods, setSecondaryMoods] = useState<string[]>(initialData?.secondaryMoods || []);
  const [context, setContext] = useState(initialData?.context || '');
  
  const getCleanNote = (note: string = '') => {
    if (!note) return '';
    const splitKey = '\n\n[Voice Transcript]:';
    return note.includes(splitKey) ? note.split(splitKey)[0] : note;
  };

  const [note, setNote] = useState(getCleanNote(initialData?.note));
  const [transcription, setTranscription] = useState(initialData?.transcription || '');
  const [isQuickSave, setIsQuickSave] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic Placeholders
  const diaryPlaceholders = useMemo(() => [
    "Unburden your mind...",
    "What is the story behind this feeling?",
    "Let the thoughts flow freely...",
    "No judgment, just you and the page.",
    "What does this emotion want to tell you?",
    "Capture this moment before it fades...",
    "Writing is listening to yourself."
  ], []);

  const [placeholder, setPlaceholder] = useState(diaryPlaceholders[0]);

  useEffect(() => {
    setPlaceholder(diaryPlaceholders[Math.floor(Math.random() * diaryPlaceholders.length)]);
  }, [step, diaryPlaceholders]);

  const filteredSecondaryMoods = SECONDARY_EMOODS.filter(m => 
    m.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSecondary = (id: string) => {
    if (secondaryMoods.includes(id)) {
      setSecondaryMoods(secondaryMoods.filter(s => s !== id));
    } else {
      if (secondaryMoods.length < 5) {
        setSecondaryMoods([...secondaryMoods, id]);
      }
    }
  };

  const handleFinish = (quick: boolean = false) => {
    setIsQuickSave(quick);
    setStep('success');
    setTimeout(() => {
      onComplete({
        mood: primaryMood,
        secondaryMoods,
        context,
        note: note + (transcription ? `\n\n[Voice Transcript]: ${transcription}` : ''),
        transcription,
        isQuickMoment: quick
      });
    }, 1500);
  };

  const renderPrimary = () => (
    <StepWrapper 
        title={initialData ? "Recall the moment." : "Center yourself."}
        subtitle="How does your spirit feel right now?"
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-sm mx-auto w-full mb-8 mt-2">
        {MOOD_LIST.map((m) => (
          <button
            key={m.value}
            onClick={() => {
              setPrimaryMood(m.value);
              setStep('secondary');
            }}
            className={`
                aspect-square rounded-3xl transition-all duration-500 flex flex-col items-center justify-center gap-2 sm:gap-4 group relative overflow-hidden
                ${primaryMood === m.value 
                    ? 'bg-white/10 border-violet-500/50 shadow-[0_0_30px_rgba(139,92,246,0.2)] scale-105' 
                    : 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 hover:scale-[1.02]'
                }
            `}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-${m.color}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <span className="text-4xl sm:text-6xl filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)">{m.emoji}</span>
            <span className={`font-medium tracking-wide text-sm sm:text-base ${primaryMood === m.value ? 'text-white' : 'text-gray-400'} group-hover:text-white transition-colors`}>{m.label}</span>
          </button>
        ))}
      </div>
    </StepWrapper>
  );

  const renderSecondary = () => (
    <StepWrapper
        title={
            <span>
                 {initialData ? "You felt " : "You're feeling "} 
                 <span className="font-semibold text-violet-400">{MOOD_LIST.find(m => m.value === primaryMood)?.label}</span>
            </span>
        }
        subtitle="Add nuance to your emotion (Max 5)"
        footer={<Button onClick={() => setStep('context')} fullWidth>Continue</Button>}
    >
      <div className="text-6xl mb-8 text-center animate-[bounce_3s_infinite] filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
        {MOOD_LIST.find(m => m.value === primaryMood)?.emoji}
      </div>
      
      <div className="relative mb-6 group sticky top-0 z-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors" size={18} />
        <input 
          type="text"
          placeholder="Search emotions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-[#18181b]/90 backdrop-blur-xl border border-white/10 rounded-2xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all shadow-lg"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 pb-4">
          {filteredSecondaryMoods.map((m) => {
            const isSelected = secondaryMoods.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleSecondary(m.id)}
                className={`
                  p-2 sm:p-3 py-3 sm:py-4 rounded-2xl text-[10px] sm:text-xs font-medium transition-all border flex flex-col items-center gap-1 sm:gap-2
                  ${isSelected 
                    ? 'bg-violet-600 text-white border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.4)] scale-105 z-10' 
                    : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200'
                  }
                `}
              >
                <span className="text-xl sm:text-2xl filter drop-shadow-md">{m.emoji}</span>
                <span className="truncate w-full text-center leading-tight">{m.label}</span>
              </button>
            );
          })}
      </div>
    </StepWrapper>
  );

  const renderContext = () => (
    <StepWrapper
        title="What's happening?"
        subtitle="Context helps AI find patterns."
        footer={
            <div className="space-y-3">
                 <Button onClick={() => handleFinish(true)} fullWidth variant="secondary" className="bg-white/5 border-white/10 backdrop-blur-lg">
                    Save Quick Moment
                 </Button>
                 <Button onClick={() => setStep('diary')} fullWidth className="shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                    Deep Dive (Diary)
                 </Button>
            </div>
        }
    >
      <div className="mt-6 mb-8">
        <div className="relative">
            <input 
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., Just finished lunch..."
            className="w-full bg-transparent border-b-2 border-white/20 p-4 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-all text-xl text-center font-light"
            autoFocus
            />
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/5"></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 justify-center max-w-sm mx-auto">
        {CONTEXT_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setContext(tag === context ? '' : tag)}
            className={`
              px-4 py-2 rounded-full text-xs sm:text-sm transition-all border
              ${context === tag 
                ? 'bg-white text-black border-white font-medium scale-105 shadow-lg' 
                : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:bg-white/10'
              }
            `}
          >
            {tag}
          </button>
        ))}
      </div>
    </StepWrapper>
  );

  const renderDiary = () => (
    <StepWrapper
        noPadding
        footer={<Button onClick={() => handleFinish(false)} fullWidth className="shadow-[0_0_30px_rgba(139,92,246,0.3)]">Save Entry</Button>}
    >
       <div className="px-6 pt-4">
         {/* Header Info */}
         <div className="flex items-center justify-between mb-6 opacity-70">
            <div className="flex items-center gap-2 text-violet-300 text-xs font-medium uppercase tracking-widest">
                <Calendar size={12} />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                <Clock size={12} />
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
         </div>

         {/* Toolbar */}
         <div className="flex gap-2 mb-4">
            <button 
                onClick={() => setShowVoice(!showVoice)} 
                className={`flex-1 py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 text-sm font-medium ${showVoice ? 'bg-violet-500/20 border-violet-500/50 text-violet-300' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
            >
                <Mic size={16} /> Voice Note
            </button>
            <button 
                onClick={() => setStep('prompts')}
                className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
                <Sparkles size={16} /> Prompts
            </button>
         </div>

         {showVoice && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                <VoiceJournal onTranscription={setTranscription} initialText={transcription} />
            </div>
         )}
       </div>

       {/* Writing Area - Zen Mode */}
       <div className="flex-1 relative px-6 group min-h-[300px]">
         <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full bg-transparent border-none text-gray-100 placeholder-gray-700 resize-none focus:outline-none text-lg leading-relaxed font-light font-sans selection:bg-violet-500/30"
            style={{ minHeight: '100%' }}
            autoFocus
         />
         {/* Subtle writing lines visual decoration */}
         <div className="absolute inset-0 px-6 pointer-events-none opacity-[0.03] bg-[linear-gradient(transparent_31px,#fff_32px)] bg-[length:100%_32px] top-[5px]"></div>
         
         <div className="absolute bottom-4 right-6 text-[10px] text-gray-600 font-mono transition-opacity opacity-50 group-focus-within:opacity-100">
            {note.length} characters
         </div>
       </div>
    </StepWrapper>
  );

  const renderPrompts = () => (
     <div className="h-full flex flex-col relative">
        <div className="p-6 pb-0">
           <button onClick={() => setStep('diary')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-2">
              <ArrowLeft size={16} /> Back to Editor
           </button>
        </div>
        <ReflectionLibrary 
            currentMood={primaryMood || undefined}
            onSelectPrompt={(p) => {
               setNote(prev => prev ? prev + "\n\n" + p + "\n" : p + "\n");
               setStep('diary');
            }} 
        />
     </div>
  );

  const renderSuccess = () => (
    <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-500 px-8 text-center">
      <div className="relative mb-8">
         <div className="absolute inset-0 bg-green-500 blur-[60px] opacity-20 rounded-full"></div>
         <CheckCircle2 size={100} className="text-green-400 relative z-10 drop-shadow-[0_0_20px_rgba(74,222,128,0.4)]" strokeWidth={1} />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{isQuickSave ? "Moment Captured" : "Entry Logged"}</h2>
      <p className="text-gray-400 font-light">Your emotional journey is safe with us.</p>
    </div>
  );

  if (step === 'prompts') return renderPrompts();

  return (
    <div className="h-full flex flex-col bg-[#09090B] relative">
      {/* Header */}
      {step !== 'success' && (
        <div className="flex items-center justify-between px-6 pt-6 pb-2 z-10 shrink-0">
          {step === 'primary' ? (
            <button onClick={onCancel} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 transition-colors">
                <X size={20} />
            </button>
          ) : (
            <button 
              onClick={() => {
                  if (step === 'secondary') setStep('primary');
                  if (step === 'context') setStep('secondary');
                  if (step === 'diary') setStep('context');
              }}
              className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 transition-colors"
            >
                <ArrowLeft size={20} />
            </button>
          )}
          
          {/* Sleek Progress Bar */}
          <div className="flex gap-1.5">
             {['primary', 'secondary', 'context', 'diary'].map((s) => (
                <div 
                    key={s} 
                    className={`h-1 rounded-full transition-all duration-700 ease-out ${
                        step === s 
                        ? 'w-8 bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]' 
                        : ['primary', 'secondary', 'context', 'diary'].indexOf(s) < ['primary', 'secondary', 'context', 'diary'].indexOf(step)
                            ? 'w-2 bg-violet-900'
                            : 'w-2 bg-white/10'
                    }`} 
                />
             ))}
          </div>

          <div className="w-10" /> {/* Spacer */}
        </div>
      )}

      {step === 'primary' && renderPrimary()}
      {step === 'secondary' && renderSecondary()}
      {step === 'context' && renderContext()}
      {step === 'diary' && renderDiary()}
      {step === 'success' && renderSuccess()}
    </div>
  );
};
