
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";
import { SYSTEM_PROMPT } from "../constants";

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overview: { type: Type.STRING, description: "A short, friendly summary paragraph acting like a CA talking to a client." },
    summary: {
      type: Type.OBJECT,
      properties: {
        bankName: { type: Type.STRING, nullable: true },
        accountName: { type: Type.STRING, nullable: true },
        periodStart: { type: Type.STRING, nullable: true },
        periodEnd: { type: Type.STRING, nullable: true },
        openingBalance: { type: Type.NUMBER, nullable: true },
        closingBalance: { type: Type.NUMBER, nullable: true },
        totalCredits: { type: Type.NUMBER },
        totalDebits: { type: Type.NUMBER },
        netSavings: { type: Type.NUMBER },
      },
      required: ["totalCredits", "totalDebits", "netSavings"],
    },
    categoryBreakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          totalSpent: { type: Type.NUMBER },
          percentageOfExpenses: { type: Type.NUMBER },
        },
        required: ["category", "totalSpent", "percentageOfExpenses"],
      },
    },
    transactions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "ISO format YYYY-MM-DD. Handle various Indian formats (DD/MM/YYYY) and fix OCR errors." },
          valueDate: { type: Type.STRING, nullable: true },
          description: { type: Type.STRING },
          referenceId: { type: Type.STRING, nullable: true },
          type: { type: Type.STRING, enum: ["credit", "debit"] },
          amount: { type: Type.NUMBER },
          balanceAfterTxn: { type: Type.NUMBER, nullable: true },
          category: { type: Type.STRING },
          subCategory: { type: Type.STRING, nullable: true },
          notes: { type: Type.STRING, nullable: true, description: "Notes regarding OCR corrections or ambiguities." },
        },
        required: ["date", "description", "type", "amount", "category"],
      },
    },
    insights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of key observations about spending habits or large transactions.",
    },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of actionable financial advice based on the analysis.",
    },
  },
  required: ["overview", "summary", "categoryBreakdown", "transactions", "insights", "suggestions"],
};

export const analyzeStatement = async (input: { text?: string, fileData?: { mimeType: string, data: string } }): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const parts: any[] = [];

    // 1. Add File Part if exists (Multimodal input)
    if (input.fileData) {
      parts.push({
        inlineData: {
          mimeType: input.fileData.mimeType,
          data: input.fileData.data
        }
      });
    }

    // 2. Add Text Part (Prompt/Instructions)
    // If a file is attached, the text acts as additional context.
    // If no file, the text is the raw statement data.
    let textPrompt = "";
    if (input.fileData) {
      textPrompt = input.text && input.text.trim() 
        ? `Analyze this bank statement file. Additional user context: ${input.text}` 
        : "Analyze this bank statement file and extract the transaction data.";
    } else {
      textPrompt = `Here is the bank statement text to analyze:\n\n${input.text}`;
    }
    
    parts.push({ text: textPrompt });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: parts }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, 
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from Gemini");
    }

    const data = JSON.parse(jsonText) as AnalysisResult;
    return data;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
