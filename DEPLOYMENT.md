# Vercel 部署指南

## 方法一：通过 Vercel 网页界面部署（推荐 ✨）

### 步骤：

1. **访问 Vercel**
   - 打开 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择 GitHub 仓库：`zzxxsss2021/ontology_reading`
   - 点击 "Import"

3. **配置项目**
   - Framework Preset: **Vite** (自动检测)
   - Root Directory: `./` (默认)
   - Build Command: `npm run build` (默认)
   - Output Directory: `dist` (默认)

4. **配置环境变量** ⚠️ 重要
   点击 "Environment Variables" 添加以下变量：
   ```
   VITE_AI_PROVIDER = moonshot
   VITE_AI_MODEL = moonshot-v1-128k
   VITE_AI_API_TOKEN = [你的 Kimi API Token]
   ```

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约1-2分钟）
   - 部署成功后会得到一个 URL（如：`ontology-reading.vercel.app`）

---

## 方法二：通过 Vercel CLI 部署

### 前置要求：
```bash
# 全局安装 Vercel CLI（需要管理员权限）
sudo npm install -g vercel

# 或使用 npx（无需安装）
npx vercel
```

### 部署步骤：

1. **登录 Vercel**
   ```bash
   vercel login
   ```

2. **首次部署**
   ```bash
   vercel
   ```
   按提示操作：
   - Set up and deploy? **Y**
   - Which scope? 选择你的账号
   - Link to existing project? **N**
   - Project name: `ontology-reading`
   - In which directory? `./`
   - Override settings? **N**

3. **设置环境变量**
   ```bash
   vercel env add VITE_AI_PROVIDER
   # 输入: moonshot

   vercel env add VITE_AI_MODEL
   # 输入: moonshot-v1-128k

   vercel env add VITE_AI_API_TOKEN
   # 输入: 你的 API Token
   ```

4. **生产部署**
   ```bash
   vercel --prod
   ```

---

## 部署后配置

### 自定义域名（可选）
1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的域名
3. 按提示配置 DNS 记录

### 环境变量管理
- Production: 生产环境变量
- Preview: 预览环境变量
- Development: 本地开发变量

### 自动部署
- 推送到 `main` 分支 → 自动部署到生产环境
- 推送到其他分支 → 自动创建预览部署

---

## 常见问题

### Q: 部署后API调用失败？
A: 检查环境变量是否正确设置，特别是 `VITE_AI_API_TOKEN`

### Q: 路由404错误？
A: 已在 `vercel.json` 中配置了SPA路由重写，应该不会出现此问题

### Q: 构建失败？
A: 检查 `package.json` 中的依赖是否完整，本地运行 `npm run build` 测试

---

## 项目信息

- **仓库**: github.com/zzxxsss2021/ontology_reading
- **框架**: React 18 + Vite
- **配置文件**: vercel.json
- **环境变量示例**: .env.example
