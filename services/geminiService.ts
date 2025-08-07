
import { GoogleGenAI, Type } from "@google/genai";
import type { InitialSceneResponse, NextSceneResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const textModel = 'gemini-2.5-flash';
const imageModel = 'imagen-3.0-generate-002';

const systemInstruction = `You are a master storyteller and game master for a gritty text-based adventure game set in mid-1980s New York City. The year is 1986. Your tone is descriptive, noir-inspired, and immersive.

The central plot is that the player character, Brock, has recently witnessed a murder in an alley. The killers saw him, and now his life is in danger. The story should revolve around this event, his fear, and his decisions on how to handle the situation (go to the police, hide, investigate, etc.).

Key Characters in Brock's life:
- Dino: Brock's boss at the pizza place. In his late 50s, world-weary but has a soft spot for Brock.
- Min-jun: Brock's neighbor, a Korean woman his age. She is sharp, observant, and perhaps a student or artist.
- Sarah: Brock's on-again, off-again girlfriend. She's a bit of a wild card, maybe involved in the downtown art or music scene.
- Leo: Brock's best friend from back home. He might call for updates, representing the "normal" life Brock left behind.

You will generate scene descriptions and choices for the player. Keep descriptions to a concise paragraph. Ensure choices are distinct and lead to interesting outcomes related to the central plot. Never break character.`;

const initialSceneSchema = {
  type: Type.OBJECT,
  properties: {
    characterBio: {
      type: Type.STRING,
      description: "A detailed, two-paragraph character biography for Brock, a 26-year-old. Mention he's from upstate NY, works at Dino's Pizza-Pies, and lives in Hell's Kitchen. Describe his personality and aspirations, hinting at the recent traumatic event he witnessed."
    },
    sceneDescription: {
      type: Type.STRING,
      description: "A descriptive paragraph about Brock's small, cheap studio apartment in Hell's Kitchen. Set a gritty, lonely, and now fearful mood, as he's hiding out after witnessing a crime."
    },
    choices: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of three distinct, short action choices for Brock to make in his apartment, reflecting his current predicament."
    }
  },
  required: ["characterBio", "sceneDescription", "choices"]
};

const nextSceneSchema = {
    type: Type.OBJECT,
    properties: {
        sceneDescription: {
            type: Type.STRING,
            description: "A descriptive paragraph continuing the story based on the player's choice. Maintain the gritty, 1986 NYC noir tone and focus on the central murder plot."
        },
        choices: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of three new, distinct, short action choices for the player that relate to the ongoing narrative."
        }
    },
    required: ["sceneDescription", "choices"]
}

export const generateInitialScene = async (): Promise<InitialSceneResponse> => {
    const prompt = `Generate the starting scenario for our text adventure game. The main character is Brock, a man in his mid-twenties who moved to NYC from upstate a few months ago. He works as a waiter. The year is 1986. Please provide his bio, the initial scene in his apartment, and three starting choices, keeping in mind the central plot where he just witnessed a murder.`;

    const response = await ai.models.generateContent({
        model: textModel,
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: initialSceneSchema
        }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as InitialSceneResponse;
};

export const generateNextScene = async (context: string, choice: string): Promise<NextSceneResponse> => {
    const prompt = `Here is the story so far:\n${context}\n\nThe player chose to: "${choice}".\n\nGenerate the next part of the story.`;

    const response = await ai.models.generateContent({
        model: textModel,
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: nextSceneSchema
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as NextSceneResponse;
}

export const generateImage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: imageModel,
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    
    // Fallback image if generation fails
    return `https://picsum.photos/seed/fallback/1280/720`;
};
