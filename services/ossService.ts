import OSS from 'ali-oss';
import { getOSSConfig } from '../config/oss.config';

let ossClient: OSS | null = null;

/**
 * 获取OSS客户端实例
 */
export const getOSSClient = (): OSS | null => {
  const config = getOSSConfig();
  
  if (!config.bucket || !config.accessKeyId || !config.accessKeySecret) {
    console.warn('OSS配置不完整，将使用模拟数据');
    return null;
  }

  if (!ossClient) {
    ossClient = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
      // 如果需要STS临时授权，可以添加stsToken
      // stsToken: 'your-sts-token',
    });
  }

  return ossClient;
};

/**
 * 列出指定GUID目录下的所有图片
 */
export const listImagesFromOSS = async (guid: string): Promise<string[]> => {
  const client = getOSSClient();
  if (!client) {
    throw new Error('OSS client not initialized');
  }

  const config = getOSSConfig();
  const prefix = `${config.basePath}/${guid}/`;

  try {
    const result = await client.list({
      prefix: prefix,
      'max-keys': 100,
    });

    if (!result.objects) {
      return [];
    }

    // 过滤出图片文件
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const imageFiles = result.objects
      .filter((obj) => {
        const name = obj.name.toLowerCase();
        return imageExtensions.some((ext) => name.endsWith(ext));
      })
      .map((obj) => obj.name);

    return imageFiles;
  } catch (error) {
    console.error('列出OSS文件失败:', error);
    throw error;
  }
};

/**
 * 获取OSS文件的公网访问URL
 * @param objectName OSS对象名称（包含路径）
 * @param expiresInSeconds URL过期时间（秒），默认1小时
 */
export const getOSSFileUrl = async (
  objectName: string,
  expiresInSeconds: number = 3600
): Promise<string> => {
  const client = getOSSClient();
  if (!client) {
    throw new Error('OSS client not initialized');
  }

  try {
    // 如果bucket是公共读，可以直接返回URL
    // return `https://${config.bucket}.${config.region}.aliyuncs.com/${objectName}`;
    
    // 使用签名URL（适用于私有bucket）
    const url = client.signatureUrl(objectName, {
      expires: expiresInSeconds,
    });
    return url;
  } catch (error) {
    console.error('获取OSS文件URL失败:', error);
    throw error;
  }
};

/**
 * 批量获取多个文件的URL
 */
export const getMultipleOSSFileUrls = async (
  objectNames: string[],
  expiresInSeconds: number = 3600
): Promise<Map<string, string>> => {
  const urlMap = new Map<string, string>();

  await Promise.all(
    objectNames.map(async (name) => {
      try {
        const url = await getOSSFileUrl(name, expiresInSeconds);
        urlMap.set(name, url);
      } catch (error) {
        console.error(`获取 ${name} 的URL失败:`, error);
      }
    })
  );

  return urlMap;
};
