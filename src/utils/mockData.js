// 示例本体数据 - 用于首次加载和演示
export const sampleOntology = {
  version: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  nodes: [
    {
      id: 'node-1',
      name: 'Transformer',
      type: 'architecture',
      description: '基于注意力机制的神经网络架构',
      source: 'manual'
    },
    {
      id: 'node-2',
      name: 'Self-Attention',
      type: 'mechanism',
      description: '自注意力机制，允许模型关注输入序列的不同位置',
      source: 'manual'
    },
    {
      id: 'node-3',
      name: 'BERT',
      type: 'model',
      description: '双向编码器表示模型，基于Transformer的预训练语言模型',
      source: 'manual'
    },
    {
      id: 'node-4',
      name: 'Encoder',
      type: 'component',
      description: 'Transformer的编码器部分',
      source: 'manual'
    },
    {
      id: 'node-5',
      name: 'Decoder',
      type: 'component',
      description: 'Transformer的解码器部分',
      source: 'manual'
    }
  ],
  edges: [
    {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      relation: '包含',
      description: 'Transformer包含Self-Attention机制',
      source: 'manual'
    },
    {
      id: 'edge-2',
      source: 'node-3',
      target: 'node-1',
      relation: '基于',
      description: 'BERT基于Transformer架构',
      source: 'manual'
    },
    {
      id: 'edge-3',
      source: 'node-1',
      target: 'node-4',
      relation: '包含',
      description: 'Transformer包含Encoder',
      source: 'manual'
    },
    {
      id: 'edge-4',
      source: 'node-1',
      target: 'node-5',
      relation: '包含',
      description: 'Transformer包含Decoder',
      source: 'manual'
    }
  ]
};

// 示例输出内容
export const sampleOutput = `## 核心概念

- **[Transformer]** (架构): 基于注意力机制的神经网络架构
- **[Self-Attention]** (机制): 自注意力机制，允许模型关注输入序列的不同位置
- **[BERT]** (模型): 双向编码器表示模型
- **[Encoder]** (组件): Transformer的编码器部分
- **[Decoder]** (组件): Transformer的解码器部分

## 概念关系

- [Transformer] --包含--> [Self-Attention]
- [BERT] --基于--> [Transformer]
- [Transformer] --包含--> [Encoder]
- [Transformer] --包含--> [Decoder]

## 内容摘要

Transformer是一种革命性的神经网络架构，它完全基于注意力机制，摒弃了传统的循环神经网络结构。其核心创新是Self-Attention机制，使模型能够并行处理序列数据。

Transformer主要由Encoder和Decoder两部分组成。BERT作为Transformer的重要应用，仅使用了Encoder部分，通过双向训练获得了强大的语言理解能力。
`;
