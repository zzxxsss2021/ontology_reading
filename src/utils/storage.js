// LocalStorage 键名常量
const STORAGE_KEYS = {
  ONTOLOGY: 'ontology_reading_ontology',
  HISTORY: 'ontology_reading_history',
  SETTINGS: 'ontology_reading_settings'
};

// LocalStorage 封装工具
export const storage = {
  // 本体相关
  getOntology() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ONTOLOGY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load ontology from localStorage:', error);
      return null;
    }
  },

  saveOntology(ontology) {
    try {
      localStorage.setItem(STORAGE_KEYS.ONTOLOGY, JSON.stringify(ontology));
      return true;
    } catch (error) {
      console.error('Failed to save ontology to localStorage:', error);
      return false;
    }
  },

  clearOntology() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ONTOLOGY);
      return true;
    } catch (error) {
      console.error('Failed to clear ontology from localStorage:', error);
      return false;
    }
  },

  // 历史记录相关
  getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load history from localStorage:', error);
      return [];
    }
  },

  saveHistory(history) {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      return true;
    } catch (error) {
      console.error('Failed to save history to localStorage:', error);
      return false;
    }
  },

  addHistoryItem(item) {
    const history = this.getHistory();
    history.unshift(item); // 添加到开头
    // 限制历史记录数量（最多100条）
    if (history.length > 100) {
      history.pop();
    }
    return this.saveHistory(history);
  },

  clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      return true;
    } catch (error) {
      console.error('Failed to clear history from localStorage:', error);
      return false;
    }
  },

  // 设置相关
  getSettings() {
    try {
      // 环境变量默认值
      const envDefaults = {
        modelProvider: import.meta?.env?.VITE_AI_PROVIDER || 'moonshot',
        modelName: import.meta?.env?.VITE_AI_MODEL || 'moonshot-v1-8k',
        apiToken: import.meta?.env?.VITE_AI_API_TOKEN || ''
      };

      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);

      if (data) {
        const saved = JSON.parse(data);
        // 合并保存的设置和环境变量，环境变量作为后备
        return {
          modelProvider: saved.modelProvider || envDefaults.modelProvider,
          modelName: saved.modelName || envDefaults.modelName,
          apiToken: saved.apiToken || envDefaults.apiToken
        };
      }

      // localStorage为空时，使用环境变量
      return envDefaults;
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
      // 错误时也使用环境变量作为默认值
      return {
        modelProvider: import.meta?.env?.VITE_AI_PROVIDER || 'moonshot',
        modelName: import.meta?.env?.VITE_AI_MODEL || 'moonshot-v1-8k',
        apiToken: import.meta?.env?.VITE_AI_API_TOKEN || ''
      };
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
      return false;
    }
  },

  // 导出所有数据
  exportAll() {
    return {
      ontology: this.getOntology(),
      history: this.getHistory(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString()
    };
  },

  // 导入数据
  importAll(data) {
    try {
      if (data.ontology) {
        this.saveOntology(data.ontology);
      }
      if (data.history) {
        this.saveHistory(data.history);
      }
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  },

  // 清空所有数据
  clearAll() {
    this.clearOntology();
    this.clearHistory();
    // 不清空设置
  }
};

export default storage;
