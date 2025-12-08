import { ProcessData, ProcessImage } from '../types';

/**
 * UTILITY: Simulate fetching data from Aliyun OSS based on a GUID.
 * In a real app, this would use the OSS SDK or a backend API to list objects
 * in the folder: `oss://bucket-name/processes/{guid}/`
 */
export const fetchProcessData = async (guid: string): Promise<ProcessData> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate 10 mock images with architectural/abstract themes
  const images: ProcessImage[] = Array.from({ length: 10 }).map((_, index) => {
    const id = index + 1;
    // Using picsum seeds that look somewhat structural/abstract
    const seed = guid.charCodeAt(0) + index * 123; 
    return {
      id: `img-${id}`,
      // High res for view
      url: `https://picsum.photos/seed/${seed}/1920/1080`, 
      // Lower res for list
      thumbnail: `https://picsum.photos/seed/${seed}/800/600`, 
      timestamp: new Date(Date.now() - (10 - index) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: `Generative iteration #${id} - Phase ${Math.ceil(id / 3)}`,
      width: 1920,
      height: 1080,
    };
  });

  return {
    guid,
    createdAt: new Date().toLocaleDateString(),
    images,
  };
};

/**
 * Extracts the GUID from the URL query parameters.
 * Supports ?id=... or ?guid=...
 */
export const getGuidFromUrl = (): string => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || params.get('guid');
  
  if (id) return id;

  // Fallback for demo purposes if no ID is scanned
  console.log("No ID found in URL, generating demo session.");
  return "demo-session-zha-" + Math.floor(Math.random() * 10000);
};
