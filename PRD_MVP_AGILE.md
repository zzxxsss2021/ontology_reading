# 敏捷MVP产品需求文档
## 基于本体的智能资讯阅读系统 - 快速迭代版

---

## 1. 产品概述

### 1.1 MVP 核心理念
用最小成本验证"自动本体构建辅助资讯阅读"这一核心价值，聚焦单用户场景，使用前端缓存存储。

### 1.2 MVP 范围限定
- ✅ 单用户单本体模式
- ✅ 前端 localStorage/IndexedDB 存储
- ✅ 自动本体构建和更新
- ✅ 版本对比和选择机制
- ✅ 简单的本体可视化编辑
- ❌ 不支持多本体/领域识别
- ❌ 不需要用户系统
- ❌ 不需要后端数据库

---

## 2. 核心功能

### 2.1 资讯输入与本体构建

**场景1：首次使用（无本体）**
```
用户输入资讯
    ↓
调用 AI 分析内容
    ↓
生成本体结构（JSON格式）
{
  "nodes": [{id, name, type, description}],
  "edges": [{source, target, relation, description}]
}
    ↓
展示本体预览
    ↓
展示整理后的资讯内容
    ↓
保存到 localStorage
```

**场景2：已有本体**
```
用户输入新资讯
    ↓
加载现有本体
    ↓
调用 AI 分析（输入：新资讯 + 旧本体）
    ↓
生成新版本本体
    ↓
【关键流程】展示对比界面：
  - 左侧：旧版本本体（v1）
  - 右侧：新版本本体（v2）
  - 高亮差异（新增节点/边、删除节点/边、修改）
    ↓
用户选择：
  ├─ 接受新版本 → 覆盖旧本体 → 展示新内容
  ├─ 保留旧版本 → 放弃更新 → 基于旧本体展示内容
  └─ 手动调整 → 进入编辑模式 → 保存后展示内容
    ↓
保存到 localStorage
```

### 2.2 本体可视化与编辑

**基础可视化**
- 使用力导向图展示节点和边
- 节点：圆形，显示概念名称
- 边：带箭头的线，显示关系类型
- 颜色区分节点类型（可选）

**编辑功能**
- ✏️ 双击节点：编辑名称和描述
- ➕ 右键空白处：添加新节点
- 🗑️ 选中节点按Delete：删除节点
- 🔗 拖拽节点A到节点B：创建关系
- ✏️ 点击边：编辑关系类型
- 💾 实时保存到 localStorage

### 2.3 资讯内容展示

**结构化展示**
- 基于本体结构组织内容
- 核心概念高亮显示（可点击）
- 点击概念自动定位到本体图中对应节点
- 概念间关系以链接形式展示

**示例**：
```markdown
## 核心概念
- [Transformer] (架构)
- [Self-Attention] (机制)
- [BERT] (模型)

## 关系
- Transformer --包含--> Self-Attention
- BERT --基于--> Transformer

## 内容摘要
Transformer 是一种...
```

---

## 3. 数据模型

### 3.1 本体数据结构（JSON）

```json
{
  "version": 1,
  "created_at": "2026-02-24T10:00:00Z",
  "updated_at": "2026-02-24T10:00:00Z",
  "nodes": [
    {
      "id": "node-1",
      "name": "Transformer",
      "type": "architecture",
      "description": "一种基于注意力机制的神经网络架构",
      "source": "auto"  // auto | manual
    },
    {
      "id": "node-2",
      "name": "Self-Attention",
      "type": "mechanism",
      "description": "自注意力机制",
      "source": "auto"
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
      "relation": "包含",
      "description": "Transformer包含Self-Attention机制",
      "source": "auto"
    }
  ]
}
```

### 3.2 内容历史（可选，轻量级）

```json
{
  "history": [
    {
      "id": "content-1",
      "timestamp": "2026-02-24T10:00:00Z",
      "input": "用户输入的原始资讯",
      "output": "AI整理后的结构化内容",
      "ontology_version": 1
    }
  ]
}
```

### 3.3 LocalStorage 键名设计

- `ontology_reading_ontology`: 当前本体数据
- `ontology_reading_history`: 内容历史（可选）
- `ontology_reading_config`: 用户配置（AI模型参数）

---

## 4. 技术架构（极简版）

### 4.1 整体架构

