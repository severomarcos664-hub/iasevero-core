import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY não configurada.");
}

export const openai = new OpenAI({
  apiKey,
  timeout: 30000,
});

export const DEFAULT_MODEL =
  process.env.OPENAI_MODEL || "gpt-4o-mini";
