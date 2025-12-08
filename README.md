<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Brain Storm - ZHA

一个基于React + Vite的图片流展示系统，支持从阿里云OSS读取图片。

## 功能特性

- 🎨 炫酷的粒子背景效果
- 🖼️ 图片流式展示
- 🔍 图片放大查看
- ☁️ 支持阿里云OSS存储
- 📱 响应式设计
- 🚀 自动部署到GitHub Pages

## 在线预览

https://zimhe.github.io/brain-storm-zha/

## 本地运行

**前置要求：** Node.js (推荐 v20+)

1. **克隆项目**
   ```bash
   git clone https://github.com/zimhe/brain-storm-zha.git
   cd brain-storm-zha
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   复制 `.env.example` 为 `.env.local` 并填入配置：
   ```bash
   cp .env.example .env.local
   ```

   编辑 `.env.local`：
   ```env
   # 阿里云OSS配置（可选，不配置则使用模拟数据）
   VITE_OSS_REGION=oss-cn-hangzhou
   VITE_OSS_BUCKET=your-bucket-name
   VITE_OSS_ACCESS_KEY_ID=your-access-key-id
   VITE_OSS_ACCESS_KEY_SECRET=your-access-key-secret
   
   # Gemini API Key（可选）
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **运行开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   
   浏览器打开 http://localhost:3000

## 阿里云OSS配置

### OSS存储结构

图片应按以下结构存储在OSS中：

```
bucket-name/
  └── processes/
      └── {guid}/
          ├── image1.jpg
          ├── image2.jpg
          └── ...
```

### 获取访问密钥

1. 登录[阿里云控制台](https://ram.console.aliyun.com/)
2. 创建AccessKey（建议使用RAM子账号）
3. 授予OSS读取权限
4. 将密钥填入 `.env.local`

### 未配置OSS时

如果未配置OSS或OSS中没有找到对应图片，系统会自动使用模拟数据（随机图片）进行展示。

## 使用方法

访问URL时可以传入GUID参数：

```
http://localhost:3000?id=your-guid
http://localhost:3000?guid=your-guid
```

系统会：
1. 如果配置了OSS，从 `processes/{guid}/` 读取图片
2. 如果未配置或读取失败，显示模拟数据

## 部署到GitHub Pages

项目已配置GitHub Actions自动部署：

1. 推送代码到GitHub
2. GitHub Actions自动构建和部署
3. 访问 `https://your-username.github.io/brain-storm-zha/`

**配置密钥（可选）：**

如果需要在GitHub Pages中使用OSS，在仓库设置中添加Secrets：
- `VITE_OSS_REGION`
- `VITE_OSS_BUCKET`
- `VITE_OSS_ACCESS_KEY_ID`
- `VITE_OSS_ACCESS_KEY_SECRET`

## 技术栈

- **前端框架**: React 19
- **构建工具**: Vite 6
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **存储**: 阿里云OSS
- **部署**: GitHub Pages

## 项目结构

```
brain-storm-zha/
├── components/          # React组件
│   ├── Header.tsx      # 头部组件
│   ├── ImageViewer.tsx # 图片查看器
│   ├── ParticleBackground.tsx # 粒子背景
│   └── StreamItem.tsx  # 图片流项
├── services/           # 服务层
│   ├── dataService.ts  # 数据服务
│   └── ossService.ts   # OSS服务
├── config/             # 配置文件
│   └── oss.config.ts   # OSS配置
├── types.ts            # TypeScript类型定义
└── App.tsx             # 主应用组件
```

## License

MIT