```
┌─────────────────────────────────────────┐
│           前端 SPA (单页应用)             │
│  ┌────────────────┐  ┌────────────────┐ │
│  │  输入输出界面   │  │  本体编辑界面   │ │
│  └────────────────┘  └────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │      本体管理模块 (State)            │ │
│  │  - 加载/保存本体                     │ │
│  │  - 版本对比                          │ │
│  │  - 编辑操作                          │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │      LocalStorage / IndexedDB       │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
                  ↕ HTTP
┌─────────────────────────────────────────┐
│    轻量后端 (可选，仅作AI调用代理)        │
│  ┌────────────────────────────────────┐ │
│  │   API 端点: /api/analyze            │ │
│  │   - 接收：资讯内容 + 旧本体          │ │
│  │   - 返回：新本体 + 整理后的内容      │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│         AI 服务 (OpenAI/Claude)         │
└─────────────────────────────────────────┘
```

### 4.2 技术栈（最小化）

**前端（核心）**
- 框架：**React** (推荐) 或 **Vue 3**
- 状态管理：React Context / Zustand（轻量）
- 图可视化：**React Flow** (简单易用) 或 **Cytoscape.js**
- UI 组件：**Tailwind CSS** + **Headless UI**
- HTTP 客户端：**Axios** 或 **fetch API**

**后端（可选）**
- **选项1**：无后端，直接在前端调用 AI API（需处理CORS和密钥安全）
- **选项2**：轻量后端 **Vercel Serverless Functions** / **Cloudflare Workers**
- **选项3**：简单 Node.js + Express（用于代理 AI 调用）

**部署**
- 前端：**Vercel** / **Netlify** / **GitHub Pages**
- 后端（如有）：**Vercel** / **Railway** / **Render**

---

## 5. 核心界面设计

### 5.1 主界面布局（单页应用）

```
┌────────────────────────────────────────────────┐
│  Header: 🧠 Ontology Reader | ⚙️ 设置           │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────────┐  ┌───────────────────┐  │
│  │                  │  │                   │  │
│  │   左侧：输入区    │  │   右侧：本体图     │  │
│  │                  │  │   (可折叠/展开)    │  │
│  │  [输入框]        │  │                   │  │
│  │  [提交按钮]      │  │   [图可视化]      │  │
│  │                  │  │                   │  │
│  │  ───────────     │  │                   │  │
│  │                  │  │                   │  │
│  │   输出区域        │  │   [编辑工具栏]    │  │
│  │  (结构化内容)     │  │                   │  │
│  │                  │  │                   │  │
│  └──────────────────┘  └───────────────────┘  │
│                                                │
└────────────────────────────────────────────────┘
```

### 5.2 版本对比界面（Modal）

```
┌──────────────────────────────────────────────┐
│  本体版本对比                        ✕ 关闭   │
├──────────────────────────────────────────────┤
│                                              │
│  ┌───────────────┐      ┌───────────────┐   │
│  │  旧版本 (v1)   │      │  新版本 (v2)   │   │
│  │               │      │               │   │
│  │  [本体图]     │  vs  │  [本体图]     │   │
│  │               │      │               │   │
│  │  3 个节点      │      │  5 个节点      │   │
│  │  2 条边        │      │  4 条边        │   │
│  └───────────────┘      └───────────────┘   │
│                                              │
│  变更摘要：                                   │
│  ✅ 新增节点: BERT, Encoder                  │
│  ✅ 新增关系: BERT → Transformer             │
│  ❌ 删除节点: (无)                            │
│                                              │
│  ┌─────────────────────────────────────────┐│
│  │  [保留旧版本]  [手动调整]  [接受新版本] ││
│  └─────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
```

### 5.3 设置界面（Modal）

```
┌────────────────────────────────────┐
│  设置                      ✕ 关闭   │
├────────────────────────────────────┤
│                                    │
│  AI 模型配置                        │
│  ┌──────────────────────────────┐ │
│  │ 模型提供商: [OpenAI ▼]        │ │
│  │ 模型名称: [gpt-4o]            │ │
│  │ API Token: [••••••••••]       │ │
│  │ [测试连接]                    │ │
│  └──────────────────────────────┘ │
│                                    │
│  数据管理                           │
│  ┌──────────────────────────────┐ │
│  │ [导出本体 JSON]               │ │
│  │ [导入本体 JSON]               │ │
│  │ [清空本体] (危险操作)          │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │         [保存设置]            │ │
│  └──────────────────────────────┘ │
└────────────────────────────────────┘
```

---

## 6. AI 集成方案

