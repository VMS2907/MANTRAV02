import React, { useState } from 'react';
import { MoodType } from '../types';
import { MOOD_LIST } from '../constants';
import { Button } from './Button';
import { X, CheckCircle2 } from 'lucide-react';

interface MoodCheckInProps {
  onSave: (mood: MoodType, note: string) => void;
  onCancel: () => void;
}

export const MoodCheckIn: React.FC<MoodCheckInProps> = ({ onSave, onCancel }) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = () => {
    if (selectedMood) {
      setIsSubmitting(true);
      // Simulate network request
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        
        // Wait for success animation then trigger save
        setTimeout(() => {
          onSave(selectedMood, note);
        }, 1000);
      }, 600);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-white p-8 animate-in fade-in duration-300">
        <div className="transform scale-150 mb-6 text-green-500 animate-in zoom-in duration-500">
          <CheckCircle2 size={64} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mood logged!</h2>
        <p className="text-gray-500">Keep up the great work.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white sm:rounded-3xl overflow-hidden shadow-sm relative animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Daily Check-in</h2>
        <button onClick={onCancel} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        <h3 className="text-2xl font-medium text-gray-700 text-center mb-8 mt-4">
          How are you feeling today?
        </h3>

        {/* Mood Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-md mb-8">
          {MOOD_LIST.map((moodItem) => {
            const isSelected = selectedMood === moodItem.value;
            return (
              <button
                key={moodItem.value}
                onClick={() => setSelectedMood(moodItem.value)}
                className={`
                  relative p-4 rounded-2xl transition-all duration-200 flex flex-col items-center gap-2 border-2
                  ${isSelected 
                    ? 'border-[#8B7FDE] bg-[#8B7FDE]/10 scale-105 shadow-md' 
                    : 'border-transparent bg-gray-50 hover:bg-gray-100 hover:scale-102'
                  }
                `}
              >
                <span className="text-4xl filter drop-shadow-sm">{moodItem.emoji}</span>
                <span className={`font-medium ${isSelected ? 'text-[#8B7FDE]' : 'text-gray-600'}`}>
                  {moodItem.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Note Section (Conditional) */}
        <div className={`w-full max-w-md transition-all duration-500 overflow-hidden ${selectedMood ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">
            Want to add a note? (Optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="I'm feeling this way because..."
            className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#8B7FDE]/50 resize-none h-32 text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-6 border-t border-gray-100 bg-white/80 backdrop-blur-sm sticky bottom-0">
        <Button 
          fullWidth 
          disabled={!selectedMood} 
          onClick={handleSave}
          loading={isSubmitting}
        >
          Save Entry
        </Button>
      </div>
    </div>
  );
};
