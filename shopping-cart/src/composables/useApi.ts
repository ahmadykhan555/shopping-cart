import { DEFAULT_API_OPTIONS } from "@/consts";

export default function useApi() {
  const apiCall = async <T>(
    url: string,
    options: RequestInit = DEFAULT_API_OPTIONS,
  ): Promise<T> => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json() as unknown as T;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    apiCall,
  };
}
