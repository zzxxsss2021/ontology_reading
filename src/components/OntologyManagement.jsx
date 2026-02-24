import { useState, useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import useOntologyStore from '../store/useOntologyStore';
import { getAIService } from '../utils/aiService';
import mermaid from 'mermaid';

/**
 * 本体后台管理组件
 * 用于管理员构建和编辑本体结构
 */
function OntologyManagement({ isOpen, onClose }) {
  const { ontology, updateOntology, settings } = useOntologyStore();
  const [activeTab, setActiveTab] = useState('mermaid'); // mermaid | ai
  const [mermaidCode, setMermaidCode] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewKey, setPreviewKey] = useState(0);
  const mermaidRef = useRef(null);

  // 初始化 Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: { useMaxWidth: true }
    });
  }, []);

  // 从现有本体生成 Mermaid 代码
  useEffect(() => {
    if (isOpen && ontology && ontology.nodes && ontology.nodes.length > 0) {
      const code = generateMermaidFromOntology(ontology);
      setMermaidCode(code);
    } else if (isOpen) {
      setMermaidCode(getExampleMermaid());
    }
  }, [isOpen, ontology]);

  // 渲染 Mermaid 图
  useEffect(() => {
    if (mermaidCode && mermaidRef.current && activeTab === 'mermaid') {
      try {
        mermaidRef.current.innerHTML = mermaidCode;
        mermaid.run({
          nodes: [mermaidRef.current],
        });
      } catch (error) {
        console.error('Mermaid 渲染失败:', error);
      }
    }
  }, [mermaidCode, activeTab, previewKey]);

  // 从 Mermaid 生成本体
  const handleApplyMermaid = () => {
    try {
      const newOntology = parseMermaidToOntology(mermaidCode);
      updateOntology(newOntology);
      setError(null);
      alert('本体已更新！');
      onClose();
    } catch (error) {
      setError(`解析失败: ${error.message}`);
    }
  };

  // 通过 AI 生成本体
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      setError('请输入领域描述');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const effectiveSettings = {
        modelProvider: settings?.modelProvider || import.meta.env.VITE_AI_PROVIDER || 'moonshot',
        modelName: settings?.modelName || import.meta.env.VITE_AI_MODEL || 'moonshot-v1-128k',
        apiToken: settings?.apiToken || import.meta.env.VITE_AI_API_TOKEN || ''
      };

      const aiService = getAIService(effectiveSettings);

      if (!aiService.isConfigured()) {
        throw new Error('AI服务未配置');
      }

      // 使用特殊的本体构建 prompt
      const buildResult = await aiService.buildOntology(aiPrompt);
      const newOntology = buildResult.ontology;

      // 生成 Mermaid 代码供预览
      const code = generateMermaidFromOntology(newOntology);
      setMermaidCode(code);
      setActiveTab('mermaid');
      setPreviewKey(prev => prev + 1);

      setIsLoading(false);
    } catch (error) {
      console.error('AI 生成失败:', error);
      setError(`生成失败: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-6xl h-[90vh] bg-white rounded-lg shadow-xl flex flex-col">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div>
              <Dialog.Title className="text-xl font-bold text-gray-900">
                本体后台管理
              </Dialog.Title>
              <p className="text-sm text-gray-500 mt-1">
                构建和编辑知识本体结构（管理员专用）
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab 切换 */}
          <div className="px-6 pt-4 border-b">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('mermaid')}
                className={`pb-3 px-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'mermaid'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📊 Mermaid 编辑
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`pb-3 px-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'ai'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🤖 AI 生成
              </button>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'mermaid' && (
              <div className="h-full flex">
                {/* 左侧：代码编辑 */}
                <div className="w-1/2 p-6 border-r flex flex-col">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mermaid 图语法
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      使用 Mermaid flowchart 语法定义本体结构
                    </p>
                  </div>
                  <textarea
                    value={mermaidCode}
                    onChange={(e) => setMermaidCode(e.target.value)}
                    className="flex-1 font-mono text-sm p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="graph TD&#10;  A[概念A] -->|关系| B[概念B]"
                  />
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setPreviewKey(prev => prev + 1)}
                      className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                      🔄 刷新预览
                    </button>
                    <button
                      onClick={handleApplyMermaid}
                      className="flex-1 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                    >
                      ✓ 应用到本体
                    </button>
                  </div>
                </div>

                {/* 右侧：预览 */}
                <div className="w-1/2 p-6 flex flex-col">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      图形预览
                    </label>
                  </div>
                  <div className="flex-1 border rounded-lg overflow-auto bg-gray-50 p-4">
                    <div ref={mermaidRef} className="mermaid"></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="h-full p-6 flex flex-col">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    领域描述
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    输入领域描述，AI 将基于 Meta Ontology 框架自动生成本体结构
                  </p>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="w-full h-32 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例如：基于你对于经济、贸易、政治、金融等的专业知识和历史事件，构建一个本体架构作为你的大纲（参考图数据库中的本体构建概念）"
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-4">
                  <button
                    onClick={handleAIGenerate}
                    disabled={isLoading || !aiPrompt.trim()}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        生成中...
                      </>
                    ) : (
                      <>🤖 AI 生成本体</>
                    )}
                  </button>
                </div>

                <div className="flex-1 border rounded-lg p-4 bg-gray-50 overflow-auto">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">💡 提示：</p>
                    <ul className="space-y-1 text-xs">
                      <li>• 描述你想构建的知识领域（如：经济、金融、政治）</li>
                      <li>• AI 会基于 Meta Ontology 框架生成规范化的本体</li>
                      <li>• 生成后可在 Mermaid 标签页预览和调整</li>
                      <li>• 确认无误后点击"应用到本体"保存</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="px-6 py-3 border-t bg-red-50">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

// 从本体生成 Mermaid 代码
function generateMermaidFromOntology(ontology) {
  if (!ontology || !ontology.nodes) return getExampleMermaid();

  let code = 'graph TD\n';

  // 按 subgraph 分组节点
  const subgraphNodes = {};
  const standaloneNodes = [];
  const subgraphInfo = {};

  ontology.nodes.forEach(node => {
    if (node.properties?.is_subgraph) {
      // 这是一个 subgraph 节点
      subgraphInfo[node.id] = node.name;
      subgraphNodes[node.id] = [];
    } else if (node.properties?.subgraph) {
      // 这个节点属于某个 subgraph
      const subgraphId = node.properties.subgraph;
      if (!subgraphNodes[subgraphId]) {
        subgraphNodes[subgraphId] = [];
      }
      subgraphNodes[subgraphId].push(node);
    } else {
      // 独立节点
      standaloneNodes.push(node);
    }
  });

  // 生成 subgraph
  Object.keys(subgraphInfo).forEach(subgraphId => {
    const label = subgraphInfo[subgraphId];
    code += `    subgraph ${subgraphId} [${label}]\n`;

    if (subgraphNodes[subgraphId]) {
      subgraphNodes[subgraphId].forEach(node => {
        code += `        ${node.id}[${node.name}]\n`;
      });
    }

    code += `    end\n\n`;
  });

  // 生成独立节点
  standaloneNodes.forEach(node => {
    code += `    ${node.id}[${node.name}]\n`;
  });

  if (standaloneNodes.length > 0) {
    code += '\n';
  }

  // 添加边
  if (ontology.edges) {
    ontology.edges.forEach(edge => {
      code += `    ${edge.source} -- ${edge.relation} --> ${edge.target};\n`;
    });
  }

  return code;
}

// 从 Mermaid 解析本体
function parseMermaidToOntology(mermaidCode) {
  const nodes = [];
  const edges = [];
  const lines = mermaidCode.split('\n');
  let currentSubgraph = null;

  lines.forEach(line => {
    line = line.trim();
    // 移除末尾的分号
    line = line.replace(/;$/, '');

    // 解析 subgraph: subgraph A [标签]
    const subgraphMatch = line.match(/subgraph\s+(\S+)\s+\[([^\]]+)\]/);
    if (subgraphMatch) {
      const [, id, label] = subgraphMatch;
      currentSubgraph = { id, label };
      // 将 subgraph 本身也作为一个节点
      if (!nodes.find(n => n.id === id)) {
        nodes.push({
          id,
          name: label,
          type: 'SYSTEM_MODEL',
          description: `子图: ${label}`,
          properties: {
            entity_type: 'SYSTEM_MODEL',
            domain: 'DOM_SOCIETY_TECH',
            is_subgraph: true
          }
        });
      }
      return;
    }

    // 解析 subgraph 结束
    if (line === 'end') {
      currentSubgraph = null;
      return;
    }

    // 解析节点: A1[标签] 或 A1["标签"] 或 A1[标签]
    const nodeMatch = line.match(/^([A-Z]\d*)\[\"?([^\]\"]+)\"?\]/);
    if (nodeMatch) {
      const [, id, name] = nodeMatch;
      if (!nodes.find(n => n.id === id)) {
        nodes.push({
          id,
          name,
          type: 'THEORY_CONCEPT',
          description: currentSubgraph ? `属于: ${currentSubgraph.label}` : '',
          properties: {
            entity_type: 'THEORY_CONCEPT',
            domain: 'DOM_SOCIETY_TECH',
            subgraph: currentSubgraph?.id || null
          }
        });
      }
      return;
    }

    // 解析边: 支持多种格式
    // A -- 关系 --> B 或 A -->|关系| B 或 A --> B
    const edgePatterns = [
      /^([A-Z]\d*)\s+--\s+([^-]+)\s+-->\s+([A-Z]\d*)/,  // A -- 关系 --> B
      /^([A-Z]\d*)\s+-->?\|([^|]+)\|\s+([A-Z]\d*)/,      // A -->|关系| B
      /^([A-Z]\d*)\s+-->\s+([A-Z]\d*)/                    // A --> B
    ];

    for (const pattern of edgePatterns) {
      const match = line.match(pattern);
      if (match) {
        let source, relation, target;

        if (match.length === 4 && pattern === edgePatterns[0]) {
          // A -- 关系 --> B 格式
          [, source, relation, target] = match;
        } else if (match.length === 4 && pattern === edgePatterns[1]) {
          // A -->|关系| B 格式
          [, source, relation, target] = match;
        } else if (match.length === 3) {
          // A --> B 格式
          [, source, target] = match;
          relation = 'related-to';
        }

        edges.push({
          id: `edge-${edges.length + 1}`,
          source: source.trim(),
          target: target.trim(),
          relation: (relation || 'related-to').trim(),
          relation_type: 'structural',
          description: '',
          strength: 'medium',
          cross_domain: false
        });
        break;
      }
    }
  });

  return {
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    nodes,
    edges,
    metadata: {
      domains_used: ['DOM_SOCIETY_TECH'],
      cross_domain_links: [],
      core_concepts: nodes.slice(0, 5).map(n => n.name)
    }
  };
}

// 示例 Mermaid 代码（默认本体）
function getExampleMermaid() {
  return `graph TD
    subgraph A [第一层: 行为体]
        A1[主权国家]
        A2[超国家实体]
        A3[核心企业/行业]
        A4[市场（抽象集合）]
    end

    subgraph B [第二层: 互动关系]
        B1[贸易与资本流动]
        B2[政治与外交博弈]
        B3[规则制定与制裁]
        B4[技术竞争与合作]
    end

    subgraph C [第三层: 系统场域]
        C1[全球贸易与产业链系统]
        C2[国际政治与安全体系]
        C3[全球货币与金融体系]
        C4[科技与能源生态系统]
    end

    subgraph D [第四层: 压力指标]
        D1[经济压力]
        D2[金融压力]
        D3[社会压力]
        D4[地缘压力]
    end

    subgraph E [第五层: 趋势与风险]
        E1[确定性趋势]
        E2[核心风险]
    end

    A -- 通过行动产生 --> B;
    B -- 发生于并塑造 --> C;
    C -- 状态体现为 --> D;
    D -- 汇聚与传导为 --> E;
    E -- 反馈影响 --> A;`;
}

export default OntologyManagement;
