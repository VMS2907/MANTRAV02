
import { GoogleGenAI, Type } from "@google/genai";
import { MoodEntry, Insight } from "../types";

export const generateInsights = async (entries: MoodEntry[], userName: string): Promise<Insight[]> => {
  
  if (entries.length === 0) {
    return [{
      id: "intro",
      type: "pattern_detection",
      title: "Welcome",
      content: "Start logging your moods. Once you have your first entry, I can start providing daily forecasts.",
    }];
  }

  // Prepare data for the model (Increased to last 100 entries for better context)
  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp).slice(0, 100);
  
  const dataSummary = sortedEntries.map(e => 
    `[${e.date} ${e.time}] Mood: ${e.mood}. Secondary: ${e.secondaryMoods.join(', ')}. Context: ${e.context}. Note: ${e.note} ${e.transcription ? `(Voice: ${e.transcription})` : ''}`
  ).join('\n');

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const insightSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, description: "One of: pattern_detection, temporal_patterns, emotional_complexity, what_helps, predictions, diary_themes" },
        title: { type: Type.STRING },
        content: { type: Type.STRING },
      },
      required: ["type", "title", "content"],
    },
  };

  const prompt = `
    You are an empathetic emotional intelligence companion for an app called "Mantra".
    User: ${userName}.
    
    DATA HISTORY (Most recent first):
    ${dataSummary}

    TASK:
    Analyze the provided mood history to generate 6 specific insights. 
    Even if there is only one entry, provide a forecast and analysis based on that initial data point and general psychological principles suitable for the context.

    GENERATE 6 INSIGHTS matching these exact types:
    1. pattern_detection: Frequency, trends, and clusters (or initial observation for new users).
    2. temporal_patterns: Days of week, time of day analysis.
    3. emotional_complexity: Co-occurrence of emotions.
    4. what_helps: Evidence-based analysis of what improved mood based on notes.
    5. predictions: Forecast/Advice for the next 24h. Be encouraging and specific to their current state.
    6. diary_themes: Recurring topics in text.

    Tone: Warm, empathetic, non-clinical. Use "you". Be specific.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: insightSchema,
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("No content returned from AI");

    const insightsArray = JSON.parse(jsonStr);

    // Map to internal ID structure
    return insightsArray.map((insight: any) => ({
      ...insight,
      id: Math.random().toString(36).substr(2, 9),
      expiry: Date.now() + 1000 * 60 * 60 * 24 // 24h cache
    }));

  } catch (error) {
    console.error("Error generating insights:", error);
    return [{
      id: "error",
      type: "pattern_detection",
      title: "Connection Issue",
      content: "Unable to connect to Mantra AI. Please try again later.",
    }];
  }
};
