/**
 * 阿里云OSS配置
 * 
 * 使用说明：
 * 1. 在项目根目录创建 .env.local 文件
 * 2. 添加以下环境变量：
 *    VITE_OSS_REGION=oss-cn-hangzhou
 *    VITE_OSS_BUCKET=your-bucket-name
 *    VITE_OSS_ACCESS_KEY_ID=your-access-key-id
 *    VITE_OSS_ACCESS_KEY_SECRET=your-access-key-secret
 */

export interface OSSConfig {
  region: string;
  bucket: string;
  accessKeyId: string;
  accessKeySecret: string;
  // OSS中存储图片的基础路径
  basePath: string;
}

export const getOSSConfig = (): OSSConfig => {
  return {
    region: import.meta.env.VITE_OSS_REGION || 'oss-cn-hangzhou',
    bucket: import.meta.env.VITE_OSS_BUCKET || '',
    accessKeyId: import.meta.env.VITE_OSS_ACCESS_KEY_ID || '',
    accessKeySecret: import.meta.env.VITE_OSS_ACCESS_KEY_SECRET || '',
    basePath: 'processes', // 图片存储在 processes/{guid}/ 下
  };
};

// 检查OSS配置是否完整
export const isOSSConfigured = (): boolean => {
  const config = getOSSConfig();
  return !!(
    config.region &&
    config.bucket &&
    config.accessKeyId &&
    config.accessKeySecret
  );
};
