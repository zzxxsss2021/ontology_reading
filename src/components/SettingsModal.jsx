import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import useOntologyStore from '../store/useOntologyStore';

/**
 * 设置模态框组件
 */
function SettingsModal({ isOpen, onClose }) {
  const {
    settings,
    updateSettings,
    exportOntology,
    importOntology,
    clearOntology,
    clearHistory
  } = useOntologyStore();

  const [formData, setFormData] = useState({
    modelProvider: 'openai',
    modelName: '',
    apiToken: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings(formData);
    onClose();
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const success = await importOntology(file);
      if (success) {
        alert('导入成功！');
      } else {
        alert('导入失败，请检查文件格式');
      }
    }
  };

  const handleClearOntology = () => {
    if (window.confirm('确定要清空本体吗？此操作不可恢复。')) {
      clearOntology();
      alert('本体已清空');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('确定要清空历史记录吗？')) {
      clearHistory();
      alert('历史记录已清空');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full rounded-lg bg-white shadow-xl">
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <Cog6ToothIcon className="h-6 w-6 text-gray-700" />
              <Dialog.Title className="text-lg font-semibold">设置</Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* 内容区域 */}
          <div className="px-6 py-4 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* AI 模型配置 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                AI 模型配置
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    模型提供商
                  </label>
                  <select
                    value={formData.modelProvider}
                    onChange={(e) =>
                      setFormData({ ...formData, modelProvider: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic (Claude)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    模型名称
                  </label>
                  <input
                    type="text"
                    value={formData.modelName}
                    onChange={(e) =>
                      setFormData({ ...formData, modelName: e.target.value })
                    }
                    placeholder="例如: gpt-4o, claude-opus-4-6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Token
                  </label>
                  <input
                    type="password"
                    value={formData.apiToken}
                    onChange={(e) =>
                      setFormData({ ...formData, apiToken: e.target.value })
                    }
                    placeholder="输入您的 API Token"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    您的 Token 将安全地存储在本地浏览器中
                  </p>
                </div>

                {!formData.apiToken && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-xs text-blue-800">
                      💡 AI功能需要配置API Token。配置后即可使用自动本体构建功能。
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 数据管理 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                数据管理
              </h3>
              <div className="space-y-2">
                <button
                  onClick={exportOntology}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  导出本体 JSON
                </button>

                <label className="block">
                  <span className="sr-only">导入本体</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    id="import-file"
                  />
                  <label
                    htmlFor="import-file"
                    className="block w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-center cursor-pointer"
                  >
                    导入本体 JSON
                  </label>
                </label>

                <button
                  onClick={handleClearHistory}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  清空历史记录
                </button>

                <button
                  onClick={handleClearOntology}
                  className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50"
                >
                  清空本体（危险操作）
                </button>
              </div>
            </div>

            {/* 关于 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">关于</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Ontology Reader v0.1.0</p>
                <p>智能本体资讯阅读系统</p>
                <p className="text-gray-500 mt-2">
                  基于图数据库本体构建概念，帮助您更好地组织和理解知识。
                </p>
              </div>
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="px-6 py-4 border-t flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              保存设置
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default SettingsModal;
