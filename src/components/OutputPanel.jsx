import ReactMarkdown from 'react-markdown';
import useOntologyStore from '../store/useOntologyStore';

/**
 * 输出面板组件 - 显示整理后的结构化内容
 */
function OutputPanel() {
  const { currentOutput, error, isLoading } = useOntologyStore();

  return (
    <div className="h-1/2 flex flex-col">
      <div className="px-4 py-3 border-b bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700">结构化输出</h2>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
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
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
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
              <p>在左侧输入资讯内容，系统将自动整理并展示在这里</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
