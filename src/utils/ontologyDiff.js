/**
 * 本体对比工具 - 用于比较新旧本体版本的差异
 */

/**
 * 比较两个本体，返回差异信息
 * @param {Object} oldOntology - 旧版本本体
 * @param {Object} newOntology - 新版本本体
 * @returns {Object} 差异对象
 */
export function compareOntologies(oldOntology, newOntology) {
  if (!oldOntology || !newOntology) {
    return {
      addedNodes: newOntology?.nodes || [],
      removedNodes: oldOntology?.nodes || [],
      modifiedNodes: [],
      addedEdges: newOntology?.edges || [],
      removedEdges: oldOntology?.edges || [],
      modifiedEdges: []
    };
  }

  const diff = {
    addedNodes: [],
    removedNodes: [],
    modifiedNodes: [],
    addedEdges: [],
    removedEdges: [],
    modifiedEdges: []
  };

  // 创建ID映射便于查找
  const oldNodeMap = new Map(oldOntology.nodes.map(n => [n.id, n]));
  const newNodeMap = new Map(newOntology.nodes.map(n => [n.id, n]));

  const oldEdgeMap = new Map(oldOntology.edges.map(e => [e.id, e]));
  const newEdgeMap = new Map(newOntology.edges.map(e => [e.id, e]));

  // 比较节点
  // 1. 找出新增的节点
  newOntology.nodes.forEach(node => {
    if (!oldNodeMap.has(node.id)) {
      diff.addedNodes.push(node);
    } else {
      // 检查是否有修改
      const oldNode = oldNodeMap.get(node.id);
      if (isNodeModified(oldNode, node)) {
        diff.modifiedNodes.push({
          old: oldNode,
          new: node
        });
      }
    }
  });

  // 2. 找出删除的节点
  oldOntology.nodes.forEach(node => {
    if (!newNodeMap.has(node.id)) {
      diff.removedNodes.push(node);
    }
  });

  // 比较边
  // 1. 找出新增的边
  newOntology.edges.forEach(edge => {
    if (!oldEdgeMap.has(edge.id)) {
      diff.addedEdges.push(edge);
    } else {
      // 检查是否有修改
      const oldEdge = oldEdgeMap.get(edge.id);
      if (isEdgeModified(oldEdge, edge)) {
        diff.modifiedEdges.push({
          old: oldEdge,
          new: edge
        });
      }
    }
  });

  // 2. 找出删除的边
  oldOntology.edges.forEach(edge => {
    if (!newEdgeMap.has(edge.id)) {
      diff.removedEdges.push(edge);
    }
  });

  return diff;
}

/**
 * 检查节点是否被修改
 */
function isNodeModified(oldNode, newNode) {
  return (
    oldNode.name !== newNode.name ||
    oldNode.type !== newNode.type ||
    oldNode.description !== newNode.description
  );
}

/**
 * 检查边是否被修改
 */
function isEdgeModified(oldEdge, newEdge) {
  return (
    oldEdge.source !== newEdge.source ||
    oldEdge.target !== newEdge.target ||
    oldEdge.relation !== newEdge.relation ||
    oldEdge.description !== newEdge.description
  );
}

/**
 * 生成差异摘要文本
 */
export function generateDiffSummary(diff) {
  const summary = [];

  if (diff.addedNodes.length > 0) {
    summary.push(`✅ 新增节点: ${diff.addedNodes.map(n => n.name).join(', ')}`);
  }

  if (diff.addedEdges.length > 0) {
    summary.push(`✅ 新增关系: ${diff.addedEdges.length} 条`);
  }

  if (diff.modifiedNodes.length > 0) {
    summary.push(`📝 修改节点: ${diff.modifiedNodes.map(m => m.new.name).join(', ')}`);
  }

  if (diff.modifiedEdges.length > 0) {
    summary.push(`📝 修改关系: ${diff.modifiedEdges.length} 条`);
  }

  if (diff.removedNodes.length > 0) {
    summary.push(`❌ 删除节点: ${diff.removedNodes.map(n => n.name).join(', ')}`);
  }

  if (diff.removedEdges.length > 0) {
    summary.push(`❌ 删除关系: ${diff.removedEdges.length} 条`);
  }

  if (summary.length === 0) {
    return '无变更';
  }

  return summary.join('\n');
}

/**
 * 检查是否有实质性变更
 */
export function hasSignificantChanges(diff) {
  return (
    diff.addedNodes.length > 0 ||
    diff.removedNodes.length > 0 ||
    diff.modifiedNodes.length > 0 ||
    diff.addedEdges.length > 0 ||
    diff.removedEdges.length > 0 ||
    diff.modifiedEdges.length > 0
  );
}

export default {
  compareOntologies,
  generateDiffSummary,
  hasSignificantChanges
};
