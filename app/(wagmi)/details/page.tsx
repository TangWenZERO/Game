"use client";
import { useState } from "react";
import HeaderPlan from "../components/HeaderPlan";
import styles from "./style.module.css";

export default function DetailsPage() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, name: "题目详情" },
    { id: 1, name: "参与记录" },
  ];

  // 示例题目数据
  const questionData = {
    id: 1,
    title: "区块链基础知识测试",
    description:
      "这是一道关于区块链基础知识的测试题。请仔细阅读题目并选择正确答案。",
    tokenAmount: "0.5 ETH",
    participants: 24,
    status: "进行中",
    winner: null,
    creator: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    createTime: "2023-12-01 14:30",
    endTime: "2023-12-08 14:30",
  };

  // 示例参与记录数据
  const participationRecords = [
    {
      id: 1,
      participant: "0xAb5801a7D398351b8bE11C439e05C5B3259ae971",
      answer: "A",
      time: "2023-12-01 15:45",
      status: "正确",
    },
    {
      id: 2,
      participant: "0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520",
      answer: "B",
      time: "2023-12-01 16:30",
      status: "错误",
    },
  ];

  return (
    <div>
      <HeaderPlan />
      <div style={{ padding: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h3
            style={{
              background: "linear-gradient(90deg, #8a2be2, #00bfff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "2rem",
              margin: "0 0 10px 0",
            }}
          >
            题目详情
          </h3>
        </div>

        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* 题目卡片 */}
          <div
            style={{
              background: "linear-gradient(145deg, #1e1e2e, #252536)",
              border: "1px solid rgba(100, 100, 255, 0.2)",
              borderRadius: "16px",
              padding: "25px",
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
              backdropFilter: "blur(4px)",
              position: "relative",
              overflow: "hidden",
              marginBottom: "30px",
            }}
          >
            {/* 装饰性元素 */}
            <div
              style={{
                position: "absolute",
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(100, 100, 255, 0.1) 0%, transparent 70%)",
                top: "-75px",
                right: "-75px",
              }}
            />

            <div style={{ position: "relative", zIndex: 2 }}>
              <h2
                style={{
                  color: "white",
                  margin: "0 0 15px 0",
                  fontSize: "1.5rem",
                }}
              >
                {questionData.title}
              </h2>

              <p
                style={{
                  color: "#aaa",
                  lineHeight: "1.6",
                  marginBottom: "20px",
                }}
              >
                {questionData.description}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "15px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    padding: "15px",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      color: "#aaa",
                      fontSize: "0.9rem",
                      marginBottom: "5px",
                    }}
                  >
                    奖池金额
                  </div>
                  <div
                    style={{
                      color: "#1890ff",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    {questionData.tokenAmount}
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    padding: "15px",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      color: "#aaa",
                      fontSize: "0.9rem",
                      marginBottom: "5px",
                    }}
                  >
                    参与人数
                  </div>
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    {questionData.participants} 人
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    padding: "15px",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      color: "#aaa",
                      fontSize: "0.9rem",
                      marginBottom: "5px",
                    }}
                  >
                    状态
                  </div>
                  <div
                    style={{
                      color:
                        questionData.status === "进行中"
                          ? "#57a75a"
                          : "#ff8f00",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    {questionData.status}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  paddingTop: "20px",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#aaa",
                      fontSize: "0.9rem",
                      marginBottom: "5px",
                    }}
                  >
                    出题人
                  </div>
                  <div style={{ color: "#1890ff" }}>
                    {questionData.creator.substring(0, 6)}...
                    {questionData.creator.substring(
                      questionData.creator.length - 4
                    )}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      color: "#aaa",
                      fontSize: "0.9rem",
                      marginBottom: "5px",
                    }}
                  >
                    创建时间
                  </div>
                  <div style={{ color: "white" }}>
                    {questionData.createTime}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      color: "#aaa",
                      fontSize: "0.9rem",
                      marginBottom: "5px",
                    }}
                  >
                    结束时间
                  </div>
                  <div style={{ color: "white" }}>{questionData.endTime}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab切换 */}
          <div style={{}}>
            <div
              style={{
                display: "flex",
                position: "relative",
                marginBottom: "20px",
              }}
            >
              {/* 背景滑块 */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  height: "4px",
                  backgroundColor: "#1890ff",
                  borderRadius: "2px",
                  transition: "all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
                  transform: `translateX(${activeTab * 100}%)`,
                  width: "100px",
                }}
              />

              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "12px 20px",
                    marginRight: "10px",
                    background: "transparent",
                    color: activeTab === tab.id ? "#1890ff" : "#666",
                    border: "none",
                    borderRadius: "6px 6px 0 0",
                    cursor: "pointer",
                    fontWeight: activeTab === tab.id ? "bold" : "normal",
                    fontSize: "16px",
                    position: "relative",
                    zIndex: 2,
                    transition: "all 0.3s",
                    transform:
                      activeTab === tab.id ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Tab内容 */}
            <div
              style={{
                background: "linear-gradient(145deg, #1e1e2e, #252536)",
                border: "1px solid rgba(100, 100, 255, 0.2)",
                borderRadius: "16px",
                padding: "25px",
                boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
                backdropFilter: "blur(4px)",
                minHeight: "200px",
              }}
            >
              {activeTab === 0 && (
                <div>
                  <h3 style={{ color: "white", marginBottom: "15px" }}>
                    题目内容
                  </h3>
                  <p style={{ color: "#aaa", lineHeight: "1.6" }}>
                    这里是题目的具体内容。请根据以下选项选择正确答案：
                  </p>
                  <div style={{ marginTop: "20px" }}>
                    <div
                      style={{
                        padding: "15px",
                        background: "rgba(0, 0, 0, 0.2)",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        color: "white",
                      }}
                    >
                      A. 选项一的内容描述
                    </div>
                    <div
                      style={{
                        padding: "15px",
                        background: "rgba(0, 0, 0, 0.2)",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        color: "white",
                      }}
                    >
                      B. 选项二的内容描述
                    </div>
                    <div
                      style={{
                        padding: "15px",
                        background: "rgba(0, 0, 0, 0.2)",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        color: "white",
                      }}
                    >
                      C. 选项三的内容描述
                    </div>
                    <div
                      style={{
                        padding: "15px",
                        background: "rgba(0, 0, 0, 0.2)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    >
                      D. 选项四的内容描述
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "30px",
                      padding: "20px",
                      background: "rgba(24, 144, 255, 0.1)",
                      border: "1px solid rgba(24, 144, 255, 0.3)",
                      borderRadius: "8px",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 10px 0",
                        color: "#1890ff",
                        fontWeight: "bold",
                      }}
                    >
                      答题说明
                    </h4>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: "1.25rem",
                        color: "#aaa",
                      }}
                    >
                      <li style={{ marginBottom: "0.25rem" }}>
                        需要质押 0.01 ETH 参与答题
                      </li>
                      <li style={{ marginBottom: "0.25rem" }}>
                        答对即可获得奖池中的全部代币
                      </li>
                      <li>每个钱包地址只能参与一次</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 1 && (
                <div>
                  <h3 style={{ color: "white", marginBottom: "15px" }}>
                    参与记录
                  </h3>
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              borderBottom:
                                "1px solid rgba(255, 255, 255, 0.1)",
                              color: "#aaa",
                            }}
                          >
                            参与者
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              borderBottom:
                                "1px solid rgba(255, 255, 255, 0.1)",
                              color: "#aaa",
                            }}
                          >
                            答案
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              borderBottom:
                                "1px solid rgba(255, 255, 255, 0.1)",
                              color: "#aaa",
                            }}
                          >
                            时间
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              borderBottom:
                                "1px solid rgba(255, 255, 255, 0.1)",
                              color: "#aaa",
                            }}
                          >
                            状态
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {participationRecords.map((record) => (
                          <tr key={record.id}>
                            <td
                              style={{
                                padding: "12px",
                                borderBottom:
                                  "1px solid rgba(255, 255, 255, 0.1)",
                                color: "#1890ff",
                              }}
                            >
                              {record.participant.substring(0, 6)}...
                              {record.participant.substring(
                                record.participant.length - 4
                              )}
                            </td>
                            <td
                              style={{
                                padding: "12px",
                                borderBottom:
                                  "1px solid rgba(255, 255, 255, 0.1)",
                                color: "white",
                              }}
                            >
                              {record.answer}
                            </td>
                            <td
                              style={{
                                padding: "12px",
                                borderBottom:
                                  "1px solid rgba(255, 255, 255, 0.1)",
                                color: "white",
                              }}
                            >
                              {record.time}
                            </td>
                            <td
                              style={{
                                padding: "12px",
                                borderBottom:
                                  "1px solid rgba(255, 255, 255, 0.1)",
                                color:
                                  record.status === "正确"
                                    ? "#57a75a"
                                    : "#ff4d4f",
                              }}
                            >
                              {record.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
