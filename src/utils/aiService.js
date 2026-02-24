/**
 * AI 服务接口 - 用于调用AI模型进行本体构建和内容整理
 *
 * TODO: 待用户提供API配置后实现
 */

import { getPromptTemplate } from '../prompts/templates.js';

export class AIService {
  constructor(config) {
    this.config = config || {
      provider: 'openai',
      modelName: '',
      apiToken: '',
      apiEndpoint: ''
    };
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

    // TODO: 实现AI调用逻辑
    // 1. 获取Prompt模板
    // const prompt = getPromptTemplate('build', { content });
    //
    // 2. 调用AI API
    // const response = await this.callAI(prompt);
    //
    // 3. 解析返回的JSON
    // const ontology = JSON.parse(response);
    //
    // 4. 返回本体数据
    // return ontology;

    throw new Error('AI服务功能待实现 - 请等待后续开发');
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

    // TODO: 实现AI调用逻辑
    // 1. 获取Prompt模板
    // const prompt = getPromptTemplate('update', { content, existingOntology });
    //
    // 2. 调用AI API
    // const response = await this.callAI(prompt);
    //
    // 3. 解析返回的JSON
    // const result = JSON.parse(response);
    //
    // 4. 返回新本体和变更信息
    // return {
    //   ontology: result.ontology,
    //   changes: result.changes
    // };

    throw new Error('AI服务功能待实现 - 请等待后续开发');
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

    // TODO: 实现AI调用逻辑
    // 1. 获取Prompt模板
    // const prompt = getPromptTemplate('format', { content, ontology });
    //
    // 2. 调用AI API
    // const response = await this.callAI(prompt);
    //
    // 3. 返回格式化内容
    // return response;

    throw new Error('AI服务功能待实现 - 请等待后续开发');
  }

  /**
   * 调用AI API的通用方法
   * @private
   */
  async callAI(prompt) {
    const { provider, modelName, apiToken, apiEndpoint } = this.config;

    // TODO: 根据provider选择不同的API调用方式

    // OpenAI示例
    if (provider === 'openai') {
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
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`AI API调用失败: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    }

    // Anthropic Claude示例
    if (provider === 'anthropic') {
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
            { role: 'user', content: prompt }
          ],
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`AI API调用失败: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content[0].text;
    }

    throw new Error(`不支持的AI提供商: ${provider}`);
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
