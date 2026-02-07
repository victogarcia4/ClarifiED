import { GoogleGenAI, Chat } from "@google/genai";
import { REWRITER_SYSTEM_PROMPT, CHATBOT_SYSTEM_PROMPT } from '../constants';
import { RewriterOptions } from '../types';

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    const apiKey = process.env.API_KEY;
    
    // Check if the key is effectively missing or a placeholder string
    if (!apiKey || apiKey === "undefined" || apiKey === "" || apiKey === "YOUR_API_KEY") {
      console.error("Critical: API_KEY is missing or invalid in the environment.");
      throw new Error("API Key missing: The environment variable process.env.API_KEY is not defined or is empty.");
    }
    
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const rewriteAnnouncement = async (
  text: string, 
  options: RewriterOptions
): Promise<string> => {
  const ai = getClient();
  
  // Specific model selection for complex text tasks
  const modelId = 'gemini-3-pro-preview';

  const userPrompt = `
    Please rewrite the following message:
    
    "${text}"
    
    Target Audience: ${options.audience}
    Style Preference: ${options.style}
    Tone: ${options.tone}
    
    Follow all HTML formatting rules strictly.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: userPrompt,
      config: {
        systemInstruction: REWRITER_SYSTEM_PROMPT,
        temperature: 0.7,
      }
    });
    
    let content = response.text || "";
    
    // Clean up potential markdown blocks
    if (content.startsWith('```html')) {
      content = content.replace(/^```html\n?/, '').replace(/\n?```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }
    
    return content.trim();
  } catch (error: any) {
    console.error("Gemini API Error details:", error);
    throw error;
  }
};

export const createChatSession = (): Chat => {
  const ai = getClient();
  const modelId = 'gemini-3-pro-preview';
  
  return ai.chats.create({
    model: modelId,
    config: {
      systemInstruction: CHATBOT_SYSTEM_PROMPT,
    }
  });
};