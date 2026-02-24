import { useState } from 'react';
import useOntologyStore from '../store/useOntologyStore';
import { getAIService } from '../utils/aiService';

/**
 * 输入面板组件 - 用于输入资讯内容
 */
function InputPanel() {
  const [inputContent, setInputContent] = useState('');
  const { settings, setLoading, setError, setCurrentOutput } = useOntologyStore();

  const handleSubmit = async () => {
    if (!inputContent.trim()) {
      setError('请输入资讯内容');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 获取AI服务实例
      const aiService = getAIService(settings);

      // 检查AI是否配置
      if (!aiService.isConfigured()) {
        setError('AI服务未配置。请先在设置中配置API Token和模型名称。');
        setLoading(false);
        return;
      }

      // TODO: 实现AI调用逻辑
      // 这里暂时显示提示信息
      setError('AI功能正在开发中，请等待后续更新。您可以先手动编辑本体图（双击节点编辑，拖拽创建连接）。');
      setLoading(false);

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="h-1/2 border-b flex flex-col">
      <div className="px-4 py-3 border-b bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700">资讯输入</h2>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <textarea
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          placeholder="在此输入您的资讯内容...&#10;&#10;例如：输入一篇文章、论文摘要、学习笔记等。&#10;&#10;系统将自动分析内容，构建或更新知识本体。"
          className="w-full h-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {inputContent.length} 字符
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setInputContent('')}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md"
          >
            清空
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!inputContent.trim()}
          >
            提交分析
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputPanel;
