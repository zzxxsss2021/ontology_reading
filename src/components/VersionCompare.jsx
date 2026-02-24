import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { compareOntologies, generateDiffSummary } from '../utils/ontologyDiff';

/**
 * 版本对比组件
 * TODO: 待AI集成后完善
 *
 * 当前为简化版本，后续需要：
 * 1. 展示左右两列的本体图对比
 * 2. 高亮差异（新增/删除/修改）
 * 3. 提供三个操作按钮的完整逻辑
 */
function VersionCompare({ isOpen, onClose, oldOntology, newOntology, onAccept, onReject, onManualEdit }) {
  if (!oldOntology || !newOntology) {
    return null;
  }

  const diff = compareOntologies(oldOntology, newOntology);
  const summary = generateDiffSummary(diff);

  const handleAccept = () => {
    if (onAccept) {
      onAccept(newOntology);
    }
    onClose();
  };

  const handleReject = () => {
    if (onReject) {
      onReject();
    }
    onClose();
  };

  const handleManualEdit = () => {
    if (onManualEdit) {
      onManualEdit(newOntology);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full rounded-lg bg-white shadow-xl">
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <Dialog.Title className="text-lg font-semibold">
              本体版本对比
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* 内容区域 */}
          <div className="px-6 py-4">
            {/* 对比视图 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* 旧版本 */}
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  旧版本 (v{oldOntology.version})
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>节点数: {oldOntology.nodes.length}</p>
                  <p>边数: {oldOntology.edges.length}</p>
                  <p className="text-xs text-gray-500">
                    更新于: {new Date(oldOntology.updated_at).toLocaleString('zh-CN')}
                  </p>
                </div>
                {/* TODO: 添加本体图可视化 */}
              </div>

              {/* 新版本 */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <h3 className="text-sm font-semibold text-blue-700 mb-3">
                  新版本 (v{newOntology.version})
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>节点数: {newOntology.nodes.length}</p>
                  <p>边数: {newOntology.edges.length}</p>
                  <p className="text-xs text-gray-500">
                    生成于: {new Date(newOntology.updated_at).toLocaleString('zh-CN')}
                  </p>
                </div>
                {/* TODO: 添加本体图可视化 */}
              </div>
            </div>

            {/* 变更摘要 */}
            <div className="border rounded-lg p-4 bg-gray-50 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                变更摘要
              </h3>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                {summary}
              </pre>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                请选择如何处理新版本的本体
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleReject}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  保留旧版本
                </button>
                <button
                  onClick={handleManualEdit}
                  className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50"
                >
                  手动调整
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  接受新版本
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default VersionCompare;
