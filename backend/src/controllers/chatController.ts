import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Remplace par ta clé API Gemini (de Makersuite)
const genAI = new GoogleGenerativeAI("AIzaSyDs2aWHycCh8twVNGtAl_auqu8-2Z7MyUg");

export const chatWithGemini = async (req: Request, res: Response): Promise<void> => {
  const { message,role  } = req.body;

  if (!message) {
    res.status(400).json({ error: "Message manquant." });
    return;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([message]);
    const response = await result.response;
    const reply = response.text();

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Erreur Gemini :", error);
    res.status(500).json({ error: "Erreur lors de l'appel à Gemini." });
  }
};
