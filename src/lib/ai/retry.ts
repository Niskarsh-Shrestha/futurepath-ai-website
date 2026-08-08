interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
}

/**
 * Retries an async operation with exponential backoff. Used for transient
 * AI provider failures (rate limits, timeouts, malformed JSON on a given
 * attempt) — not for permanent failures like a missing API key.
 */
export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  { maxAttempts = 3, initialDelayMs = 1000 }: RetryOptions = {}
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        const delay = initialDelayMs * 2 ** (attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("rate limit") ||
      message.includes("timeout") ||
      message.includes("timed out") ||
      message.includes("invalid json") ||
      message.includes("empty response") ||
      message.includes("econnreset") ||
      message.includes("503") ||
      message.includes("529")
    );
  }
  return false;
}