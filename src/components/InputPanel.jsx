import { useState } from 'react';
import useOntologyStore from '../store/useOntologyStore';
import { getAIService } from '../utils/aiService';

/**
 * 输入面板组件 - 用于输入资讯内容
 */
function InputPanel() {
  const [inputContent, setInputContent] = useState('');
  const {
    ontology,
    settings,
    updateOntology,
    setLoading,
    setError,
    setCurrentOutput,
    addHistoryItem,
    isLoading,
    addProcessingStep,
    updateProcessingStep,
    clearProcessingSteps,
    setShowProgress
  } = useOntologyStore();

  const handleSubmit = async () => {
    if (!inputContent.trim()) {
      setError('请输入资讯内容');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      clearProcessingSteps();
      setShowProgress(true);

      let stepIndex = 0;

      // 步骤1: 初始化配置
      addProcessingStep({ name: '初始化配置', status: 'running' });
      const effectiveSettings = {
        modelProvider: settings?.modelProvider || import.meta.env.VITE_AI_PROVIDER || 'moonshot',
        modelName: settings?.modelName || import.meta.env.VITE_AI_MODEL || 'moonshot-v1-8k',
        apiToken: settings?.apiToken || import.meta.env.VITE_AI_API_TOKEN || ''
      };
      const aiService = getAIService(effectiveSettings);

      if (!aiService.isConfigured()) {
        updateProcessingStep(stepIndex, { status: 'error', error: 'AI服务未配置' });
        setError('AI服务未配置。请先在设置中配置API Token和模型名称，或使用环境变量配置。');
        setLoading(false);
        return;
      }
      updateProcessingStep(stepIndex, { status: 'completed' });
      stepIndex++;

      const isFirstTime = !ontology || ontology.nodes.length === 0;
      let newOntology;
      let formattedContent;

      if (isFirstTime) {
        // 步骤2: 构建本体
        addProcessingStep({ name: '🧠 AI构建知识本体', status: 'running' });
        const ontologyStartTime = Date.now();
        newOntology = await aiService.buildOntology(inputContent);
        const ontologyDuration = Date.now() - ontologyStartTime;
        updateProcessingStep(stepIndex, {
          status: 'completed',
          duration: ontologyDuration,
          details: `生成 ${newOntology.nodes?.length || 0} 个概念节点，${newOntology.edges?.length || 0} 条关系`
        });
        stepIndex++;

        // 步骤3: 格式化内容
        addProcessingStep({ name: '📝 整理输出内容', status: 'running' });
        const formatStartTime = Date.now();
        formattedContent = await aiService.formatContent(inputContent, newOntology);
        const formatDuration = Date.now() - formatStartTime;
        updateProcessingStep(stepIndex, {
          status: 'completed',
          duration: formatDuration,
          details: `生成 ${formattedContent.length} 字符`
        });
        stepIndex++;

        // 步骤4: 保存数据
        addProcessingStep({ name: '💾 保存到本地存储', status: 'running' });
        updateOntology(newOntology);
        setCurrentOutput(formattedContent);
        addHistoryItem({
          input: inputContent,
          output: formattedContent,
          ontology_version: newOntology.version,
          type: 'build'
        });
        updateProcessingStep(stepIndex, { status: 'completed', duration: 0 });

      } else {
        // 步骤2: 更新本体
        addProcessingStep({ name: '🔄 AI更新知识本体', status: 'running' });
        const updateStartTime = Date.now();
        const result = await aiService.updateOntology(inputContent, ontology);
        newOntology = result.ontology;
        const updateDuration = Date.now() - updateStartTime;
        updateProcessingStep(stepIndex, {
          status: 'completed',
          duration: updateDuration,
          details: `新增 ${result.changes?.added_nodes?.length || 0} 个节点，${result.changes?.added_edges?.length || 0} 条关系`
        });
        stepIndex++;

        // 步骤3: 格式化内容
        addProcessingStep({ name: '📝 整理输出内容', status: 'running' });
        const formatStartTime = Date.now();
        formattedContent = await aiService.formatContent(inputContent, newOntology);
        const formatDuration = Date.now() - formatStartTime;
        updateProcessingStep(stepIndex, {
          status: 'completed',
          duration: formatDuration,
          details: `生成 ${formattedContent.length} 字符`
        });
        stepIndex++;

        // 步骤4: 保存数据
        addProcessingStep({ name: '💾 保存到本地存储', status: 'running' });
        updateOntology(newOntology);
        setCurrentOutput(formattedContent);
        addHistoryItem({
          input: inputContent,
          output: formattedContent,
          ontology_version: newOntology.version,
          type: 'update',
          changes: result.changes
        });
        updateProcessingStep(stepIndex, { status: 'completed', duration: 0 });
      }

      setLoading(false);
      setInputContent('');

      // 3秒后自动隐藏进度
      setTimeout(() => {
        setShowProgress(false);
      }, 3000);

    } catch (error) {
      console.error('AI处理失败:', error);
      setError(`处理失败: ${error.message}`);
      setLoading(false);

      // 标记当前步骤为失败
      const { processingSteps } = useOntologyStore.getState();
      const lastRunningIndex = processingSteps.findIndex(s => s.status === 'running');
      if (lastRunningIndex >= 0) {
        updateProcessingStep(lastRunningIndex, { status: 'error', error: error.message });
      }
    }
  };

  return (
    <div className="h-1/2 border-b flex flex-col">
      <div className="px-4 py-3 border-b bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700">资讯输入</h2>
        <p className="text-xs text-gray-500 mt-1">
          输入资讯内容，AI将自动构建或更新知识本体
        </p>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <textarea
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          placeholder="在此输入您的资讯内容...&#10;&#10;例如：输入一篇文章、论文摘要、学习笔记等。&#10;&#10;系统将自动分析内容，构建或更新知识本体。"
          className="w-full h-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          disabled={isLoading}
        />
      </div>

      <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {inputContent.length} 字符
          {isLoading && <span className="ml-2 text-blue-600">· 正在处理...</span>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setInputContent('')}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            清空
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={!inputContent.trim() || isLoading}
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? '分析中...' : '提交分析'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputPanel;
