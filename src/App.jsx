import { useEffect, useState } from 'react';
import useOntologyStore from './store/useOntologyStore';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import SettingsModal from './components/SettingsModal';
import OntologyManagement from './components/OntologyManagement';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

/**
 * 主应用组件
 */
function App() {
  const { initialize } = useOntologyStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showOntologyManagement, setShowOntologyManagement] = useState(false);

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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOntologyManagement(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
            title="本体后台管理"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            本体管理
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Cog6ToothIcon className="h-5 w-5" />
            设置
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Content Panel: Input & Output */}
        <div className="w-full flex flex-col bg-white">
          <InputPanel />
          <OutputPanel />
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Ontology Management Modal */}
      <OntologyManagement
        isOpen={showOntologyManagement}
        onClose={() => setShowOntologyManagement(false)}
      />

      {/* Footer (Optional) */}
      <footer className="h-8 border-t bg-gray-50 flex items-center justify-center text-xs text-gray-500">
        Ontology Reading MVP v0.1.0 - 基于图数据库本体构建的智能阅读系统
      </footer>
    </div>
  );
}

export default App;