### 6.1 Prompt 设计

#### Prompt 1: 首次本体构建

```
系统角色：
你是一个知识本体构建专家，擅长从文本中提取核心概念和关系。

用户输入：
{用户的资讯内容}

任务：
1. 识别文本中的核心概念（实体、术语、关键词）
2. 识别概念之间的关系
3. 以 JSON 格式输出本体结构

输出格式：
{
  "nodes": [
    {"id": "唯一ID", "name": "概念名", "type": "类型", "description": "描述"}
  ],
  "edges": [
    {"source": "源节点ID", "target": "目标节点ID", "relation": "关系类型", "description": "关系描述"}
  ]
}

注意：
- 保持概念精简（5-15个核心概念）
- 关系要有明确语义（如：包含、属于、导致、基于等）
- 所有ID使用小写字母和连字符
```

#### Prompt 2: 本体更新

```
系统角色：
你是一个知识本体融合专家，擅长将新知识整合到现有本体中。

现有本体：
{旧本体JSON}

新资讯内容：
{用户新输入的内容}

任务：
1. 分析新内容与现有本体的关联
2. 识别需要新增的概念和关系
3. 识别需要删除或修改的概念（如果有）
4. 生成更新后的完整本体

输出格式：
{
  "nodes": [...],
  "edges": [...],
  "changes": {
    "added_nodes": ["节点ID1", "节点ID2"],
    "added_edges": ["边ID1"],
    "removed_nodes": [],
    "removed_edges": []
  }
}
```

#### Prompt 3: 内容整理

```
系统角色：
你是一个内容整理专家，基于本体结构组织和呈现信息。

本体结构：
{当前本体JSON}

原始内容：
{用户输入的资讯}

任务：
1. 基于本体结构重新组织内容
2. 使用 Markdown 格式输出
3. 高亮核心概念（用[]括起来）
4. 说明概念间的关系

输出格式：
## 核心概念
- [概念1]: 描述
- [概念2]: 描述

## 概念关系
- [概念1] --关系--> [概念2]

## 内容摘要
基于本体的结构化内容...
```

### 6.2 API 调用流程

```javascript
// 示例：调用 AI 构建本体
async function buildOntology(content, existingOntology = null) {
  const prompt = existingOntology
    ? generateUpdatePrompt(content, existingOntology)
    : generateBuildPrompt(content);

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, content })
  });

  const result = await response.json();
  return {
    ontology: result.ontology,
    formattedContent: result.formattedContent
  };
}
```

---

## 7. 开发计划（敏捷版）

### 第 1 周：基础框架搭建

**目标**：可运行的骨架

- [ ] 初始化 React 项目 + Tailwind CSS
- [ ] 搭建基础页面布局（左右分栏）
- [ ] 集成 React Flow（图可视化库）
- [ ] 实现 localStorage 读写工具函数
- [ ] 创建基础状态管理（Context）

**交付物**：静态页面，可手动添加节点并保存到 localStorage

---

### 第 2 周：AI 集成与本体构建

**目标**：实现首次本体自动构建

- [ ] 设置 AI API 调用（后端代理或直接调用）
- [ ] 实现设置页面（输入 API Token）
- [ ] 编写 Prompt 模板（首次构建）
- [ ] 实现：输入资讯 → 调用 AI → 解析 JSON → 渲染图
- [ ] 实现内容整理展示

**交付物**：用户可输入资讯，自动生成本体并展示

---

### 第 3 周：本体更新与版本对比

**目标**：实现核心差异化功能

- [ ] 实现本体版本对比算法（diff nodes/edges）
- [ ] 创建版本对比 Modal 界面
- [ ] 实现高亮差异（新增/删除）
- [ ] 实现用户选择：接受/拒绝/手动调整
- [ ] 编写 Prompt 模板（本体更新）

**交付物**：用户输入新资讯时，可看到对比并选择版本

---

### 第 4 周：手动编辑与优化

**目标**：完善编辑功能和用户体验

- [ ] 实现双击编辑节点
- [ ] 实现拖拽创建关系
- [ ] 实现删除节点/边
- [ ] 添加撤销/重做功能（可选）
- [ ] 优化 UI/UX（加载动画、错误提示）
- [ ] 实现导出/导入 JSON

**交付物**：完整可用的 MVP 产品

---

### 总计：4 周完成 MVP ✅

---

## 8. 关键技术决策

### 8.1 为什么用前端存储？

