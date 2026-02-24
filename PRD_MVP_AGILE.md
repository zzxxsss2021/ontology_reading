# 敏捷MVP产品需求文档
## 基于本体的智能资讯阅读系统 - 快速迭代版

---

## 1. 产品概述

### 1.1 核心概念澄清

**本体（Ontology）vs 输出内容**

| 维度 | 本体 | 输出内容 |
|------|------|---------|
| **定位** | 工具/手段 | 产品/目标 |
| **作用** | 辅助信息整理和组织 | 供用户阅读理解 |
| **可见性** | 后台存储，可选查看 | 前台展示，主要界面 |
| **形式** | 图结构（节点+边） | 流畅的文章 |
| **内容** | 概念、层次、关系 | 摘要、正文、要点 |
| **受众** | AI 和高级用户 | 所有用户 |

**类比**：
- 本体 = 编辑的**大纲和提纲**（工具）
- 输出 = 最终的**文章和报告**（产品）

**工作流程**：
```
原始资讯 → [本体构建] → 结构化理解 → [内容整理] → 易读输出
              ↑（工具）                    ↓（产品）
          可视化编辑                    用户阅读
```

### 1.2 MVP 核心理念
用最小成本验证"自动本体构建辅助资讯阅读"这一核心价值，聚焦单用户场景，使用前端缓存存储。

**核心价值主张**：
- 用户输入原始资讯
- AI 在后台构建本体（知识结构）
- 基于本体整理出易读的内容
- 用户获得结构清晰的阅读体验

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

**处理详情展示（新增）**
- 可折叠的进度追踪区域
- 显示每个步骤的耗时和token消耗
- 可查看AI输入内容（Prompt）
- 可查看AI输出内容（Response）
- 用于成本分析和流程优化

**示例输出**：
```markdown
## 核心摘要
自由能原理是一个统一的理论框架...

## 理论背景
**预测误差最小化**是生物系统维持稳态的核心机制...

## 关键要点
- 预测误差的计算方法
- 与热力学熵的同构关系
- 在神经科学中的应用
```

---

## 3. 数据模型

### 3.1 Meta Ontology 框架

**顶级知识领域（6个）**：
- `DOM_COMPUTATION_FORMAL`: 计算与形式科学
- `DOM_COGNITIVE_COMPLEXITY`: 认知与复杂系统
- `DOM_PHYSICAL_NATURAL`: 物理与自然科学
- `DOM_HEALTH_PERFORMANCE`: 健康与人体效能
- `DOM_ART_DESIGN`: 艺术、媒体与设计
- `DOM_SOCIETY_TECH`: 技术与社会结构

**实体类型（5种）**：
- `THEORY_CONCEPT`: 理论/概念
- `ALGORITHM_METHOD`: 算法/方法
- `SYSTEM_MODEL`: 系统/模型
- `ARTIFACT_TOOL`: 创作物/工具
- `PERSON_ORGANIZATION`: 人物/组织

**核心关系词汇（9种）**：
- 结构: `is-a`, `part-of`
- 逻辑: `enables`, `contradicts`, `resolves`
- 跨学科: `isomorphic-to`, `applied-in`, `measures`

### 3.2 本体数据结构（JSON）

```json
{
  "version": 1,
  "created_at": "2026-02-24T10:00:00Z",
  "updated_at": "2026-02-24T10:00:00Z",
  "nodes": [
    {
      "id": "concept-free-energy",
      "name": "自由能原理",
      "type": "THEORY_CONCEPT",
      "description": "生物系统通过最小化预测误差来维持稳态",
      "properties": {
        "entity_type": "THEORY_CONCEPT",
        "domain": "DOM_COGNITIVE_COMPLEXITY",
        "definition": "理论定义详情"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "concept-free-energy",
      "target": "concept-entropy",
      "relation": "isomorphic-to",
      "relation_type": "cognitive",
      "description": "自由能原理与熵的结构同构",
      "strength": "strong",
      "cross_domain": true
    }
  ],
  "metadata": {
    "domains_used": ["DOM_COGNITIVE_COMPLEXITY"],
    "cross_domain_links": ["自由能原理 <isomorphic-to> 熵"],
    "core_concepts": ["自由能原理"],
    "system_loops": []
  }
}
```

### 3.3 处理步骤追踪（新增）

每次AI处理都会记录详细步骤和性能数据：

