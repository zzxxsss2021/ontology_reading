/**
 * AI Prompt 模板 - 基于本体论（Ontology）和知识图谱最佳实践
 */

/**
 * 首次本体构建的Prompt模板
 */
export const BUILD_ONTOLOGY_PROMPT = `你是一个知识本体（Ontology）构建专家，精通图数据库、知识图谱和语义网技术。

# 任务目标
从用户提供的资讯内容中，构建一个结构化的知识本体。

# 本体论核心原则

## 1. 层次性（Hierarchical Structure）
- 识别不同**抽象层次**的概念
- 从具体到抽象组织概念
- 建立上下位关系（Classes 和 Subclasses）

示例层次：
- 第一层：具体实体/行为体（Who/What）
- 第二层：互动关系/过程（How）
- 第三层：系统/场域（Where）
- 第四层：状态/指标（Status）
- 第五层：趋势/规律（Why/Future）

## 2. 语义丰富性（Semantic Richness）
关系不应仅是"关联"，而应使用**明确的语义动词**：

### 结构关系
- is-a（是一个）：类别归属
- part-of（部分-整体）：组成关系
- has-a（拥有）：属性关系

### 行为关系
- produces（产生）
- influences（影响）
- triggers（触发）
- transforms（转化）
- regulates（调节）

### 时空关系
- occurs-in（发生于）
- precedes（先于）
- follows（后于）
- co-occurs（共现）

### 逻辑关系
- causes（导致）
- enables（使能）
- constrains（约束）
- contradicts（矛盾）

## 3. 系统性（Systemic View）
- 识别**反馈循环**
- 构建**闭环系统**
- 体现**涌现特性**

# 用户输入内容
{content}

# 输出格式（严格JSON）

{
  "nodes": [
    {
      "id": "node-1",
      "name": "概念名称",
      "type": "concept_type",
      "layer": 1,
      "description": "清晰的概念定义",
      "properties": {
        "abstract_level": "concrete|intermediate|abstract",
        "domain": "领域标签"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
      "relation": "具体语义动词",
      "relation_type": "structural|behavioral|temporal|logical",
      "description": "关系的详细说明",
      "strength": "strong|medium|weak"
    }
  ],
  "metadata": {
    "layers": ["第一层描述", "第二层描述", ...],
    "core_concepts": ["核心概念1", "核心概念2"],
    "system_loops": ["识别到的反馈循环描述"]
  }
}

# 质量要求

1. **概念数量**：5-20个核心概念（避免过度细分）
2. **层次清晰**：至少2-3个抽象层次
3. **关系明确**：每个关系必须有清晰的语义
4. **系统完整**：体现概念间的相互作用
5. **可推理性**：支持逻辑推导和知识发现

# 注意事项
- ID使用小写字母和连字符（如：concept-finance-market）
- 关系动词使用中文，简洁有力
- 优先识别系统性结构，而非罗列孤立概念
- 只返回JSON，不要其他说明文字`;

/**
 * 本体更新的Prompt模板
 */
export const UPDATE_ONTOLOGY_PROMPT = `你是一个知识本体融合专家，擅长将新知识整合到现有本体中。

# 现有本体结构
{existingOntology}

# 新输入的资讯内容
{content}

# 融合任务

## 1. 分析关联
- 识别新内容与现有本体的**语义关联**
- 判断新概念所属的**抽象层次**
- 发现**跨层次的关系**

## 2. 概念处理

### 新增概念
- 确定在本体层次中的位置
- 建立与现有概念的关系
- 补充系统性连接

### 现有概念
- 丰富概念定义
- 增强概念属性
- 发现新的关系

### 冗余概念
- 识别语义重复
- 进行概念合并
- 保持本体简洁

## 3. 关系优化
- 识别**隐含关系**（基于现有关系推导）
- 发现**反馈循环**
- 强化**系统闭环**

# 输出格式（严格JSON）

{
  "nodes": [...完整的节点列表，包含新旧节点...],
  "edges": [...完整的边列表，包含新旧关系...],
  "metadata": {
    "layers": [...],
    "core_concepts": [...],
    "system_loops": [...]
  },
  "changes": {
    "added_nodes": ["新增节点ID1", "新增节点ID2"],
    "added_edges": ["新增边ID1", "新增边ID2"],
    "removed_nodes": ["移除的冗余节点ID（如有）"],
    "removed_edges": ["移除的冗余关系ID（如有）"],
    "modified_nodes": ["修改的节点ID（如有）"],
    "insights": [
      "发现的新系统性关联1",
      "发现的新反馈循环2"
    ]
  }
}

# 融合原则
1. **保持一致性**：新概念融入现有层次结构
2. **增强系统性**：发现跨概念的系统关联
3. **避免冗余**：合并语义重复的概念
4. **丰富语义**：使用更精确的关系动词
5. **可追溯性**：在changes中清晰说明变更

只返回JSON，不要其他文字。`;

