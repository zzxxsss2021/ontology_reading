/**
 * AI 服务接口 - 用于调用AI模型进行本体构建和内容整理
 */

import { getPromptTemplate } from '../prompts/templates.js';

export class AIService {
  constructor(config) {
    // 环境变量默认值
    const envDefaults = {
      provider: import.meta.env.VITE_AI_PROVIDER || 'moonshot',
      modelName: import.meta.env.VITE_AI_MODEL || 'moonshot-v1-8k',
      apiToken: import.meta.env.VITE_AI_API_TOKEN || '',
      apiEndpoint: import.meta.env.VITE_AI_API_ENDPOINT || 'https://api.moonshot.cn/v1/chat/completions'
    };

    // 合并配置：传入的config优先，但空值使用环境变量填补
    this.config = {
      provider: config?.provider || config?.modelProvider || envDefaults.provider,
      modelName: config?.modelName || envDefaults.modelName,
      apiToken: config?.apiToken || envDefaults.apiToken,
      apiEndpoint: config?.apiEndpoint || envDefaults.apiEndpoint
    };

    // 调试日志
    console.log('AIService初始化配置:', {
      provider: this.config.provider,
      modelName: this.config.modelName,
      hasToken: !!this.config.apiToken,
      endpoint: this.config.apiEndpoint
    });
  }

  /**
   * 检查AI服务是否已配置
   */
  isConfigured() {
    return Boolean(this.config.apiToken && this.config.modelName);
  }

  /**
   * 首次构建本体
   * @param {string} content - 用户输入的资讯内容
   * @returns {Promise<Object>} 返回本体结构 { nodes: [], edges: [] }
   */
  async buildOntology(content) {
    if (!this.isConfigured()) {
      throw new Error('AI服务未配置，请在设置中配置API Token和模型名称');
    }

    try {
      // 1. 获取Prompt模板
      const prompt = getPromptTemplate('build', { content });

      // 2. 调用AI API
      const response = await this.callAI(prompt);

      // 3. 解析返回的JSON
      const ontology = this.parseOntologyResponse(response);

      // 4. 返回本体数据
      return ontology;
    } catch (error) {
      console.error('构建本体失败:', error);
      throw new Error(`构建本体失败: ${error.message}`);
    }
  }

  /**
   * 更新已有本体
   * @param {string} content - 新的资讯内容
   * @param {Object} existingOntology - 现有的本体结构
   * @returns {Promise<Object>} 返回更新后的本体结构和变更信息
   */
  async updateOntology(content, existingOntology) {
    if (!this.isConfigured()) {
      throw new Error('AI服务未配置，请在设置中配置API Token和模型名称');
    }

    try {
      // 1. 获取Prompt模板
      const prompt = getPromptTemplate('update', { content, existingOntology });

      // 2. 调用AI API
      const response = await this.callAI(prompt);

      // 3. 解析返回的JSON
      const result = this.parseUpdateResponse(response);

      // 4. 返回新本体和变更信息
      return result;
    } catch (error) {
      console.error('更新本体失败:', error);
      throw new Error(`更新本体失败: ${error.message}`);
    }
  }

  /**
   * 基于本体整理内容
   * @param {string} content - 原始内容
   * @param {Object} ontology - 本体结构
   * @returns {Promise<string>} 返回格式化后的Markdown内容
   */
  async formatContent(content, ontology) {
    if (!this.isConfigured()) {
      throw new Error('AI服务未配置，请在设置中配置API Token和模型名称');
    }

    try {
      // 1. 获取Prompt模板
      const prompt = getPromptTemplate('format', { content, ontology });

      // 2. 调用AI API
      const response = await this.callAI(prompt);

      // 3. 返回格式化内容
      return response;
    } catch (error) {
      console.error('格式化内容失败:', error);
      throw new Error(`格式化内容失败: ${error.message}`);
    }
  }

