import { GoogleGenAI } from "@google/genai";
import { Laptop } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function explainRecommendation(laptop: Laptop, category: string, weights: { [key: string]: number }) {
  const prompt = `
    Anda adalah asisten ahli laptop DSS (Decision Support System). Berikan analisis rekomendasi profesional untuk kategori "${category}".
    
    Laptop: ${laptop.brand} ${laptop.model}
    Spesifikasi:
    - RAM: ${laptop.ram}GB
    - Penyimpanan: ${laptop.storage}GB
    - Prosesor: ${laptop.processor || 'Tidak diketahui'} (Skor: ${laptop.processorScore}/10)
    - Harga: Rp ${laptop.price.toLocaleString('id-ID')}
    - Kualitas Layar: ${laptop.display}"
    
    Prioritas Pengguna (Bobot):
    ${Object.entries(weights).map(([k, v]) => `- ${k}: ${v}%`).join('\n')}
    
    Tugas:
    1. Berikan 1 alasan utama mengapa laptop ini terpilih sebagai peringkat #1 berdasarkan prioritas di atas.
    2. Sebutkan satu kelebihan teknis yang paling menonjol.
    3. Hubungkan spesifikasinya dengan kebutuhan kategori "${category}".
    
    Format: 2-3 kalimat padat, meyakinkan, dan profesional. Gunakan Bahasa Indonesia.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Tidak dapat menghasilkan penjelasan saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gagal terhubung dengan AI untuk analisis mendalam.";
  }
}
