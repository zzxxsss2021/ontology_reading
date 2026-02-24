import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import useOntologyStore from '../store/useOntologyStore';

/**
 * 处理进度展示组件 - 显示AI处理的各个步骤和耗时
 */
function ProcessingProgress() {
  const { processingSteps, showProgress, setShowProgress } = useOntologyStore();

  // 计算总耗时
  const totalDuration = processingSteps.reduce((sum, step) => {
    return sum + (step.duration || 0);
  }, 0);

  // 格式化耗时
  const formatDuration = (ms) => {
    if (ms === 0) return '< 1ms';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // 获取步骤图标
  const getStepIcon = (status) => {
    switch (status) {
      case 'running':
        return (
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'completed':
        return (
          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
        );
    }
  };

  return (
    <Transition appear show={showProgress} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                    处理进度
                  </Dialog.Title>
                  <button
                    onClick={() => setShowProgress(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* 步骤列表 */}
                <div className="space-y-3 mb-4">
                  {processingSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getStepIcon(step.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            step.status === 'error' ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {step.name}
                          </p>
                          {step.duration !== undefined && step.status === 'completed' && (
                            <span className="text-xs text-gray-500 ml-2">
                              {formatDuration(step.duration)}
                            </span>
                          )}
                        </div>
                        {step.details && (
                          <p className="text-xs text-gray-500 mt-1">{step.details}</p>
                        )}
                        {step.error && (
                          <p className="text-xs text-red-500 mt-1">{step.error}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 总耗时 */}
                {totalDuration > 0 && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">总耗时</span>
                      <span className="text-gray-900 font-semibold">
                        {formatDuration(totalDuration)}
                      </span>
                    </div>
                  </div>
                )}

                {/* 完成提示 */}
                {processingSteps.length > 0 &&
                 processingSteps.every(s => s.status === 'completed') && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 text-center">
                      ✓ 处理完成！
                    </p>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ProcessingProgress;
