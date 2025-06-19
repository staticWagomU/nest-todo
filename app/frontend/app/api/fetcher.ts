// Custom fetcher for orval-generated SWR client

export const customFetcher = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
};

export default customFetcher;
