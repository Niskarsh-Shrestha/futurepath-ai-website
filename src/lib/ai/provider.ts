import OpenAI from "openai";
import type { AiProvider, AiProviderResult } from "@/lib/ai/types";

/**
 * Thin abstraction over the AI provider. Only OpenAI is implemented now,
 * but any future provider (Anthropic, Gemini, etc.) just needs to satisfy
 * the AiProvider interface and be swapped in here — nothing above this
 * layer (prompts, parsing, actions) needs to know which provider is used.
 */
class OpenAiProvider implements AiProvider {
  private client: OpenAI;
  private model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set in the environment");
    }
    this.client = new OpenAI({ apiKey });
    this.model = process.env.AI_MODEL || "gpt-4o";
  }

  async generate(systemPrompt: string, userPrompt: string): Promise<AiProviderResult> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("AI provider returned an empty response");
    }

    return { content, model: this.model };
  }
}

let providerInstance: AiProvider | null = null;

export function getAiProvider(): AiProvider {
  if (!providerInstance) {
    providerInstance = new OpenAiProvider();
  }
  return providerInstance;
}