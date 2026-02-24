import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import useOntologyStore from '../store/useOntologyStore';
import {
  convertToReactFlowNodes,
  convertToReactFlowEdges,
  convertFromReactFlowNodes,
  convertFromReactFlowEdges,
  generateId
} from '../utils/ontologyUtils';
import { Dialog } from '@headlessui/react';

/**
 * 本体图可视化组件 - 使用React Flow实现
 */
function OntologyGraph() {
  const { ontology, updateNode, addNode, deleteNode, addEdge: addOntologyEdge, deleteEdge } = useOntologyStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // 编辑对话框状态
  const [editingNode, setEditingNode] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    type: 'concept',
    description: ''
  });

  // 从本体数据加载到React Flow
  useEffect(() => {
    if (ontology && ontology.nodes && ontology.edges) {
      const flowNodes = convertToReactFlowNodes(ontology.nodes);
      const flowEdges = convertToReactFlowEdges(ontology.edges);

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [ontology, setNodes, setEdges]);

  // 节点双击编辑
  const onNodeDoubleClick = useCallback((event, node) => {
    setEditingNode(node);
    setEditForm({
      name: node.data.name || node.data.label,
      type: node.data.type || 'concept',
      description: node.data.description || ''
    });
    setIsEditDialogOpen(true);
  }, []);

  // 保存节点编辑
  const handleSaveEdit = () => {
    if (editingNode) {
      updateNode(editingNode.id, editForm);
    }
    setIsEditDialogOpen(false);
    setEditingNode(null);
  };

  // 删除节点
  const handleDeleteNode = () => {
    if (editingNode) {
      deleteNode(editingNode.id);
    }
    setIsEditDialogOpen(false);
    setEditingNode(null);
  };

  // 连接节点（创建新边）
  const onConnect = useCallback(
    (connection) => {
      // 在React Flow中添加边
      const newEdge = {
        ...connection,
        id: generateId('edge'),
        type: 'smoothstep',
        animated: false,
        label: '关联',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));

      // 同步到本体数据
      addOntologyEdge({
        id: newEdge.id,
        source: connection.source,
        target: connection.target,
        relation: '关联',
        description: ''
      });
    },
    [setEdges, addOntologyEdge]
  );

  // 边被删除
  const onEdgesDelete = useCallback(
    (deletedEdges) => {
      deletedEdges.forEach(edge => {
        deleteEdge(edge.id);
      });
    },
    [deleteEdge]
  );

  // 节点位置变化时更新（可选：保存节点位置）
  const onNodeDragStop = useCallback((event, node) => {
    // 可以在这里保存节点位置到本体数据
    // 暂时不实现，因为每次加载都会重新计算布局
  }, []);

  return (
    <div className="h-full w-full bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeDragStop={onNodeDragStop}
        onEdgesDelete={onEdgesDelete}
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

      {/* 编辑节点对话框 */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold mb-4">
              编辑概念节点
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  概念名称
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  类型
                </label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="architecture">架构 (Architecture)</option>
                  <option value="mechanism">机制 (Mechanism)</option>
                  <option value="model">模型 (Model)</option>
                  <option value="component">组件 (Component)</option>
                  <option value="concept">概念 (Concept)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={handleDeleteNode}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
              >
                删除节点
              </button>
              <div className="space-x-2">
                <button
                  onClick={() => setIsEditDialogOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  保存
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default OntologyGraph;
