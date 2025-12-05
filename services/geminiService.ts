import { GoogleGenAI, Type } from "@google/genai";
import { ModuleType, QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSimulationContent = async (module: ModuleType): Promise<QuizQuestion[]> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Buatkan 5 pertanyaan skenario pelatihan K3 (Keselamatan dan Kesehatan Kerja) yang interaktif dan edukatif untuk topik: "${module}".
    Fokus pada situasi nyata di tempat kerja.
    
    Output harus berupa JSON dengan struktur berikut:
    Array of objects, dimana setiap object memiliki:
    - id: string
    - scenario: Deskripsi singkat situasi bahaya (max 2 kalimat)
    - question: Pertanyaan keputusan apa yang harus diambil
    - options: Array of 3 objects {id, text, isCorrect}
    - explanation: Penjelasan edukatif kenapa jawaban tersebut benar/salah (max 2 kalimat)
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              scenario: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    isCorrect: { type: Type.BOOLEAN }
                  }
                }
              },
              explanation: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Error generating quiz:", error);
    // Fallback data in case of API failure or rate limit
    return [
      {
        id: "fallback-1",
        scenario: "Sistem mendeteksi gangguan koneksi AI.",
        question: "Apa langkah K3 dasar sebelum memulai pekerjaan?",
        options: [
          { id: "a", text: "Langsung bekerja cepat", isCorrect: false },
          { id: "b", text: "Lakukan risk assessment / JSA", isCorrect: true },
          { id: "c", text: "Mengabaikan APD", isCorrect: false }
        ],
        explanation: "Analisis Keselamatan Kerja (JSA) penting untuk mengidentifikasi bahaya sebelum terjadi."
      }
    ];
  }
};