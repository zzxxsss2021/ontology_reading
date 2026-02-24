import { useEffect, useState } from 'react';
import useOntologyStore from './store/useOntologyStore';
import OntologyGraph from './components/OntologyGraph';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import SettingsModal from './components/SettingsModal';
import ProcessingProgress from './components/ProcessingProgress';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

/**
 * 主应用组件
 */
function App() {
  const { initialize } = useOntologyStore();
  const [showSettings, setShowSettings] = useState(false);

  // 初始化：从localStorage加载数据
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="h-16 border-b flex items-center justify-between px-6 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            🧠
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Ontology Reader</h1>
            <p className="text-xs text-gray-500">智能本体资讯阅读系统</p>
          </div>
        </div>

        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Cog6ToothIcon className="h-5 w-5" />
          设置
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Input & Output */}
        <div className="w-1/2 flex flex-col border-r bg-white">
          <InputPanel />
          <OutputPanel />
        </div>

        {/* Right Panel: Ontology Graph */}
        <div className="w-1/2 bg-gray-50">
          <div className="h-full flex flex-col">
            <div className="px-4 py-3 border-b bg-white">
              <h2 className="text-sm font-semibold text-gray-700">知识本体图</h2>
              <p className="text-xs text-gray-500 mt-1">
                双击节点编辑 · 拖拽连接创建关系 · Delete删除
              </p>
            </div>
            <div className="flex-1">
              <OntologyGraph />
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Processing Progress Modal */}
      <ProcessingProgress />

      {/* Footer (Optional) */}
      <footer className="h-8 border-t bg-gray-50 flex items-center justify-center text-xs text-gray-500">
        Ontology Reading MVP v0.1.0 - 基于图数据库本体构建的智能阅读系统
      </footer>
    </div>
  );
}

export default App;