✅ **优点**：
- 开发速度快，无需后端数据库
- 用户数据本地化，隐私性好
- 部署简单（静态网站）
- 零运维成本

⚠️ **缺点**：
- 数据仅存本地（换设备/浏览器会丢失）
- 无法多设备同步
- localStorage 有容量限制（~5-10MB）

💡 **缓解方案**：
- 提供导出/导入功能
- 未来可升级为云端存储（可选）

### 8.2 单本体 vs 多本体？

**MVP 选择：单本体**

理由：
- 简化逻辑（无需领域识别和匹配）
- 用户学习成本低
- 快速验证核心价值
- 未来可扩展为多本体（升级路径清晰）

### 8.3 后端要不要？

**推荐方案**：轻量后端（Serverless Functions）

理由：
- API Token 不应暴露在前端
- 避免 CORS 问题
- 便于控制 AI 调用成本
- 代码量极小（一个函数即可）

**示例代码**（Vercel Function）：
```javascript
// api/analyze.js
export default async function handler(req, res) {
  const { content, existingOntology } = req.body;
  const apiToken = process.env.OPENAI_API_KEY;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: generatePrompt(content, existingOntology) }]
    })
  });

  const result = await response.json();
  res.json({ ontology: parseOntology(result) });
}
```

---

## 9. 成功指标（MVP）

### 产品验证指标
- ✅ 用户能在 5 分钟内理解并使用产品
- ✅ 自动生成的本体准确率 > 70%（主观评估）
- ✅ 用户愿意多次使用（留存 > 1 次使用）

### 技术指标
- ✅ 首次加载时间 < 3 秒
- ✅ AI 响应时间 < 15 秒
- ✅ 无重大 Bug（崩溃/数据丢失）

---

## 10. 风险与应对

### 风险 1：AI 生成质量不稳定
**应对**：
- 优化 Prompt 工程
- 提供手动编辑作为后备
- 允许用户回退到旧版本

### 风险 2：用户不理解"本体"概念
**应对**：
- 避免使用"本体"术语，改用"知识地图"
- 添加新手引导教程
- 提供示例数据

### 风险 3：LocalStorage 数据丢失
**应对**：
- 明确提示用户定期导出
- 考虑使用 IndexedDB（更大容量）
- 提供云端备份选项（未来）

---

## 11. 下一步行动

### 立即开始
1. **技术选型确认**：React + React Flow + Vercel
2. **创建项目**：`npx create-react-app ontology-reading`
3. **设计 Prompt**：准备 3 个核心 Prompt 模板
4. **获取 API Token**：OpenAI 或 Claude

### 第一周任务分解
- Day 1-2: 项目初始化 + 页面布局
- Day 3-4: React Flow 集成 + 基础交互
- Day 5: LocalStorage 封装 + 状态管理
- Day 6-7: 单元测试 + 代码审查

---

## 12. 附录

### 12.1 推荐技术库

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "reactflow": "^11.10.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.0",
    "tailwindcss": "^3.4.0",
    "react-markdown": "^9.0.0"
  }
}
```

### 12.2 文件结构

```
ontology-reading/
├── src/
│   ├── components/
│   │   ├── InputPanel.jsx       # 输入区域
│   │   ├── OutputPanel.jsx      # 输出区域
│   │   ├── OntologyGraph.jsx    # 本体图
│   │   ├── VersionCompare.jsx   # 版本对比
│   │   └── SettingsModal.jsx    # 设置
│   ├── store/
│   │   └── ontologyStore.js     # 状态管理
│   ├── utils/
│   │   ├── storage.js           # LocalStorage 封装
│   │   ├── aiService.js         # AI 调用
│   │   └── ontologyDiff.js      # 版本对比算法
│   ├── prompts/
│   │   └── templates.js         # Prompt 模板
│   └── App.jsx
├── api/
│   └── analyze.js               # Vercel Function
└── package.json
```

### 12.3 环境变量

```bash
# .env.local
REACT_APP_API_ENDPOINT=/api/analyze
VITE_API_ENDPOINT=/api/analyze

# .env (Vercel)
OPENAI_API_KEY=sk-xxx
```

---

**文档版本**：2.0 - 敏捷MVP版
**预计完成时间**：4 周
**开发人数**：1-2 人
**总成本**：极低（主要是 AI API 调用费用）

---

## 准备好开始了吗？🚀

提供您的 AI API Token，我们可以立即开始项目搭建！
