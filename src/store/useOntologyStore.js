import { create } from 'zustand';
import storage from '../utils/storage.js';
import { sampleOntology, sampleOutput } from '../utils/mockData.js';
import {
  generateId,
  validateOntology,
  createEmptyOntology,
  updateOntologyTimestamp,
  exportOntologyAsJSON,
  importOntologyFromFile
} from '../utils/ontologyUtils.js';

/**
 * Ontology Reading 全局状态管理
 */
const useOntologyStore = create((set, get) => ({
  // ========== 状态 ==========

  // 当前本体数据
  ontology: null,

  // 内容历史
  contentHistory: [],

  // 当前输出内容
  currentOutput: '',

  // 用户设置
  settings: {
    modelProvider: 'openai',
    modelName: '',
    apiToken: ''
  },

  // UI状态
  isLoading: false,
  error: null,

  // ========== Actions ==========

  /**
   * 初始化 - 从localStorage加载数据
   */
  initialize: () => {
    const savedOntology = storage.getOntology();
    const savedHistory = storage.getHistory();
    const savedSettings = storage.getSettings();

    set({
      ontology: savedOntology || null, // 初始为空，等待用户首次输入
      contentHistory: savedHistory,
      currentOutput: '', // 初始输出为空
      settings: savedSettings
    });
  },

  /**
   * 加载本体
   */
  loadOntology: () => {
    const ontology = storage.getOntology();
    if (ontology) {
      const validation = validateOntology(ontology);
      if (validation.valid) {
        set({ ontology, error: null });
        return true;
      } else {
        set({ error: validation.error });
        return false;
      }
    }
    return false;
  },

  /**
   * 保存本体
   */
  saveOntology: (ontology) => {
    const validation = validateOntology(ontology);
    if (!validation.valid) {
      set({ error: validation.error });
      return false;
    }

    const success = storage.saveOntology(ontology);
    if (success) {
      set({ ontology, error: null });
    } else {
      set({ error: '保存失败' });
    }
    return success;
  },

  /**
   * 更新整个本体
   */
  updateOntology: (newOntology) => {
    const updatedOntology = updateOntologyTimestamp(newOntology);
    return get().saveOntology(updatedOntology);
  },

  /**
   * 添加节点
   */
  addNode: (nodeData) => {
    const { ontology } = get();
    if (!ontology) {
      set({ error: '本体未初始化' });
      return false;
    }

    const newNode = {
      id: nodeData.id || generateId('node'),
      name: nodeData.name || '新概念',
      type: nodeData.type || 'concept',
      description: nodeData.description || '',
      source: 'manual'
    };

    const updatedOntology = {
      ...ontology,
      nodes: [...ontology.nodes, newNode]
    };

    return get().updateOntology(updatedOntology);
  },

  /**
   * 更新节点
   */
  updateNode: (nodeId, updates) => {
    const { ontology } = get();
    if (!ontology) return false;

    const updatedOntology = {
      ...ontology,
      nodes: ontology.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    };

    return get().updateOntology(updatedOntology);
  },

  /**
   * 删除节点（同时删除相关的边）
   */
  deleteNode: (nodeId) => {
    const { ontology } = get();
    if (!ontology) return false;

    const updatedOntology = {
      ...ontology,
      nodes: ontology.nodes.filter(node => node.id !== nodeId),
      edges: ontology.edges.filter(
        edge => edge.source !== nodeId && edge.target !== nodeId
      )
    };

    return get().updateOntology(updatedOntology);
  },

  /**
   * 添加边
   */
  addEdge: (edgeData) => {
    const { ontology } = get();
    if (!ontology) return false;

    const newEdge = {
      id: edgeData.id || generateId('edge'),
      source: edgeData.source,
      target: edgeData.target,
      relation: edgeData.relation || '关联',
      description: edgeData.description || '',
      source: 'manual'
    };

    const updatedOntology = {
      ...ontology,
      edges: [...ontology.edges, newEdge]
    };

    return get().updateOntology(updatedOntology);
  },

  /**
   * 更新边
   */
  updateEdge: (edgeId, updates) => {
    const { ontology } = get();
    if (!ontology) return false;

    const updatedOntology = {
      ...ontology,
      edges: ontology.edges.map(edge =>
        edge.id === edgeId ? { ...edge, ...updates } : edge
      )
    };

    return get().updateOntology(updatedOntology);
  },

  /**
   * 删除边
   */
  deleteEdge: (edgeId) => {
    const { ontology } = get();
    if (!ontology) return false;

    const updatedOntology = {
      ...ontology,
      edges: ontology.edges.filter(edge => edge.id !== edgeId)
    };

    return get().updateOntology(updatedOntology);
  },

  /**
   * 清空本体
   */
  clearOntology: () => {
    const emptyOntology = createEmptyOntology();
    storage.clearOntology();
    set({
      ontology: emptyOntology,
      currentOutput: '',
      error: null
    });
  },

  /**
   * 导出本体
   */
  exportOntology: () => {
    const { ontology } = get();
    if (!ontology) {
      set({ error: '没有可导出的本体' });
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    exportOntologyAsJSON(ontology, `ontology-${timestamp}.json`);
  },

  /**
   * 导入本体
   */
  importOntology: async (file) => {
    try {
      set({ isLoading: true, error: null });
      const ontology = await importOntologyFromFile(file);
      get().updateOntology(ontology);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return false;
    }
  },

  /**
   * 设置当前输出内容
   */
  setCurrentOutput: (output) => {
    set({ currentOutput: output });
  },

  /**
   * 添加历史记录
   */
  addHistoryItem: (item) => {
    const historyItem = {
      id: generateId('history'),
      timestamp: new Date().toISOString(),
      ...item
    };

    storage.addHistoryItem(historyItem);
    const history = storage.getHistory();
    set({ contentHistory: history });
  },

  /**
   * 清空历史
   */
  clearHistory: () => {
    storage.clearHistory();
    set({ contentHistory: [] });
  },

  /**
   * 更新设置
   */
  updateSettings: (newSettings) => {
    const updatedSettings = {
      ...get().settings,
      ...newSettings
    };
    storage.saveSettings(updatedSettings);
    set({ settings: updatedSettings });
  },

  /**
   * 设置加载状态
   */
  setLoading: (isLoading) => {
    set({ isLoading });
  },

  /**
   * 设置错误
   */
  setError: (error) => {
    set({ error });
  },

  /**
   * 清除错误
   */
  clearError: () => {
    set({ error: null });
  }
}));

export default useOntologyStore;