```json
{
  "processingSteps": [
    {
      "name": "🧠 AI构建知识本体",
      "status": "completed",
      "duration": 2350,
      "details": "生成 8 个概念节点，12 条关系",
      "tokens": {
        "prompt_tokens": 1250,
        "completion_tokens": 850,
        "total_tokens": 2100
      },
      "prompt": "完整的输入prompt...",
      "response": "AI返回的完整响应..."
    }
  ]
}
```

### 3.4 内容历史（可选，轻量级）

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

### 3.5 LocalStorage 键名设计

- `ontology_reading_ontology`: 当前本体数据
- `ontology_reading_history`: 内容历史（可选）
- `ontology_reading_settings`: 用户配置（AI模型参数）

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

### 4.2 技术栈（实际实现）

**前端（核心）**
- 框架：**React 18** + **Vite** ✅ 已实现
- 状态管理：**Zustand**（轻量） ✅ 已实现
- 图可视化：**React Flow** ✅ 已实现
- UI 组件：**Tailwind CSS** + **Headless UI** ✅ 已实现
- Markdown渲染：**react-markdown** ✅ 已实现
- HTTP 客户端：**fetch API** ✅ 已实现

**AI 模型配置**
- 默认模型：**Moonshot-v1-128k** (Kimi) ✅ 已配置
- 上下文窗口：128K tokens
- 支持模型：OpenAI GPT-4, Anthropic Claude, Moonshot

**数据存储**
- **LocalStorage** 用于本体和设置 ✅ 已实现
- 支持导出/导入 JSON ✅ 已实现
- 自动清理无效数据 ✅ 已实现

**部署**
- 前端：静态网站托管
- 环境变量：`.env.local` 存储 API Token

---

## 5. 核心界面设计

### 5.1 主界面布局（单页应用）

```
┌────────────────────────────────────────────────┐
│  Header: 🧠 Ontology Reader | ⚙️ 设置           │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────────┐  ┌───────────────────┐  │
│  │   左侧：输入区    │  │   右侧：本体图     │  │
│  │  [输入框]        │  │   [图可视化]      │  │
│  │  [提交按钮]      │  │   - 节点可拖拽     │  │
│  │                  │  │   - 双击编辑      │  │
│  │  ───────────     │  │   - 拖拽连接      │  │
│  │                  │  │                   │  │
│  │   输出区域        │  │                   │  │
│  │  ▼ 处理详情      │  │   [控制工具栏]    │  │
│  │    - 步骤耗时    │  │                   │  │
│  │    - Token统计   │  │                   │  │
│  │    ▶ 输入内容    │  │                   │  │
│  │    ▶ 输出内容    │  │                   │  │
│  │  ───────────     │  │                   │  │
│  │  [整理后的文章]  │  │                   │  │
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

### 6.1 Prompt 设计（基于 Meta Ontology）

#### Prompt 1: 首次本体构建

```
系统角色：
你是一个知识本体（Ontology）构建专家，精通图数据库、知识图谱和语义网技术。

# Meta Ontology 指导框架

## 1. 顶级知识领域
所有概念必须归属到以下至少一个领域：
- DOM_COMPUTATION_FORMAL: 计算与形式科学
- DOM_COGNITIVE_COMPLEXITY: 认知与复杂系统
- DOM_PHYSICAL_NATURAL: 物理与自然科学
- DOM_HEALTH_PERFORMANCE: 健康与人体效能
- DOM_ART_DESIGN: 艺术、媒体与设计
- DOM_SOCIETY_TECH: 技术与社会结构

## 2. 实体类型（必须使用）
- THEORY_CONCEPT: 理论/概念
- ALGORITHM_METHOD: 算法/方法
- SYSTEM_MODEL: 系统/模型
- ARTIFACT_TOOL: 创作物/工具
- PERSON_ORGANIZATION: 人物/组织

## 3. 核心关系词汇（严格限制）
- 结构: is-a, part-of
- 逻辑: enables, contradicts, resolves
- 跨学科: isomorphic-to, applied-in, measures

# 用户输入内容
{用户的资讯内容}

# 输出格式（严格JSON）
{
  "nodes": [{
    "id": "concept-xxx",  // kebab-case格式
    "name": "概念名称",
    "type": "THEORY_CONCEPT",  // 使用规范的实体类型
    "description": "清晰的概念定义",
    "properties": {
      "entity_type": "THEORY_CONCEPT",
      "domain": "DOM_COGNITIVE_COMPLEXITY"
    }
  }],
  "edges": [{
    "id": "edge-1",
    "source": "concept-xxx",  // ⚠️ 必须是nodes中存在的节点id
    "target": "concept-yyy",  // ⚠️ 必须是nodes中存在的节点id
    "relation": "isomorphic-to",  // 使用规范的关系类型
    "relation_type": "cognitive",
    "cross_domain": true
  }],
  "metadata": {
    "domains_used": ["DOM_COGNITIVE_COMPLEXITY"],
    "cross_domain_links": []
  }
}

