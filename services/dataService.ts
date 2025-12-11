import { ProcessData, ProcessImage } from '../types';
import { isOSSConfigured } from '../config/oss.config';
import { listImagesFromOSS, getMultipleOSSFileUrls } from './ossService';

/**
 * 检查给定的GUID是否有有效的图片数据
 * 返回布尔值表示是否找到图片
 */
export const hasValidSessionData = async (guid: string): Promise<boolean> => {
  // 检查是否配置了OSS
  if (isOSSConfigured()) {
    try {
      const imageFiles = await listImagesFromOSS(guid);
      return imageFiles.length > 0;
    } catch (error) {
      console.error('检查OSS数据时出错:', error);
      return false;
    }
  } else {
    // 对于模拟数据，我们认为所有session都是有效的
    // 但可以根据需要添加特定的验证逻辑
    return true;
  }
};

/**
 * 从阿里云OSS获取图片数据（如果配置了OSS）
 * 如果找到数据则返回ProcessData，否则返回null
 * 只有在未配置OSS时才返回模拟数据
 */
export const fetchProcessData = async (guid: string): Promise<ProcessData | null> => {
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
const fetchFromOSS = async (guid: string): Promise<ProcessData | null> => {
  try {
    // 列出OSS中的图片文件
    const imageFiles = await listImagesFromOSS(guid);
    
    if (imageFiles.length === 0) {
      console.warn(`OSS中未找到GUID ${guid} 的图片`);
      return null;
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
    console.error('从OSS获取数据失败:', error);
    return null;
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
 * Returns null if no valid ID is found
 */
export const getGuidFromUrl = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || params.get('guid');
  
  if (id && id.trim()) return id.trim();
  
  // Return null if no ID is found instead of generating demo
  return null;
};
