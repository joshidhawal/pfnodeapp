export type ResponseObject<T> =
  | { success: true; data: T | T[] | Record<string, T> }
  | { success: false; error: string; code?: number };
