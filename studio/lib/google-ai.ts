import { createGoogleGenerativeAI } from "@ai-sdk/google";

/**
 * Shared Google Generative AI provider instance.
 * All AI SDK calls (embeddings, generation, structured output) should use this.
 */
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

/** Embedding model validated in experiments (3072-dim, supports task types). */
export const EMBEDDING_MODEL_ID = "gemini-embedding-001";

/** Generation model for structured output and answer generation. */
export const GENERATION_MODEL_ID = "gemini-2.5-flash";
