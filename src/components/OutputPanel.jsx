import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import useOntologyStore from '../store/useOntologyStore';

/**
 * 输出面板组件 - 显示整理后的结构化内容
 */
function OutputPanel() {
  const { currentOutput, error, isLoading, processingSteps } = useOntologyStore();
  const [showProgress, setShowProgress] = useState(true);
  const [expandedPrompts, setExpandedPrompts] = useState({});

  return (
    <div className="h-1/2 flex flex-col">
      <div className="px-4 py-3 border-b bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700">整理后的内容</h2>
        <p className="text-xs text-gray-500 mt-1">
          基于本体结构整理，流畅易读
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        {/* 处理进度展示 */}
        {processingSteps.length > 0 && (
          <div className="border-b bg-gray-50">
            <button
              onClick={() => setShowProgress(!showProgress)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">处理详情</span>
                {isLoading && (
                  <span className="text-xs text-blue-600">进行中...</span>
                )}
              </div>
              <svg
                className={`h-5 w-5 text-gray-500 transition-transform ${showProgress ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProgress && (
              <div className="px-4 pb-4 space-y-2">
                {processingSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <div className="flex-shrink-0 mt-0.5">
                      {step.status === 'running' && (
                        <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {step.status === 'completed' && (
                        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {step.status === 'error' && (
                        <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${step.status === 'error' ? 'text-red-600' : 'text-gray-700'}`}>
                          {step.name}
                        </span>
                        {step.duration !== undefined && (
                          <span className="text-xs text-gray-500 ml-2">
                            {step.duration < 1000 ? `${step.duration}ms` : `${(step.duration / 1000).toFixed(2)}s`}
                          </span>
                        )}
                      </div>
                      {step.details && (
                        <p className="text-xs text-gray-500 mt-0.5">{step.details}</p>
                      )}
                      {step.tokens && (
                        <div className="text-xs text-gray-500 mt-0.5 flex gap-3">
                          {step.tokens.prompt_tokens && (
                            <span>输入: {step.tokens.prompt_tokens} tokens</span>
                          )}
                          {step.tokens.completion_tokens && (
                            <span>输出: {step.tokens.completion_tokens} tokens</span>
                          )}
                          {step.tokens.total_tokens && (
                            <span className="font-medium">总计: {step.tokens.total_tokens} tokens</span>
                          )}
                        </div>
                      )}
                      {step.error && (
                        <p className="text-xs text-red-500 mt-0.5">{step.error}</p>
                      )}
                      {step.prompt && (
                        <div className="mt-2">
                          <button
                            onClick={() => setExpandedPrompts(prev => ({
                              ...prev,
                              [index]: !prev[index]
                            }))}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            {expandedPrompts[index] ? '收起' : '查看'} 输入内容
                            <svg
                              className={`h-3 w-3 transition-transform ${expandedPrompts[index] ? 'rotate-180' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {expandedPrompts[index] && (
                            <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200 max-h-60 overflow-y-auto">
                              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                                {step.prompt}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* 总计信息 */}
                {processingSteps.length > 0 && processingSteps.every(s => s.status === 'completed') && (
                  <div className="pt-2 mt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-700">总耗时</span>
                      <span className="text-gray-900 font-semibold">
                        {(() => {
                          const total = processingSteps.reduce((sum, s) => sum + (s.duration || 0), 0);
                          return total < 1000 ? `${total}ms` : `${(total / 1000).toFixed(2)}s`;
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="font-medium text-gray-700">总Token消耗</span>
                      <span className="text-gray-900 font-semibold">
                        {(() => {
                          const total = processingSteps.reduce((sum, s) =>
                            sum + (s.tokens?.total_tokens || 0), 0);
                          return `${total} tokens`;
                        })()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 内容区域 */}
        <div className="p-4">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">正在分析资讯...</p>
              </div>
            </div>
          )}

          {error && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">提示</h3>
                <div className="mt-2 text-sm text-yellow-700">{error}</div>
              </div>
            </div>
            </div>
          )}

          {!isLoading && !error && currentOutput && (
            <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                // 自定义渲染方括号包裹的概念
                p: ({ children }) => {
                  const text = String(children);
                  const parts = text.split(/(\[.*?\])/g);

                  return (
                    <p>
                      {parts.map((part, index) => {
                        if (part.match(/\[(.*?)\]/)) {
                          const concept = part.slice(1, -1);
                          return (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium cursor-pointer hover:bg-blue-200"
                              title="点击在图中高亮此概念"
                            >
                              {concept}
                            </span>
                          );
                        }
                        return part;
                      })}
                    </p>
                  );
                }
              }}
            >
              {currentOutput}
              </ReactMarkdown>
            </div>
          )}

          {!isLoading && !error && !currentOutput && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-gray-400 max-w-sm px-6">
                <svg
                  className="mx-auto h-12 w-12 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm mb-2">等待整理内容</p>
                <p className="text-xs text-gray-500">
                  在左侧输入资讯，AI 将构建知识本体，并输出易读的整理内容
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OutputPanel;
