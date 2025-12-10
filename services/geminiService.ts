import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
// Safely access process.env for browser compatibility
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore error if process is undefined
  }
  return '';
};

const apiKey = getApiKey();
// Initialize the AI client only if we have a key (or let it fail gracefully later)
// We instantiate it here but we'll check apiKey before calls
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateDevotional = async (book: string, chapters: string) => {
  try {
    if (!ai || !apiKey) {
      return "Configure sua API KEY para receber devocionais personalizados.";
    }

    const prompt = `
      Crie um breve devocional (máximo 100 palavras) baseado em ${book} capítulos ${chapters}.
      Foque na aplicação prática para um jovem cristão.
      O tom deve ser encorajador e profundo.
      Termine com uma frase curta de oração.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Fast response needed
      }
    });

    return response.text;
  } catch (error) {
    console.error("Erro ao gerar devocional:", error);
    return "Não foi possível gerar o devocional no momento. Medite na palavra lida e ore ao Senhor.";
  }
};