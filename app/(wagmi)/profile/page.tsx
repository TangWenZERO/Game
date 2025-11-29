"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";
import HeaderPlan from "../components/HeaderPlan";

// 示例数据
const statsData = [
  { id: 1, label: "出题数量", value: "12" },
  { id: 2, label: "答题数量", value: "48" },
  { id: 3, label: "质押中", value: "0.24 ETH" },
  { id: 4, label: "总收益", value: "1.86 ETH" },
  { id: 5, label: "总损失", value: "0.12 ETH" },
  { id: 6, label: "净收益", value: "1.74 ETH" },
];

const tabs = [
  { id: 0, name: "我出的题", count: 2 },
  { id: 1, name: "我答的题", count: 3 },
];

// 示例卡片数据
const myQuestions = [
  {
    id: 1,
    title: "区块链基础知识测试",
    tokenAmount: "0.5 ETH",
    participants: 24,
    status: "进行中",
    winner: null,
    creator: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    createTime: "2023-12-01 14:30",
  },
  {
    id: 2,
    title: "智能合约开发挑战",
    tokenAmount: "1.2 ETH",
    participants: 18,
    status: "已结束",
    winner: "0xAb5801a7D398351b8bE11C439e05C5B3259ae971",
    creator: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    createTime: "2023-11-28 09:15",
  },
];

const answeredQuestions = [
  {
    id: 1,
    title: "以太坊虚拟机原理",
    tokenAmount: "0.8 ETH",
    participants: 32,
    status: "已结束",
    winner: "0xAb5801a7D398351b8bE11C439e05C5B3259ae971",
    creator: "0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520",
    createTime: "2023-12-02 16:45",
  },
  {
    id: 2,
    title: "DeFi协议安全分析",
    tokenAmount: "1.5 ETH",
    participants: 42,
    status: "进行中",
    winner: null,
    creator: "0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520",
    createTime: "2023-12-03 11:20",
  },
  {
    id: 3,
    title: "Web3前端开发实践",
    tokenAmount: "0.3 ETH",
    participants: 15,
    status: "已结束",
    winner: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    creator: "0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520",
    createTime: "2023-11-30 13:10",
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  // 获取当前tab的数据
  const getCurrentTabData = () => {
    if (activeTab === 0) return myQuestions;
    if (activeTab === 1) return answeredQuestions;
    return [];
  };

  const currentData = getCurrentTabData();

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
            个人中心
          </h3>
          <h4
            style={{
              color: "#666",
              margin: "0",
              fontSize: "1rem",
            }}
          >
            钱包地址: 0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4
          </h4>
        </div>
        <div
          className={styles.cardContent}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "20px",
          }}
        >
          {statsData.map((stat) => (
            <div
              key={stat.id}
              style={{
                background: "linear-gradient(145deg, #1e1e2e, #252536)",
                border: "1px solid rgba(100, 100, 255, 0.2)",
                borderRadius: "16px",
                padding: "25px 20px",
                boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(100, 100, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(31, 38, 135, 0.2)";
              }}
              onClick={() => {
                router.push(`/details`);
              }}
            >
              {/* 装饰性圆形元素 */}
              <div
                style={{
                  position: "absolute",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(100, 100, 255, 0.1) 0%, transparent 70%)",
                  top: "-40px",
                  right: "-40px",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(100, 200, 255, 0.05) 0%, transparent 70%)",
                  bottom: "-25px",
                  left: "-25px",
                }}
              />

              {/* 卡片内容 */}
              <div style={{ position: "relative", zIndex: 2 }}>
                <div
                  style={{
                    color: "#aaa",
                    fontSize: "1rem",
                    marginBottom: "10px",
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    color: "white",
                    fontSize: "1.8rem",
                    fontWeight: "bold",
                    background:
                      stat.label === "净收益"
                        ? "linear-gradient(90deg, #8a2be2, #00bfff)"
                        : "none",
                    WebkitBackgroundClip:
                      stat.label === "净收益" ? "text" : "unset",
                    WebkitTextFillColor:
                      stat.label === "净收益" ? "transparent" : "white",
                  }}
                >
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={styles.tabPlan}
          style={{
            maxWidth: "1200px",
            margin: "40px auto 20px",
            padding: "0 20px",
          }}
        >
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

            {tabs.map((tab, index) => (
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
                  transform: activeTab === tab.id ? "scale(1.05)" : "scale(1)",
                }}
              >
                {tab.name}
                <span
                  style={{
                    background: activeTab === tab.id ? "#1890ff" : "#ccc",
                    color: "white",
                    borderRadius: "10px",
                    padding: "2px 8px",
                    marginLeft: "6px",
                    fontSize: "12px",
                    transition: "all 0.3s",
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tab内容区域 */}
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              {currentData.map((card) => (
                <div
                  key={card.id}
                  style={{
                    background: "linear-gradient(145deg, #1e1e2e, #252536)",
                    border: "1px solid rgba(100, 100, 255, 0.2)",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    router.push(`/question/${card.id}`);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 40px rgba(100, 100, 255, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 32px rgba(31, 38, 135, 0.2)";
                  }}
                >
                  {/* 装饰性圆形元素 */}
                  <div
                    style={{
                      position: "absolute",
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, rgba(100, 100, 255, 0.2) 0%, transparent 70%)",
                      top: "-50px",
                      right: "-50px",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, rgba(100, 200, 255, 0.1) 0%, transparent 70%)",
                      bottom: "-30px",
                      left: "-30px",
                    }}
                  />

                  {/* 卡片内容 */}
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <h3
                      style={{
                        margin: "0 0 15px 0",
                        color: "white",
                        fontSize: "1.2rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {card.title}
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                      }}
                    >
                      <div style={{ color: "#1890ff", fontWeight: "bold" }}>
                        {card.tokenAmount}
                      </div>
                      <div style={{ color: "#aaa" }}>
                        {card.participants} 人参与
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "12px",
                            backgroundColor:
                              card.status === "进行中"
                                ? "rgba(87, 171, 90, 0.2)"
                                : "rgba(255, 143, 0, 0.2)",
                            color:
                              card.status === "进行中" ? "#57a75a" : "#ff8f00",
                            fontSize: "0.8rem",
                          }}
                        >
                          {card.status}
                        </span>
                      </div>

                      {card.winner && (
                        <div style={{ color: "#aaa", fontSize: "0.9rem" }}>
                          获胜者:{" "}
                          <span style={{ color: "#1890ff" }}>
                            {card.winner.substring(0, 6)}...
                            {card.winner.substring(card.winner.length - 4)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                        paddingTop: "15px",
                        color: "#aaa",
                        fontSize: "0.9rem",
                      }}
                    >
                      <div style={{ marginBottom: "5px" }}>
                        出题人:{" "}
                        <span style={{ color: "#1890ff" }}>
                          {card.creator.substring(0, 6)}...
                          {card.creator.substring(card.creator.length - 4)}
                        </span>
                      </div>
                      <div>时间: {card.createTime}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
