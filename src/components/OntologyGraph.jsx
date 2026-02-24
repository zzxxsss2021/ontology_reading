import { useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import useOntologyStore from '../store/useOntologyStore';
import {
  convertToReactFlowNodes,
  convertToReactFlowEdges
} from '../utils/ontologyUtils';

/**
 * 本体图可视化组件 - 使用React Flow实现（只读模式）
 * 编辑功能已移至本体管理界面
 */
function OntologyGraph() {
  const { ontology } = useOntologyStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // 从本体数据加载到React Flow
  useEffect(() => {
    if (ontology && ontology.nodes && ontology.edges) {
      const flowNodes = convertToReactFlowNodes(ontology.nodes);
      const flowEdges = convertToReactFlowEdges(ontology.edges);

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [ontology, setNodes, setEdges]);

  // 如果没有本体，显示空状态
  if (!ontology || !ontology.nodes || ontology.nodes.length === 0) {
    return (
      <div className="h-full w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <svg
            className="mx-auto h-24 w-24 text-gray-300 mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            知识本体尚未构建
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            请点击右上角"本体管理"按钮构建知识本体
          </p>
          <div className="text-xs text-gray-400 space-y-1">
            <p>💡 本体将展示概念的层次结构</p>
            <p>🔗 揭示概念间的语义关系</p>
            <p>🎯 形成系统性的知识网络</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const typeColors = {
              architecture: '#3b82f6',
              mechanism: '#f59e0b',
              model: '#22c55e',
              component: '#ec4899',
              concept: '#6b7280'
            };
            return typeColors[node.data?.type] || '#6b7280';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}

export default OntologyGraph;