# 关键约束
- 节点ID使用kebab-case（如：concept-free-energy）
- 边的source/target必须引用实际存在的节点id
- 不能使用"auto"、"manual"作为节点ID
- 主动识别跨领域的同构关系（isomorphic-to）
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

### 第 1 周：基础框架搭建 ✅ 已完成

**目标**：可运行的骨架

- [x] 初始化 React 项目 + Vite + Tailwind CSS
- [x] 搭建基础页面布局（左右分栏）
- [x] 集成 React Flow（图可视化库）
- [x] 实现 localStorage 读写工具函数
- [x] 创建基础状态管理（Zustand）
- [x] 实现手动编辑本体功能

**交付物**：✅ 静态页面，可手动添加节点并保存到 localStorage

---

### 第 2 周：AI 集成与本体构建 ✅ 已完成

**目标**：实现首次本体自动构建

- [x] 设置 AI API 调用（直接前端调用，环境变量存储Token）
- [x] 实现设置页面（输入 API Token）
- [x] 编写 Prompt 模板（基于 Meta Ontology）
- [x] 实现：输入资讯 → 调用 AI → 解析 JSON → 渲染图
- [x] 实现内容整理展示
- [x] 集成 Moonshot-v1-128k 模型

**交付物**：✅ 用户可输入资讯，自动生成本体并展示

---

### 第 3 周：进度追踪与透明化 ✅ 已完成

**目标**：实现处理过程可视化和成本分析

- [x] 实现处理步骤追踪（耗时、token统计）
- [x] 创建可折叠的进度展示区域
- [x] 实现AI输入内容（Prompt）展示
- [x] 实现AI输出内容（Response）展示
- [x] 自动清理无效边（sanitizeOntology）
- [x] 修复边的source字段混淆问题

**交付物**：✅ 完整透明的处理过程，支持成本分析和优化

---

### 第 4 周：Meta Ontology 框架集成 ✅ 已完成

**目标**：提升本体构建质量和一致性

- [x] 定义 Meta Ontology 框架（6领域+5实体+9关系）
- [x] 更新 Prompt 模板集成框架指导
- [x] 规范节点ID格式（kebab-case）
- [x] 规范关系类型（严格词汇表）
- [x] 识别跨领域同构关系（isomorphic-to）
- [x] 实现双击编辑节点功能
- [x] 实现拖拽创建关系功能
- [x] 实现删除节点/边功能
- [x] 实现导出/导入 JSON

**交付物**：✅ 完整可用的 MVP 产品，基于规范化本体框架

---

### 总计：4 周完成 MVP ✅ 已完成

**当前状态**：✅ 所有核心功能已实现并经过测试

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
# .env.local（实际使用）
VITE_AI_PROVIDER=moonshot
VITE_AI_MODEL=moonshot-v1-128k
VITE_AI_API_TOKEN=sk-xxx
VITE_AI_API_ENDPOINT=https://api.moonshot.cn/v1/chat/completions
```

---

## 13. 已实现的核心功能

### 13.1 本体构建与编辑 ✅
- 自动构建本体（首次输入）
- 更新现有本体（后续输入）
- 手动编辑节点和边
- 实时保存到 LocalStorage
- 导出/导入 JSON

### 13.2 Meta Ontology 框架 ✅
- 6个顶级知识领域分类
- 5种规范化实体类型
- 9种核心关系词汇
- 跨领域同构关系识别
- 自动清理无效边

### 13.3 处理过程透明化 ✅
- 可折叠的进度展示区域
- 每个步骤的耗时统计
- Token 消耗详细追踪
- AI 输入内容（Prompt）展示
- AI 输出内容（Response）展示
- 支持成本分析和流程优化

### 13.4 内容整理与展示 ✅
- 基于本体的结构化输出
- Markdown 格式渲染
- 概念高亮显示
- 流畅易读的文章形式

---

**文档版本**：3.0 - 实际实现版
**开发完成时间**：4 周（已完成）
**开发人数**：1 人
**技术栈**：React 18 + Vite + Zustand + React Flow + Tailwind CSS
**AI 模型**：Moonshot-v1-128k (128K context)
**总成本**：极低（主要是 AI API 调用费用）

---

## 🎉 MVP 已完成！

所有核心功能已实现并经过测试，系统运行稳定。
