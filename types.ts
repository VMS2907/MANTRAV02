
export type MoodType = 'great' | 'good' | 'okay' | 'low' | 'anxious' | 'sad';

export interface MoodConfig {
  label: string;
  emoji: string;
  color: string; // Hex code
  value: MoodType;
  intensity: number; // 1-5 scale (mapped roughly)
}

export interface SecondaryMood {
  id: string;
  label: string;
  emoji: string;
}

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  mood: MoodType;
  moodEmoji: string;
  secondaryMoods: string[]; // IDs of secondary moods
  context: string; // "Exam tomorrow", etc.
  note: string; // Full diary entry
  transcription?: string; // Voice journal text
  timestamp: number;
  isCrisis?: boolean; // Flagged by keywords
  isQuickMoment?: boolean; // Feature 2: Distinguish quick checks from full entries
}

export interface Intention {
  id: string;
  text: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
}

export type InsightType = 'pattern_detection' | 'temporal_patterns' | 'emotional_complexity' | 'what_helps' | 'predictions' | 'diary_themes';

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  content: string;
  data?: any; // Type-specific data for visualizations
  expiry?: number;
}

export interface UserProfile {
  name: string;
  onboarded: boolean;
  streak: number;
  lastCheckIn: number;
  createdAt: number;
  preferences: {
    language: 'en' | 'hi';
    theme: 'light' | 'dark';
  };
}

export interface CopingStrategy {
  id: string;
  title: string;
  targetEmotion: MoodType;
  successRate: number;
  timesTried: number;
}

export type ViewState = 'today' | 'calendar' | 'checkin' | 'insights' | 'profile' | 'moments' | 'prompts';
