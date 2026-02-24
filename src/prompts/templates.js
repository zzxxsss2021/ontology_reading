/**
 * AI Prompt 模板
 *
 * TODO: 待AI集成时完善和优化
 */

/**
 * 首次本体构建的Prompt模板
 */
export const BUILD_ONTOLOGY_PROMPT = `你是一个知识本体构建专家，擅长从文本中提取核心概念和关系。

用户输入的资讯内容：
{content}

任务：
1. 识别文本中的核心概念（实体、术语、关键词）
2. 识别概念之间的关系
3. 以 JSON 格式输出本体结构

输出格式（严格遵守JSON格式，不要有额外说明）：
{
  "nodes": [
    {
      "id": "唯一ID（小写字母和连字符）",
      "name": "概念名称",
      "type": "类型（architecture/mechanism/model/component/concept）",
      "description": "简短描述"
    }
  ],
  "edges": [
    {
      "id": "唯一ID",
      "source": "源节点ID",
      "target": "目标节点ID",
      "relation": "关系类型（包含/属于/基于/导致/关联等）",
      "description": "关系描述"
    }
  ]
}

注意事项：
- 保持概念精简（5-15个核心概念）
- 关系要有明确语义
- 所有ID使用小写字母和连字符格式，如：transformer-1
- 只返回JSON，不要其他文本`;

/**
 * 本体更新的Prompt模板
 */
export const UPDATE_ONTOLOGY_PROMPT = `你是一个知识本体融合专家，擅长将新知识整合到现有本体中。

现有本体结构：
{existingOntology}

新输入的资讯内容：
{content}

任务：
1. 分析新内容与现有本体的关联
2. 识别需要新增的概念和关系
3. 识别需要删除或修改的概念（如果有）
4. 生成更新后的完整本体

输出格式（严格遵守JSON格式）：
{
  "nodes": [...完整的节点列表...],
  "edges": [...完整的边列表...],
  "changes": {
    "added_nodes": ["新增节点ID1", "新增节点ID2"],
    "added_edges": ["新增边ID1"],
    "removed_nodes": ["删除节点ID（如有）"],
    "removed_edges": ["删除边ID（如有）"],
    "modified_nodes": ["修改节点ID（如有）"]
  }
}

注意事项：
- 保留所有现有的有效概念
- 合理融合新旧知识
- 避免重复概念
- 只返回JSON，不要其他文本`;

/**
 * 内容整理的Prompt模板
 */
export const FORMAT_CONTENT_PROMPT = `你是一个内容整理专家，基于本体结构组织和呈现信息。

本体结构：
{ontology}

原始资讯内容：
{content}

任务：
1. 基于本体结构重新组织内容
2. 使用 Markdown 格式输出
3. 高亮核心概念（用[]括起来）
4. 说明概念间的关系

输出格式：
## 核心概念
- **[概念1]** (类型): 描述
- **[概念2]** (类型): 描述

## 概念关系
- [概念1] --关系--> [概念2]
- [概念A] --关系--> [概念B]

## 内容摘要
基于本体的结构化内容说明...

注意事项：
- 所有概念名称用[]括起来
- 保持内容简洁清晰
- 突出重点和关联`;

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
        params.ontology = JSON.stringify(params.ontology, null, 2);
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
