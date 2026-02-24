/**
 * 本体工具函数 - 用于本体数据的转换和验证
 */

/**
 * 生成唯一ID
 */
export function generateId(prefix = 'node') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 将本体节点转换为React Flow节点格式
 */
export function convertToReactFlowNodes(ontologyNodes) {
  if (!ontologyNodes || !Array.isArray(ontologyNodes)) {
    return [];
  }

  return ontologyNodes.map((node, index) => ({
    id: node.id,
    type: 'default',
    position: calculateNodePosition(index, ontologyNodes.length),
    data: {
      label: node.name,
      ...node
    },
    style: getNodeStyle(node.type)
  }));
}

/**
 * 将本体边转换为React Flow边格式
 */
export function convertToReactFlowEdges(ontologyEdges) {
  if (!ontologyEdges || !Array.isArray(ontologyEdges)) {
    return [];
  }

  return ontologyEdges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.relation,
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#999', strokeWidth: 2 },
    labelStyle: { fontSize: 12, fill: '#666' },
    labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
    data: edge
  }));
}

/**
 * 将React Flow节点转换回本体节点格式
 */
export function convertFromReactFlowNodes(reactFlowNodes) {
  if (!reactFlowNodes || !Array.isArray(reactFlowNodes)) {
    return [];
  }

  return reactFlowNodes.map(node => ({
    id: node.id,
    name: node.data.label || node.data.name,
    type: node.data.type || 'concept',
    description: node.data.description || '',
    source: node.data.source || 'manual'
  }));
}

/**
 * 将React Flow边转换回本体边格式
 */
export function convertFromReactFlowEdges(reactFlowEdges) {
  if (!reactFlowEdges || !Array.isArray(reactFlowEdges)) {
    return [];
  }

  return reactFlowEdges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    relation: edge.label || edge.data?.relation || '关联',
    description: edge.data?.description || '',
    source: edge.data?.source || 'manual'
  }));
}

/**
 * 计算节点位置（简单的圆形布局）
 */
function calculateNodePosition(index, total) {
  const radius = 200;
  const centerX = 400;
  const centerY = 300;
  const angle = (2 * Math.PI * index) / total;

  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle)
  };
}

/**
 * 根据节点类型获取样式
 */
function getNodeStyle(type) {
  const baseStyle = {
    padding: 10,
    borderRadius: '50%',
    border: '2px solid',
    fontSize: 12,
    fontWeight: 500,
    minWidth: 80,
    minHeight: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  };

  const typeStyles = {
    architecture: {
      backgroundColor: '#dbeafe',
      borderColor: '#3b82f6',
      color: '#1e40af'
    },
    mechanism: {
      backgroundColor: '#fef3c7',
      borderColor: '#f59e0b',
      color: '#92400e'
    },
    model: {
      backgroundColor: '#dcfce7',
      borderColor: '#22c55e',
      color: '#166534'
    },
    component: {
      backgroundColor: '#fce7f3',
      borderColor: '#ec4899',
      color: '#9f1239'
    },
    concept: {
      backgroundColor: '#f3f4f6',
      borderColor: '#6b7280',
      color: '#1f2937'
    }
  };

  return {
    ...baseStyle,
    ...(typeStyles[type] || typeStyles.concept)
  };
}

/**
 * 验证本体数据结构
 */
export function validateOntology(ontology) {
  if (!ontology || typeof ontology !== 'object') {
    return { valid: false, error: '本体数据无效' };
  }

  if (!Array.isArray(ontology.nodes)) {
    return { valid: false, error: '节点数据格式错误' };
  }

  if (!Array.isArray(ontology.edges)) {
    return { valid: false, error: '边数据格式错误' };
  }

  // 验证节点
  for (const node of ontology.nodes) {
    if (!node.id || !node.name) {
      return { valid: false, error: '节点缺少必要字段（id或name）' };
    }
  }

  // 验证边
  const nodeIds = new Set(ontology.nodes.map(n => n.id));
  for (const edge of ontology.edges) {
    if (!edge.id || !edge.source || !edge.target) {
      return { valid: false, error: '边缺少必要字段（id、source或target）' };
    }
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      return { valid: false, error: `边引用了不存在的节点: ${edge.id}` };
    }
  }

  return { valid: true };
}

/**
 * 创建空本体
 */
export function createEmptyOntology() {
  return {
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    nodes: [],
    edges: []
  };
}

/**
 * 更新本体时间戳
 */
export function updateOntologyTimestamp(ontology) {
  return {
    ...ontology,
    updated_at: new Date().toISOString()
  };
}

/**
 * 导出本体为JSON文件
 */
export function exportOntologyAsJSON(ontology, filename = 'ontology.json') {
  const dataStr = JSON.stringify(ontology, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * 从文件导入本体
 */
export function importOntologyFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const ontology = JSON.parse(e.target.result);
        const validation = validateOntology(ontology);

        if (!validation.valid) {
          reject(new Error(validation.error));
          return;
        }

        resolve(ontology);
      } catch (error) {
        reject(new Error('JSON解析失败: ' + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsText(file);
  });
}

export default {
  generateId,
  convertToReactFlowNodes,
  convertToReactFlowEdges,
  convertFromReactFlowNodes,
  convertFromReactFlowEdges,
  validateOntology,
  createEmptyOntology,
  updateOntologyTimestamp,
  exportOntologyAsJSON,
  importOntologyFromFile
};