  /**
   * 调用AI API的通用方法
   * @private
   */
  async callAI(prompt) {
    const { provider, modelName, apiToken, apiEndpoint } = this.config;

    console.log(`调用AI服务: ${provider} - ${modelName}`);

    try {
      // Moonshot (Kimi) API
      if (provider === 'moonshot') {
        return await this.callMoonshotAPI(prompt, modelName, apiToken, apiEndpoint);
      }

      // OpenAI API
      if (provider === 'openai') {
        return await this.callOpenAI(prompt, modelName, apiToken, apiEndpoint);
      }

      // Anthropic Claude API
      if (provider === 'anthropic') {
        return await this.callAnthropic(prompt, modelName, apiToken, apiEndpoint);
      }

      throw new Error(`不支持的AI提供商: ${provider}`);
    } catch (error) {
      console.error('AI API调用失败:', error);
      throw error;
    }
  }

  /**
   * 调用 Moonshot (Kimi) API
   */
  async callMoonshotAPI(prompt, modelName, apiToken, apiEndpoint) {
    const endpoint = apiEndpoint || 'https://api.moonshot.cn/v1/chat/completions';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的知识本体构建专家。请严格按照要求输出JSON格式的数据。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Moonshot API调用失败 (${response.status}): ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * 调用 OpenAI API
   */
  async callOpenAI(prompt, modelName, apiToken, apiEndpoint) {
    const endpoint = apiEndpoint || 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的知识本体构建专家。请严格按照要求输出JSON格式的数据。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API调用失败 (${response.status}): ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * 调用 Anthropic Claude API
   */
  async callAnthropic(prompt, modelName, apiToken, apiEndpoint) {
    const endpoint = apiEndpoint || 'https://api.anthropic.com/v1/messages';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiToken,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.3,
        system: '你是一个专业的知识本体构建专家。请严格按照要求输出JSON格式的数据。'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Anthropic API调用失败 (${response.status}): ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  /**
   * 解析本体构建响应
   */
  parseOntologyResponse(response) {
    try {
      // 尝试提取JSON（可能被markdown代码块包裹）
      const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, response];
      const jsonStr = jsonMatch[1].trim();

      const ontology = JSON.parse(jsonStr);

      // 验证格式
      if (!ontology.nodes || !Array.isArray(ontology.nodes)) {
        throw new Error('返回的本体数据缺少nodes字段');
      }
      if (!ontology.edges || !Array.isArray(ontology.edges)) {
        throw new Error('返回的本体数据缺少edges字段');
      }

      // 创建节点ID集合
      const nodeIds = new Set(ontology.nodes.map(n => n.id));

      // 过滤掉引用不存在节点的边
      const validEdges = ontology.edges.filter(edge => {
        const isValid = nodeIds.has(edge.source) && nodeIds.has(edge.target);
        if (!isValid) {
          console.warn(`移除无效边: ${edge.id} (${edge.source} -> ${edge.target})`);
        }
        return isValid;
      });

      const invalidEdgeCount = ontology.edges.length - validEdges.length;
      if (invalidEdgeCount > 0) {
        console.warn(`已自动移除 ${invalidEdgeCount} 条无效边`);
      }

      // 添加时间戳和版本
      return {
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        nodes: ontology.nodes.map(node => ({
          ...node,
          source: 'auto'
        })),
        edges: validEdges.map(edge => ({
          ...edge,
          source: 'auto'
        }))
      };
    } catch (error) {
      console.error('解析AI响应失败:', error);
      console.error('原始响应:', response);
      throw new Error(`解析AI响应失败: ${error.message}`);
    }
  }

  /**
   * 解析本体更新响应
   */
  parseUpdateResponse(response) {
    try {
      // 尝试提取JSON
      const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, response];
      const jsonStr = jsonMatch[1].trim();

      const result = JSON.parse(jsonStr);

      // 添加时间戳
      const updatedOntology = {
        ...result,
        version: (result.version || 1) + 1,
        updated_at: new Date().toISOString()
      };

      return {
        ontology: updatedOntology,
        changes: result.changes || {}
      };
    } catch (error) {
      console.error('解析更新响应失败:', error);
      console.error('原始响应:', response);
      throw new Error(`解析更新响应失败: ${error.message}`);
    }
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}

// 创建默认实例
let defaultAIService = null;

export function getAIService(config) {
  if (!defaultAIService || config) {
    defaultAIService = new AIService(config);
  }
  return defaultAIService;
}

export default AIService;
