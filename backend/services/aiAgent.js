import { GoogleGenAI } from '@google/genai';

export const generateAiReply = async (subject, description) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `You are a helpful customer support agent for a software company.
A user submitted this support ticket.

Subject: ${subject}
Description: ${description}

Write a short, friendly, helpful first reply (2-3 sentences) that acknowledges
their issue and suggests a next step. Do not make up specific account details.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
  });

  return response.text;
};