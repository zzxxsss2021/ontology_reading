# Ontology Reader - 智能本体资讯阅读系统

<div align="center">

🧠 **基于图数据库本体构建概念的智能资讯阅读工具**

[在线演示](#) | [功能特性](#功能特性) | [快速开始](#快速开始) | [开发路线图](#开发路线图)

</div>

---

## 📖 项目简介

Ontology Reader 是一个创新的资讯阅读工具，它能够自动从您输入的资讯内容中构建**知识本体**（Knowledge Ontology），帮助您更好地组织、理解和记忆知识。

### 核心理念

传统的笔记工具是线性的，而人类的知识是网状的。Ontology Reader 通过构建概念图谱，让您的知识以更自然的方式组织和呈现。

## ✨ 功能特性

### 当前版本 (MVP v0.1.0)

- ✅ **知识本体可视化** - 以图形化方式展示概念和关系
- ✅ **手动编辑本体** - 双击节点编辑、拖拽创建连接、删除节点
- ✅ **本地数据持久化** - 使用 LocalStorage 保存您的本体数据
- ✅ **导入/导出** - 支持 JSON 格式导入导出
- ✅ **示例数据** - 预置机器学习领域示例，快速了解功能

### 即将上线

- 🚧 **AI自动本体构建** - 输入资讯，自动提取概念和关系
- 🚧 **本体版本对比** - 可视化对比新旧版本差异
- 🚧 **智能内容整理** - 基于本体结构格式化输出
- 🚧 **历史记录管理** - 跟踪您的学习轨迹

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- npm >= 8

### 安装步骤

```bash
# 1. 克隆仓库
git clone git@github.com:zzxxsss2021/ontology_reading.git
cd ontology_reading

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 在浏览器打开
# 默认地址: http://localhost:5173
```

### 首次使用

1. **查看示例** - 首次打开会加载机器学习领域的示例本体
2. **编辑本体** - 在右侧图中双击节点可以编辑概念
3. **创建连接** - 从一个节点拖拽到另一个节点创建关系
4. **保存数据** - 所有修改自动保存到浏览器 LocalStorage

## 🎯 使用指南

### 本体图操作

| 操作 | 说明 |
|------|------|
| **拖拽节点** | 调整节点位置 |
| **双击节点** | 编辑节点名称、类型、描述 |
| **拖拽连接** | 从节点A拖拽到节点B创建关系 |
| **Delete键** | 选中节点或边后按Delete删除 |
| **滚轮** | 缩放画布 |
| **鼠标拖拽背景** | 平移画布 |

### 数据管理

- **导出本体**: 设置 → 数据管理 → 导出本体 JSON
- **导入本体**: 设置 → 数据管理 → 导入本体 JSON
- **清空本体**: 设置 → 数据管理 → 清空本体（危险操作）

## 🛠 技术栈

### 前端框架

- **React 18** - 用户界面
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **React Flow** - 图可视化

### 状态管理

- **Zustand** - 轻量级状态管理

### UI 组件

- **Headless UI** - 无样式组件
- **Heroicons** - 图标库

### 数据存储

- **LocalStorage** - 本地数据持久化（MVP阶段）

## 📁 项目结构

```
ontology_reading/
├── src/
│   ├── components/          # React 组件
│   │   ├── OntologyGraph.jsx    # 本体图可视化
│   │   ├── InputPanel.jsx       # 输入面板
│   │   ├── OutputPanel.jsx      # 输出面板
│   │   ├── SettingsModal.jsx    # 设置弹窗
│   │   └── VersionCompare.jsx   # 版本对比
│   ├── store/               # 状态管理
│   │   └── useOntologyStore.js  # Zustand Store
│   ├── utils/               # 工具函数
│   │   ├── storage.js           # LocalStorage 封装
│   │   ├── ontologyDiff.js      # 本体对比算法
│   │   ├── ontologyUtils.js     # 本体工具
│   │   ├── mockData.js          # 示例数据
│   │   └── aiService.js         # AI 服务（预留）
│   ├── prompts/             # AI Prompt 模板
│   │   └── templates.js
│   ├── App.jsx              # 主应用
│   └── main.jsx             # 入口文件
├── public/                  # 静态资源
├── PRD.md                   # 产品需求文档（完整版）
├── PRD_MVP_AGILE.md         # 敏捷MVP版PRD
└── README.md                # 本文件
```

## 🔧 AI 集成指南

### 配置步骤（待实现）

当前版本AI功能正在开发中。配置步骤如下：

1. **获取 API Key**
   - OpenAI: https://platform.openai.com/api-keys
   - Anthropic: https://console.anthropic.com/

2. **在设置中配置**
   - 打开设置 → AI 模型配置
   - 选择提供商（OpenAI 或 Anthropic）
   - 输入模型名称（如 `gpt-4o` 或 `claude-opus-4-6`）
   - 输入 API Token
   - 保存设置

3. **开始使用**
   - 在输入面板输入资讯内容
   - 点击"提交分析"
   - 系统自动构建本体并展示

### 支持的模型

- **OpenAI**: gpt-4, gpt-4-turbo, gpt-4o
- **Anthropic**: claude-opus-4-6, claude-sonnet-4-5

## 📊 开发路线图

### Phase 1: 基础框架 ✅ 已完成

- [x] 项目初始化
- [x] 本体图可视化
- [x] 手动编辑功能
- [x] 本地数据持久化

### Phase 2: AI 集成 🚧 进行中

- [ ] AI 服务接口实现
- [ ] 自动本体构建
- [ ] 本体更新与融合
- [ ] 内容智能整理

### Phase 3: 版本管理

- [ ] 版本对比界面完善
- [ ] 历史记录管理
- [ ] 撤销/重做功能

### Phase 4: 高级功能

- [ ] 多本体管理
- [ ] 云端同步
- [ ] 协作功能
- [ ] 移动端适配

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [React Flow](https://reactflow.dev/) - 强大的图可视化库
- [Zustand](https://github.com/pmndrs/zustand) - 简洁的状态管理
- [Tailwind CSS](https://tailwindcss.com/) - 优雅的样式框架

## 📮 联系方式

- **项目主页**: https://github.com:zzxxsss2021/ontology_reading
- **问题反馈**: [Issues](https://github.com:zzxxsss2021/ontology_reading/issues)

---

<div align="center">

**用知识图谱，让阅读更智能** 🚀

Made with ❤️ by the Ontology Reader Team

</div>
