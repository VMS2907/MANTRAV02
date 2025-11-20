
import React, { useState } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Logo } from './Logo';

interface OnboardingProps {
  onComplete: (name: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');

  const next = () => setStep(s => s + 1);

  return (
    <div className="absolute inset-0 z-50 bg-[#09090B] flex flex-col animate-in fade-in duration-500">
      {step === 1 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 to-black"></div>
          
          <div className="relative z-10 flex flex-col items-center">
             <div className="mb-8 animate-in zoom-in duration-700">
                <Logo className="w-32 h-32 drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]" animated />
             </div>
             <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">Mantra</h1>
             <p className="text-xl text-violet-200 font-light mb-12">
                Your Daily Emotional Companion
             </p>
             <p className="text-gray-400 mb-8 max-w-xs font-light leading-relaxed">
                Track feelings. Understand patterns. <br/> Grow in silence.
             </p>
             <div className="w-full max-w-xs">
                <Button onClick={next} fullWidth className="shadow-[0_0_30px_rgba(139,92,246,0.4)]">
                    Start Your Journey
                </Button>
             </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in slide-in-from-right duration-300 overflow-y-auto">
          <div className="p-4 bg-violet-500/10 rounded-full mb-6 mt-4">
             <ShieldCheck size={48} className="text-violet-400" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Your Privacy Matters</h2>
          
          <div className="bg-white/5 p-5 rounded-2xl w-full max-w-xs space-y-4 text-left mb-8 border border-white/10 backdrop-blur-md">
            <div className="flex gap-4 items-start">
              <span className="text-xl">🔒</span>
              <div>
                <strong className="block text-gray-200 text-sm">Local First</strong>
                <p className="text-xs text-gray-500">Everything stays on YOUR device.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-xl">🤐</span>
              <div>
                <strong className="block text-gray-200 text-sm">Private AI</strong>
                <p className="text-xs text-gray-500">Insights are generated privately.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-xl">🗑️</span>
              <div>
                <strong className="block text-gray-200 text-sm">Total Control</strong>
                <p className="text-xs text-gray-500">Delete data anytime.</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xs mt-auto sm:mt-0 pb-8 sm:pb-0">
            <Button onClick={next} fullWidth variant="secondary">
                I Understand
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in slide-in-from-right duration-300">
           <h2 className="text-2xl font-bold text-white mb-2">What should we call you?</h2>
           <p className="text-gray-500 mb-12 text-center">This helps AI personalize your insights.</p>

           <input 
             type="text"
             placeholder="Your Name"
             value={name}
             onChange={(e) => setName(e.target.value)}
             className="w-full max-w-xs p-4 text-2xl text-center border-b-2 border-violet-500/50 focus:border-violet-500 focus:outline-none bg-transparent mb-12 text-white placeholder-gray-600 transition-colors"
             autoFocus
           />

           <div className="w-full max-w-xs space-y-4">
               <Button onClick={next} fullWidth disabled={!name.trim()}>
                 Continue
               </Button>
               <button onClick={next} className="w-full text-sm text-gray-500 hover:text-gray-300 transition-colors py-2">
                 Skip for now
               </button>
           </div>
        </div>
      )}

       {step === 4 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in slide-in-from-right duration-300">
          <h2 className="text-4xl font-bold text-white mb-4">Let's Start</h2>
          <p className="text-lg text-gray-400 mb-12">
            How are you feeling <span className="text-violet-400 font-bold text-glow">RIGHT NOW?</span>
          </p>
          
          <div className="w-full max-w-xs">
            <Button 
                onClick={() => onComplete(name || 'Friend')} 
                fullWidth 
                className="py-4 text-lg shadow-[0_0_30px_rgba(139,92,246,0.4)]"
            >
                Check In <ArrowRight className="ml-2 inline" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
