import { ProcessData, ProcessImage } from '../types';
import { isOSSConfigured } from '../config/oss.config';
import { listImagesFromOSS, getMultipleOSSFileUrls } from './ossService';

/**
 * 从阿里云OSS获取图片数据（如果配置了OSS）
 * 否则返回模拟数据
 */
export const fetchProcessData = async (guid: string): Promise<ProcessData> => {
  // 检查是否配置了OSS
  if (isOSSConfigured()) {
    return await fetchFromOSS(guid);
  } else {
    console.log('OSS未配置，使用模拟数据');
    return await fetchMockData(guid);
  }
};

/**
 * 从真实的阿里云OSS获取数据
 */
const fetchFromOSS = async (guid: string): Promise<ProcessData> => {
  try {
    // 列出OSS中的图片文件
    const imageFiles = await listImagesFromOSS(guid);
    
    if (imageFiles.length === 0) {
      console.warn(`OSS中未找到GUID ${guid} 的图片，使用模拟数据`);
      return await fetchMockData(guid);
    }

    // 获取所有图片的访问URL
    const urlMap = await getMultipleOSSFileUrls(imageFiles);

    // 转换为ProcessImage格式
    const images: ProcessImage[] = imageFiles.map((fileName, index) => {
      const url = urlMap.get(fileName) || '';
      const id = fileName.split('/').pop() || `img-${index}`;
      
      return {
        id: id,
        url: url,
        thumbnail: url, // 可以优化：如果有缩略图，使用缩略图URL
        timestamp: new Date(Date.now() - (imageFiles.length - index) * 60000).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        description: `Image ${index + 1}`,
        width: 1920,
        height: 1080,
      };
    });

    return {
      guid,
      createdAt: new Date().toLocaleDateString(),
      images,
    };
  } catch (error) {
    console.error('从OSS获取数据失败，使用模拟数据:', error);
    return await fetchMockData(guid);
  }
};

/**
 * 生成模拟数据（用于开发和演示）
 */
const fetchMockData = async (guid: string): Promise<ProcessData> => {
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