/**
 * 内容整理的Prompt模板
 */
export const FORMAT_CONTENT_PROMPT = `你是一个专业的资讯编辑和内容整理专家。

# 本体结构（仅供参考，用于辅助理解内容结构）
{ontology}

# 原始资讯内容
{content}

# 任务目标
将原始资讯整理成**流畅、易读、结构清晰**的文章，供用户阅读理解。

**重要**：本体只是辅助工具，不要在输出中展示本体结构、层次编号等技术细节。

# 输出要求

## 1. 核心摘要
用 2-3 段话总结内容的核心要点，让读者快速把握主旨。

## 2. 正文阐述
- 按照**逻辑顺序**展开内容（不是按本体层次）
- 使用清晰的段落结构
- 自然地串联各个概念
- 突出关键概念（用**加粗**标记）
- 说明概念间的关系时，使用流畅的叙述而非符号（如："A 影响 B"，而不是"A → B"）

## 3. 深入分析（如适用）
- 因果关系说明
- 系统性关联
- 趋势和影响

## 4. 关键要点
用简洁的列表总结 3-5 个核心要点。

---

# 写作风格
- ✅ 自然流畅，像一篇精心撰写的文章
- ✅ 重点突出，层次分明
- ✅ 专业但易懂
- ❌ 不要展示"第一层、第二层"等本体术语
- ❌ 不要使用箭头符号（→）表示关系
- ❌ 不要列出节点ID或技术字段

# 输出格式（Markdown）

[核心摘要 - 2-3段]

## [合适的小标题1]

[流畅的段落阐述...]

## [合适的小标题2]

[继续阐述...]

## 关键要点

- 要点1
- 要点2
- 要点3

---

**只返回给用户阅读的文章内容，不要包含任何本体结构说明。**`;

/**
 * 获取Prompt模板
 * @param {string} type - 模板类型：'build' | 'update' | 'format'
 * @param {Object} params - 模板参数
 * @returns {string} 填充后的Prompt
 */
export function getPromptTemplate(type, params) {
  let template = '';

  switch (type) {
    case 'build':
      template = BUILD_ONTOLOGY_PROMPT;
      break;
    case 'update':
      template = UPDATE_ONTOLOGY_PROMPT;
      if (params.existingOntology) {
        params.existingOntology = JSON.stringify(params.existingOntology, null, 2);
      }
      break;
    case 'format':
      template = FORMAT_CONTENT_PROMPT;
      if (params.ontology) {
        // 提取本体的层次和结构信息
        const ontologyStr = JSON.stringify(params.ontology, null, 2);
        params.ontology = ontologyStr;
      }
      break;
    default:
      throw new Error(`Unknown prompt type: ${type}`);
  }

  // 替换模板变量
  let result = template;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`{${key}}`, value);
  }

  return result;
}

export default {
  BUILD_ONTOLOGY_PROMPT,
  UPDATE_ONTOLOGY_PROMPT,
  FORMAT_CONTENT_PROMPT,
  getPromptTemplate
};
