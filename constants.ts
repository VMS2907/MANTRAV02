
import { MoodConfig, MoodType, SecondaryMood } from './types';

// Neon Pastels for Dark Mode
export const MOODS: Record<MoodType, MoodConfig> = {
  great: { label: 'Great', emoji: '🤩', color: '#FACC15', value: 'great', intensity: 5 }, // Yellow-400
  good: { label: 'Good', emoji: '🙂', color: '#4ADE80', value: 'good', intensity: 4 }, // Green-400
  okay: { label: 'Okay', emoji: '😐', color: '#22D3EE', value: 'okay', intensity: 3 }, // Cyan-400
  low: { label: 'Low', emoji: '😔', color: '#A78BFA', value: 'low', intensity: 2 }, // Violet-400
  anxious: { label: 'Anxious', emoji: '😰', color: '#FB923C', value: 'anxious', intensity: 1 }, // Orange-400
  sad: { label: 'Sad', emoji: '😢', color: '#60A5FA', value: 'sad', intensity: 1 }, // Blue-400
};

export const BRAND_COLOR = '#8B5CF6'; // Violet 500
export const BG_COLOR = '#09090B'; // Zinc 950

export const MOOD_LIST = Object.values(MOODS);

export const SECONDARY_EMOODS: SecondaryMood[] = [
  // High Energy / Negative
  { id: 'frustrated', label: 'Frustrated', emoji: '😤' },
  { id: 'angry', label: 'Angry', emoji: '😠' },
  { id: 'furious', label: 'Furious', emoji: '🤬' },
  { id: 'irritated', label: 'Irritated', emoji: '🙄' },
  { id: 'defensive', label: 'Defensive', emoji: '🛡️' },
  // High Energy / Positive
  { id: 'excited', label: 'Excited', emoji: '⚡' },
  { id: 'mindblown', label: 'Mind-blown', emoji: '🤯' },
  { id: 'empowered', label: 'Empowered', emoji: '🔥' },
  { id: 'confident', label: 'Confident', emoji: '😎' },
  { id: 'silly', label: 'Silly', emoji: '🤪' },
  // Low Energy / Negative
  { id: 'tired', label: 'Tired', emoji: '🥱' },
  { id: 'exhausted', label: 'Exhausted', emoji: '😫' },
  { id: 'heartbroken', label: 'Heartbroken', emoji: '💔' },
  { id: 'disappointed', label: 'Disappointed', emoji: '😞' },
  { id: 'lonely', label: 'Lonely', emoji: '🌑' },
  { id: 'guilty', label: 'Guilty', emoji: '😓' },
  { id: 'regretful', label: 'Regretful', emoji: '🥀' },
  { id: 'hurt', label: 'Hurt', emoji: '🤕' },
  { id: 'sleepy', label: 'Sleepy', emoji: '💤' },
  { id: 'bored', label: 'Bored', emoji: '😶' },
  { id: 'numb', label: 'Numb', emoji: '🌫️' },
  // High Stress / Fear
  { id: 'scared', label: 'Scared', emoji: '😨' },
  { id: 'overwhelmed', label: 'Overwhelmed', emoji: '🌊' },
  { id: 'stressed', label: 'Stressed', emoji: '😫' },
  { id: 'pressured', label: 'Pressured', emoji: '💣' },
  { id: 'worried', label: 'Worried', emoji: '😟' },
  { id: 'shocked', label: 'Shocked', emoji: '⚡' },
  { id: 'uncertain', label: 'Uncertain', emoji: '🤔' },
  { id: 'vulnerable', label: 'Vulnerable', emoji: '🥺' },
  { id: 'uneasy', label: 'Uneasy', emoji: '😬' },
  { id: 'tense', label: 'Tense', emoji: '😖' },
  // Positive / Calm
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'peaceful', label: 'Peaceful', emoji: '🕊️' },
  { id: 'hopeful', label: 'Hopeful', emoji: '✨' },
  { id: 'grateful', label: 'Grateful', emoji: '🙏' },
  { id: 'relieved', label: 'Relieved', emoji: '😅' },
];

export const CONTEXT_TAGS = [
  "Academic stress", "Family pressure", "Work deadline", "Relationship",
  "Money worries", "Health", "Social battery", "Future anxiety",
  "Travel", "Exercise", "Party", "Date", "Sleep", "Weather"
];

export const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end it all", "better off dead", "no point living", 
  "self harm", "cutting", "hurting myself", "want to die"
];

export const MENTAL_HEALTH_RESOURCES = [
  { name: "Vandrevala Foundation", phone: "1860-2662-345", desc: "24/7 Crisis Support" },
  { name: "iCall", phone: "9152987821", desc: "Mon-Sat, 8 AM-10 PM" },
  { name: "AASRA", phone: "+91-9820466726", desc: "24/7 Helpline" },
];

// Helper to get UUID
export const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to format date as YYYY-MM-DD
export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const REFLECTION_PROMPTS = [
  {
    category: "🌟 Gratitude",
    prompts: [
      "What's one thing you're grateful for today?",
      "Who made your day a little better?",
      "What's something you often take for granted?",
      "Name 3 small things that went well today",
      "What's a comfort you have that others might not?",
      "Who showed up for you this week?",
      "What ability/skill are you thankful you have?"
    ]
  },
  {
    category: "🎯 Self-Discovery",
    prompts: [
      "What does your ideal day look like?",
      "What are three words that describe you best?",
      "When do you feel most like yourself?",
      "What is a boundary you need to set?",
      "What advice would you give your younger self?",
      "What brings you energy vs what drains you?"
    ]
  },
  {
    category: "🌊 Emotional Processing",
    prompts: [
      "What emotion are you avoiding right now?",
      "If this feeling had a color, what would it be and why?",
      "What triggered this mood today?",
      "How does this emotion feel physically in your body?",
      "What do you need most right now?"
    ]
  },
  {
    category: "👨‍👩‍👦 Relationships",
    prompts: [
      "Who do you feel safest with?",
      "Is there a conversation you've been avoiding?",
      "How have you been a good friend recently?",
      "What quality do you value most in others?"
    ]
  }
];

export const MOOD_SPECIFIC_PROMPTS: Record<MoodType, string[]> = {
  anxious: [
    "What's the worst that could realistically happen?",
    "What parts of this CAN you control?",
    "When you felt this before, what helped?",
    "If your anxiety could talk, what would it say?",
    "What would you tell a friend feeling this way?"
  ],
  sad: [
    "What loss or disappointment are you grieving?",
    "What is one small way you can be kind to yourself today?",
    "It's okay to not be okay. Write about what hurts.",
    "Who can you reach out to for a hug or chat?"
  ],
  low: [
    "What is draining your energy right now?",
    "What is one tiny thing you can do to shift your state?",
    "Are you physically tired or emotionally tired?",
    "List 3 things that usually bring you joy."
  ],
  okay: [
    "What would make today a 'Good' day?",
    "What is keeping you steady right now?",
    "Are you feeling neutral or just numb?",
    "What are you looking forward to?"
  ],
  good: [
    "What went right today?",
    "How can you carry this energy into tomorrow?",
    "Who did you share your good mood with?",
    "What strengths did you use today?"
  ],
  great: [
    "Capture this moment: what does it feel like?",
    "What contributed to this amazing feeling?",
    "How can you celebrate yourself today?",
    "Write a note to your future self for a bad day."
  ]
};
