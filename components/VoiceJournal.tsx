
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Globe, RefreshCw } from 'lucide-react';

interface VoiceJournalProps {
  onTranscription: (text: string) => void;
  initialText?: string;
}

export const VoiceJournal: React.FC<VoiceJournalProps> = ({ onTranscription, initialText = '' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState(initialText);
  const [lang, setLang] = useState<'en-US' | 'hi-IN'>('en-US');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
    } else {
      setError("Voice recording not supported in this browser.");
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.lang = lang;
      recognitionRef.current.start();
      setIsRecording(true);

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        const newText = text + (text && !text.endsWith(' ') ? ' ' : '') + finalTranscript;
        if (finalTranscript) {
            setText(newText);
            onTranscription(newText);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error(event.error);
        setIsRecording(false);
      };
    }
  };

  const toggleLang = () => {
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    setLang(prev => prev === 'en-US' ? 'hi-IN' : 'en-US');
  };

  if (error) return <div className="text-red-400 text-xs p-2">{error}</div>;

  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-300 flex items-center gap-2">
          <Mic size={18} className="text-violet-400" />
          Voice Journal
        </h3>
        <button 
          onClick={toggleLang}
          className="text-xs flex items-center gap-1 px-2 py-1 bg-white/5 rounded-full text-gray-400 hover:bg-white/10 transition-colors"
        >
          <Globe size={12} />
          {lang === 'en-US' ? 'English' : 'Hindi'}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-6 bg-black/20 rounded-xl mb-4 relative overflow-hidden">
        {isRecording && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-violet-500/30 rounded-full animate-ping opacity-20"></div>
            <div className="w-16 h-16 bg-violet-500/40 rounded-full animate-ping opacity-30 absolute"></div>
          </div>
        )}
        
        <button
          onClick={toggleRecording}
          className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording 
              ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] scale-110' 
              : 'bg-violet-600 shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:bg-violet-500'
          }`}
        >
          {isRecording ? (
            <Square size={24} className="text-white fill-white" />
          ) : (
            <Mic size={28} className="text-white" />
          )}
        </button>
        
        <p className="mt-4 text-xs text-gray-500 font-medium">
          {isRecording ? 'Listening... Tap to stop' : 'Tap to record'}
        </p>
      </div>

      {text && (
        <div className="p-3 bg-white/5 rounded-lg text-sm text-gray-300 italic border-l-2 border-violet-500">
          "{text}"
        </div>
      )}
    </div>
  );
};
