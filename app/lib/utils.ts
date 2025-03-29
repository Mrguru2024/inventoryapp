export function tryParseJSON<T>(
  jsonString: string | null,
  defaultValue: T = [] as T
): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return defaultValue;
  }
}
