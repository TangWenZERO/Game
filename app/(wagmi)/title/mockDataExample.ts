// 题目存储在数据库中的完整Mock数据结构示例

export interface QuestionOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface QuestionData {
  // 数据库自动生成的字段
  id: number;                 // 数据库唯一ID
  chainId?: number;           // 链上题目ID（合约调用成功后填充）
  transactionHash?: string;   // 交易哈希（合约调用成功后填充）
  
  // 题目基本信息
  question: string;           // 题目内容
  options: QuestionOption[];  // 选项列表
  correctOptionId: number | null; // 正确选项ID
  
  // 奖励信息
  rewardAmount: string;       // 奖励金额（ETH）
  currency: string;           // 奖励币种
  
  // 时间戳
  createdAt: string;          // 创建时间
  updatedAt?: string;         // 更新时间
  completedAt?: string;       // 完成时间
  
  // 状态信息
  status: 'draft' | 'pending' | 'confirmed' | 'completed' | 'expired' | 'cancelled';
  
  // 创建者信息
  creatorAddress?: string;    // 创建者钱包地址
  
  // 参与者信息
  participants?: string[];    // 参与者地址列表
  winnerAddress?: string;     // 获胜者地址
}

// 示例数据
export const mockQuestionData: QuestionData = {
  id: 1001,
  chainId: 12345,
  transactionHash: "0xe8b9f1b3e8a7c9d2f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f",
  
  question: "以下哪个城市是中国的首都？",
  options: [
    { id: 1, text: "上海", isCorrect: false },
    { id: 2, text: "广州", isCorrect: false },
    { id: 3, text: "北京", isCorrect: true },
    { id: 4, text: "深圳", isCorrect: false }
  ],
  correctOptionId: 3,
  
  rewardAmount: "0.01",
  currency: "ETH",
  
  createdAt: "2023-12-01T10:00:00Z",
  updatedAt: "2023-12-01T10:05:00Z",
  completedAt: "2023-12-01T10:15:30Z",
  
  status: "completed",
  
  creatorAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
  participants: [
    "0xAb5801a7D398351b8bE11C439e05C5B3259ae971",
    "0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520",
    "0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6"
  ],
  winnerAddress: "0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6"
};

// 题目列表示例
export const mockQuestionsList: QuestionData[] = [
  {
    id: 1001,
    chainId: 12345,
    transactionHash: "0xe8b9f1b3e8a7c9d2f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f",
    question: "以下哪个城市是中国的首都？",
    options: [
      { id: 1, text: "上海", isCorrect: false },
      { id: 2, text: "广州", isCorrect: false },
      { id: 3, text: "北京", isCorrect: true },
      { id: 4, text: "深圳", isCorrect: false }
    ],
    correctOptionId: 3,
    rewardAmount: "0.01",
    currency: "ETH",
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2023-12-01T10:05:00Z",
    completedAt: "2023-12-01T10:15:30Z",
    status: "completed",
    creatorAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    participants: [
      "0xAb5801a7D398351b8bE11C439e05C5B3259ae971",
      "0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520",
      "0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6"
    ],
    winnerAddress: "0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6"
  },
  {
    id: 1002,
    chainId: 12346,
    transactionHash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2",
    question: "以太坊的创始人是谁？",
    options: [
      { id: 1, text: "Vitalik Buterin", isCorrect: true },
      { id: 2, text: "Elon Musk", isCorrect: false },
      { id: 3, text: "Charlie Lee", isCorrect: false },
      { id: 4, text: "Gavin Wood", isCorrect: false }
    ],
    correctOptionId: 1,
    rewardAmount: "0.02",
    currency: "ETH",
    createdAt: "2023-12-02T14:30:00Z",
    updatedAt: "2023-12-02T14:35:00Z",
    status: "confirmed",
    creatorAddress: "0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520",
    participants: [
      "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4"
    ]
  },
  {
    id: 1003,
    question: "比特币的区块时间大约是多少分钟？",
    options: [
      { id: 1, text: "1分钟", isCorrect: false },
      { id: 2, text: "5分钟", isCorrect: false },
      { id: 3, text: "10分钟", isCorrect: true },
      { id: 4, text: "15分钟", isCorrect: false }
    ],
    correctOptionId: 3,
    rewardAmount: "0.015",
    currency: "ETH",
    createdAt: "2023-12-03T09:15:00Z",
    status: "pending", // 还未调用合约
    creatorAddress: "0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6"
  }
];