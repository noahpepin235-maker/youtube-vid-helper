import { GoogleGenAI, Schema, Type } from "@google/genai";
import { CreatorGuide } from "../types";

export const generateCreatorGuide = async (idea: string): Promise<CreatorGuide> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      titles: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 viral, click-worthy titles for the video.",
      },
      hook: {
        type: Type.STRING,
        description: "The exact script for the first 10 seconds to hook the viewer.",
      },
      thumbnail: {
        type: Type.STRING,
        description: "Visual description of a high-CTR thumbnail.",
      },
      monetization: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            potentialEarnings: { type: Type.STRING, description: "e.g. $50-$200 or High CPM" },
            difficulty: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            strategy: { type: Type.STRING, description: "Specific advice on how to implement this." },
          },
          required: ["title", "potentialEarnings", "difficulty", "strategy"],
        },
      },
      software: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING, description: "e.g. Desktop, Mobile, Tablet" },
            apps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["Free", "Paid", "Freemium"] },
                  bestFor: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["name", "type", "bestFor", "description"],
              },
            },
          },
          required: ["platform", "apps"],
        },
      },
      editingWorkflow: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            phase: { type: Type.STRING, description: "e.g. Assembly, Color, Sound" },
            action: { type: Type.STRING },
            tips: { type: Type.STRING },
          },
          required: ["phase", "action", "tips"],
        },
      },
      equipment: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Recommended gear (cameras, mics, lights) for this specific video style.",
      },
    },
    required: ["titles", "hook", "thumbnail", "monetization", "software", "editingWorkflow", "equipment"],
  };

  const prompt = `
    You are an expert YouTube Producer and Strategist.
    The user has a video idea: "${idea}".

    Generate a complete production masterclass. 
    1. Monetization: Provide specific ways to make money (Affiliates, Digital Products, Sponsorships).
    2. Software: Recommend the absolute best editing software for Desktop, Mobile, and Tablet. Be specific (e.g., Premiere, CapCut, DaVinci).
    3. Editing Workflow: Step-by-step how to edit this specific style of video.
    4. Equipment: What gear fits this niche?
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    return JSON.parse(text) as CreatorGuide;
  } catch (error: any) {
    console.error("Strategy generation failed:", error);
    
    let errorMessage = "An unexpected error occurred. Please try again.";
    
    // Improved Error Handling based on common API issues
    if (error.message) {
        if (error.message.includes('403') || error.message.includes('API key')) {
            errorMessage = "Invalid API Key. Please check your settings.";
        } else if (error.message.includes('429')) {
            errorMessage = "Quota exceeded. Please wait a moment before trying again.";
        } else if (error.message.includes('503')) {
            errorMessage = "AI Service is currently overloaded. Please try again in a few seconds.";
        } else if (error.message.includes('SAFETY')) {
            errorMessage = "Content flagged by safety filters. Please try a different video idea.";
        }
    }

    throw new Error(errorMessage);
  }
};