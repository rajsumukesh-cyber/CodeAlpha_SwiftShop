import { GoogleGenAI, Type } from "@google/genai";
import { Product, Review } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function summarizeReviews(reviews: Review[]): Promise<string> {
  if (reviews.length === 0) return "No reviews yet.";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a sentiment analyst for an e-commerce platform. 
      Summarize the following customer reviews for a product in 2-3 concise sentences. 
      Focus on general sentiment, key pros, and any common complaints.
      
      Reviews:
      ${reviews.map(r => `${r.rating}/5 stars: ${r.comment}`).join('\n\n')}`,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini summary error:", error);
    return "Unable to generate review summary at this time.";
  }
}

export async function getRecommendations(currentProduct: Product, allProducts: Product[]): Promise<Product[]> {
  try {
    const candidateProducts = allProducts.filter(p => p.id !== currentProduct.id);
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a shopping assistant. Based on the current product user is viewing, recommend 3-5 similar products from the provided catalog.
      
      Current Product:
      - Name: ${currentProduct.name}
      - Category: ${currentProduct.category}
      - Price: ₹${currentProduct.price}
      - Description: ${currentProduct.description}
      
      Catalog:
      ${candidateProducts.map(p => `- ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Price: ₹${p.price}`).join('\n')}
      
      Return the IDs of the recommended products in order of relevance.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of recommended product IDs"
            },
            reasoning: {
              type: Type.STRING,
              description: "Brief explanation for the recommendations"
            }
          },
          required: ["recommendedIds"]
        }
      }
    });

    const result = JSON.parse(response.text);
    const recommendedIds = result.recommendedIds as string[];
    
    return recommendedIds
      .map(id => allProducts.find(p => p.id === id))
      .filter((p): p is Product => !!p)
      .slice(0, 4);
  } catch (error) {
    console.error("Gemini recommendation error:", error);
    // Fallback: Just return some products from the same category or random ones
    return allProducts
      .filter(p => p.id !== currentProduct.id)
      .filter(p => p.category === currentProduct.category)
      .slice(0, 4);
  }
}
