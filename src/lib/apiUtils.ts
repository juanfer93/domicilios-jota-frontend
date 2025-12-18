export function extractPayload<T>(responseData: unknown): T {
  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData &&
    (responseData as { data?: unknown }).data !== undefined
  ) {
    return (responseData as { data?: T }).data as T;
  }

  return responseData as T;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    const maybeError = error as {
      message?: unknown;
      response?: { data?: { message?: unknown } };
    };

    const message = maybeError.response?.data?.message ?? maybeError.message;

    if (Array.isArray(message)) {
      const [firstMessage] = message;
      if (firstMessage) return String(firstMessage);
    }

    if (message) return String(message);
  }

  return fallback;
}
