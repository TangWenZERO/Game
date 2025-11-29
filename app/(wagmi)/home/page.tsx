"use client";
import { useEffect, useState } from "react";
import styles from "./style.module.css";
import HeaderPlan from "../components/HeaderPlan";
import { useRouter } from "next/navigation";
import { useReadContract, useReadContracts } from "wagmi";
import quizAbi from "@/app/abi/StakedQuiz.json";
import { QUIZ_CONTRACT_ADDRESS } from "@/app/utils/utils";

const tabs = [
  { id: 0, name: "全部", count: 2 },
  { id: 1, name: "进行中", count: 1 },
  { id: 2, name: "已结束", count: 1 },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);

  // 使用 wagmi 读取合约中的题目总数
  const {
    data: questionCount,
    isLoading: isCountLoading,
    isError: isCountError,
  } = useReadContract({
    address: QUIZ_CONTRACT_ADDRESS,
    abi: quizAbi.abi,
    functionName: "questionCount",
  });

  // 构建批量读取题目详情的配置
  const questionsConfig = [];
  if (questionCount && Number(questionCount) > 0) {
    for (let i = 1; i <= Number(questionCount); i++) {
      questionsConfig.push({
        address: QUIZ_CONTRACT_ADDRESS,
        abi: quizAbi.abi,
        functionName: "questions",
        args: [i],
      });
    }
  }

  // 批量读取所有题目详情
  const {
    data: questionsData,
    isLoading: isQuestionsLoading,
    isError: isQuestionsError,
  } = useReadContracts({
    contracts: questionsConfig,
  });

  // 当题目数据变化时，更新状态
  useEffect(() => {
    if (questionsData && questionsData.length > 0) {
      const formattedQuestions = questionsData.map((questionData, index) => {
        const question = questionData.result as any;
        return {
          id: index + 1,
          creator: question?.creator,
          token: question?.token,
          contentUri: question?.contentUri,
          rewardPool: question?.rewardPool?.toString(),
          participationFee: question?.participationFee?.toString(),
          startAt: question?.startAt?.toString(),
          endAt: question?.endAt?.toString(),
          answerHash: question?.answerHash,
          state: question?.state,
          totalStakedFromParticipants: question?.totalStakedFromParticipants?.toString(),
          correctCount: question?.correctCount?.toString(),
          refundAvailableAt: question?.refundAvailableAt?.toString(),
        };
      });
      setQuestions(formattedQuestions);
    }
  }, [questionsData]);

  // 根据tab过滤卡片数据
  const getFilteredCards = () => {
    // 根据题目状态进行过滤
    if (activeTab === 0) return questions; // 全部
    if (activeTab === 1)
      return questions.filter((q: any) => q.state === 0); // 进行中 (Active state)
    if (activeTab === 2)
      return questions.filter((q: any) => q.state !== 0); // 已结束
    return questions;
  };

  const filteredCards = getFilteredCards();

  // 格式化时间戳
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp || timestamp === "0") return "未设置";
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString("zh-CN");
  };

  // 格式化代币数量
  const formatTokenAmount = (amount: string) => {
    if (!amount || amount === "0") return "0";
    // 简化处理，实际应根据代币精度进行转换
    return (Number(amount) / 1e18).toFixed(4);
  };

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
            答题挑战
          </h3>
          <h4
            style={{
              color: "#888",
              margin: "0",
              fontSize: "1rem",
            }}
          >
            展现你的知识，赢取奖励
          </h4>
        </div>

        {/* Tab导航 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
            gap: "20px",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 20px",
                background: activeTab === tab.id ? "linear-gradient(90deg, #8a2be2, #00bfff)" : "#f0f0f0",
                color: activeTab === tab.id ? "white" : "#333",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {tab.name}
              <span
                style={{
                  background: "#fff",
                  color: activeTab === tab.id ? "#8a2be2" : "#666",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "0.8rem",
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* 加载状态 */}
        {(isCountLoading || isQuestionsLoading) && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>正在加载题目数据...</p>
          </div>
        )}

        {/* 错误状态 */}
        {(isCountError || isQuestionsError) && (
          <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
            <p>加载题目数据失败，请检查网络连接或合约地址</p>
          </div>
        )}

        {/* 题目卡片列表 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {filteredCards.map((card: any) => (
            <div
              key={card.id}
              onClick={() => router.push(`/details?qid=${card.id}`)}
              style={{
                background: "white",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "20px",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}>{card.contentUri || `题目 #${card.id}`}</h3>
                <span
                  style={{
                    background: card.state === 0 ? "#e8f4ff" : "#f0f0f0",
                    color: card.state === 0 ? "#0066cc" : "#666",
                    padding: "4px 10px",
                    borderRadius: "15px",
                    fontSize: "0.8rem",
                  }}
                >
                  {card.state === 0 ? "进行中" : card.state === 1 ? "已揭晓" : card.state === 2 ? "退款中" : "已结算"}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", margin: "15px 0" }}>
                <div>
                  <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#666" }}>奖励</p>
                  <p style={{ margin: "0", fontWeight: "bold", color: "#8a2be2" }}>{formatTokenAmount(card.rewardPool || "0")} TOKEN</p>
                </div>
                <div>
                  <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#666" }}>参与费</p>
                  <p style={{ margin: "0", fontWeight: "bold" }}>{formatTokenAmount(card.participationFee || "0")} TOKEN</p>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", margin: "15px 0" }}>
                <div>
                  <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#666" }}>开始时间</p>
                  <p style={{ margin: "0", fontSize: "0.8rem" }}>{formatTimestamp(card.startAt)}</p>
                </div>
                <div>
                  <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#666" }}>结束时间</p>
                  <p style={{ margin: "0", fontSize: "0.8rem" }}>{formatTimestamp(card.endAt)}</p>
                </div>
              </div>

              <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #eee" }}>
                <p style={{ margin: "0 0 5px 0", fontSize: "0.9rem", color: "#666" }}>创建者</p>
                <p style={{ margin: "0", fontSize: "0.8rem", wordBreak: "break-all" }}>
                  {card.creator ? `${card.creator.substring(0, 6)}...${card.creator.substring(card.creator.length - 4)}` : "-"}
                </p>
              </div>
            </div>
          ))}

          {/* 如果没有数据，显示提示 */}
          {!isCountLoading && !isQuestionsLoading && !isCountError && !isQuestionsError && filteredCards.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", gridColumn: "1 / -1" }}>
              <p>暂无题目数据</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
