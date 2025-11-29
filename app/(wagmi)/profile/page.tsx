"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useSwitchChain,
} from "wagmi";
import styles from "./style.module.css";
import HeaderPlan from "../components/HeaderPlan";
import quizAbi from "@/app/abi/StakedQuiz.json";
import { QUIZ_CONTRACT_ADDRESS, fromHex } from "@/app/utils/utils";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();

  // 检查是否在正确的网络上
  const isCorrectNetwork =
    chain?.id === 31337 || chain?.id === 1337 || chain?.id === 11155111;

  // 获取用户账户信息
  const {
    data: userAccountData,
    isLoading: isUserAccountLoading,
    isError: isUserAccountError,
  } = useReadContract({
    address: isCorrectNetwork ? QUIZ_CONTRACT_ADDRESS : undefined,
    abi: quizAbi.abi,
    functionName: "getUserInfo",
    args: ["0x0000000000000000000000000000000000000000", address], // 使用ETH地址和用户地址
  });

  // 获取题目总数
  const {
    data: questionCount,
    isLoading: isCountLoading,
    isError: isCountError,
    error: countError,
  } = useReadContract({
    address: isCorrectNetwork ? QUIZ_CONTRACT_ADDRESS : undefined,
    abi: quizAbi.abi,
    functionName: "questionCount",
  });
  console.log("questionCount:", questionCount);
  // 构建批量读取题目详情的配置
  const questionsConfig: any[] = [];
  if (questionCount && Number(questionCount) > 0) {
    for (let i = 1; i <= Number(questionCount); i++) {
      questionsConfig.push({
        address: isCorrectNetwork ? QUIZ_CONTRACT_ADDRESS : undefined,
        abi: quizAbi.abi,
        functionName: "questions",
        args: [BigInt(i)],
      });
    }
  }

  // 批量读取所有题目详情
  const {
    data: questionsData,
    isLoading: isQuestionsLoading,
    isError: isQuestionsError,
    error: questionsError,
  } = useReadContracts({
    contracts: questionsConfig as any,
  });
  console.log("questionsData:", questionsData);
  // 获取用户参与的题目
  const [userParticipationData, setUserParticipationData] = useState<any[]>([]);
  const [isLoadingParticipation, setIsLoadingParticipation] = useState(false);
  const [participationError, setParticipationError] = useState<string | null>(
    null
  );

  // 获取用户参与信息
  useEffect(() => {
    const fetchParticipationData = async () => {
      if (!address || !questionCount || !isCorrectNetwork) return;

      setIsLoadingParticipation(true);
      setParticipationError(null);

      try {
        const participationPromises = [];
        for (let i = 1; i <= Number(questionCount); i++) {
          participationPromises.push(
            // 这里模拟读取用户参与信息的调用
            new Promise((resolve) => {
              setTimeout(
                () =>
                  resolve({
                    questionId: i,
                    participated: Math.random() > 0.5, // 随机模拟参与状态
                  }),
                100
              );
            })
          );
        }

        const results = await Promise.all(participationPromises);
        setUserParticipationData(results as any[]);
      } catch (err) {
        setParticipationError("获取参与信息失败");
        console.error(err);
      } finally {
        setIsLoadingParticipation(false);
      }
    };

    fetchParticipationData();
  }, [address, questionCount, isCorrectNetwork]);

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

  // 解析题目内容，使用 fromHex 方法
  const parseQuestionContent = (contentUri: string) => {
    try {
      // 如果是十六进制字符串，则使用 fromHex 方法解析为普通文本
      if (contentUri.startsWith("0x")) {
        const hex = contentUri.slice(2);
        const str = fromHex(hex);

        // 解析题目文本
        if (str.includes("Question:")) {
          const lines = str.split("\n");
          const questionLine = lines[0];
          return questionLine.replace("Question: ", "");
        }

        return str;
      }
      return contentUri;
    } catch (e) {
      console.error("解析题目内容出错:", e);
      return contentUri;
    }
  };

  // 获取当前tab的数据
  const getCurrentTabData = () => {
    if (!questionsData) return [];

    // 过滤出有效的题目数据
    const validQuestions = questionsData
      .map((questionData: any, index: number) => {
        const question = questionData.result;
        if (!question || !question.creator) return null;

        const parsedContent = parseQuestionContent(question.contentUri);

        return {
          id: index + 1,
          title: parsedContent || `题目 #${index + 1}`,
          tokenAmount: question.rewardPool?.toString() || "0",
          participants: "0", // 需要从合约获取实际参与人数
          status: getStateText(Number(question.state)),
          winner: null,
          creator: question.creator,
          createTime: question.startAt?.toString() || "0",
          endAt: question.endAt?.toString() || "0",
          participationFee: question.participationFee?.toString() || "0",
        };
      })
      .filter(Boolean);

    if (activeTab === 0) {
      // 我出的题 - 过滤当前用户创建的题目
      return validQuestions.filter(
        (q: any) =>
          q &&
          q.creator &&
          address &&
          q.creator.toLowerCase() === address.toLowerCase()
      );
    }

    if (activeTab === 1) {
      // 我答的题 - 这里需要根据实际参与情况过滤
      // 目前基于模拟数据过滤
      const participatedQuestionIds = userParticipationData
        .filter((item) => item.participated)
        .map((item) => item.questionId);

      return validQuestions.filter(
        (q: any) => q && participatedQuestionIds.includes(q.id)
      );
    }

    return [];
  };

  const getStateText = (state: number) => {
    switch (state) {
      case 0:
        return "进行中";
      case 1:
        return "已揭晓";
      case 2:
        return "退款中";
      case 3:
        return "已结算";
      default:
        return "未知";
    }
  };

  // 切换到本地网络
  const switchToLocalhost = () => {
    try {
      switchChain({ chainId: 31337 }); // Hardhat网络ID
    } catch (error) {
      console.error("切换网络失败:", error);
    }
  };

  // 切换到Sepolia网络
  const switchToSepolia = () => {
    try {
      switchChain({ chainId: 11155111 }); // Sepolia网络ID
    } catch (error) {
      console.error("切换网络失败:", error);
    }
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
          <div style={{ color: "#666" }}>
            钱包地址:{" "}
            {address
              ? `${address.substring(0, 6)}...${address.substring(
                  address.length - 4
                )}`
              : "未连接"}
          </div>
        </div>

        {/* 网络状态提醒 */}
        {!isCorrectNetwork && (
          <div
            style={{
              background: "linear-gradient(145deg, #1e1e2e, #252536)",
              border: "1px solid #ff8f00",
              borderRadius: "16px",
              padding: "15px",
              marginBottom: "20px",
              color: "#ff8f00",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div>
                <strong>⚠️ 网络警告</strong>
                <div>
                  当前连接的是 {chain?.name || "未知网络"}，请切换到合适的网络
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={switchToLocalhost}
                  style={{
                    padding: "8px 16px",
                    background: "linear-gradient(90deg, #8a2be2, #00bfff)",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                >
                  切换到本地网络
                </button>
                <button
                  onClick={switchToSepolia}
                  style={{
                    padding: "8px 16px",
                    background: "linear-gradient(90deg, #8a2be2, #00bfff)",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                >
                  切换到Sepolia
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 统计数据 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "15px",
            marginBottom: "30px",
            maxWidth: "800px",
            margin: "0 auto 30px auto",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ color: "#888", fontSize: "0.9rem" }}>出题数量</div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#8a2be2",
              }}
            >
              {isUserAccountLoading
                ? "..."
                : userAccountData
                ? (userAccountData as any)[5]?.length || "0"
                : "0"}
            </div>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ color: "#888", fontSize: "0.9rem" }}>答题数量</div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#8a2be2",
              }}
            >
              {isLoadingParticipation
                ? "..."
                : userParticipationData.filter((item) => item.participated)
                    .length || "0"}
            </div>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ color: "#888", fontSize: "0.9rem" }}>总收益</div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#8a2be2",
              }}
            >
              {isUserAccountLoading
                ? "..."
                : userAccountData
                ? formatTokenAmount(
                    (userAccountData as any)[3]?.toString() || "0"
                  )
                : "0"}{" "}
              ETH
            </div>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ color: "#888", fontSize: "0.9rem" }}>质押中</div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#8a2be2",
              }}
            >
              {isUserAccountLoading
                ? "..."
                : userAccountData
                ? formatTokenAmount(
                    (
                      (userAccountData as any)[0] - (userAccountData as any)[1]
                    )?.toString() || "0"
                  )
                : "0"}{" "}
              ETH
            </div>
          </div>
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
          <button
            key={0}
            onClick={() => setActiveTab(0)}
            style={{
              padding: "10px 20px",
              background:
                activeTab === 0
                  ? "linear-gradient(90deg, #8a2be2, #00bfff)"
                  : "#f0f0f0",
              color: activeTab === 0 ? "white" : "#333",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              position: "relative",
            }}
          >
            我出的题
            <span
              style={{
                background: "#fff",
                color: activeTab === 0 ? "#8a2be2" : "#666",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "0.8rem",
                position: "absolute",
                top: "-5px",
                right: "-5px",
              }}
            >
              {isUserAccountLoading
                ? "..."
                : userAccountData
                ? (userAccountData as any)[6]?.length || "0"
                : "0"}
            </span>
          </button>
          <button
            key={1}
            onClick={() => setActiveTab(1)}
            style={{
              padding: "10px 20px",
              background:
                activeTab === 1
                  ? "linear-gradient(90deg, #8a2be2, #00bfff)"
                  : "#f0f0f0",
              color: activeTab === 1 ? "white" : "#333",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              position: "relative",
            }}
          >
            我答的题
            <span
              style={{
                background: "#fff",
                color: activeTab === 1 ? "#8a2be2" : "#666",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "0.8rem",
                position: "absolute",
                top: "-5px",
                right: "-5px",
              }}
            >
              {isLoadingParticipation
                ? "..."
                : userParticipationData.filter((item) => item.participated)
                    .length || "0"}
            </span>
          </button>
        </div>

        {/* 加载状态 */}
        {(isCountLoading || isQuestionsLoading || isLoadingParticipation) && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>正在加载题目数据...</p>
          </div>
        )}

        {/* 错误状态 */}
        {(isCountError || isQuestionsError || participationError) && (
          <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
            <p>加载题目数据失败：</p>
            <p>
              {countError?.message ||
                questionsError?.message ||
                participationError}
            </p>
            <p>请检查网络连接或合约地址</p>
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
          {currentData.map((card: any) => (
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}>
                  {card.title}
                </h3>
                <span
                  style={{
                    background:
                      card.status === "进行中" ? "#e8f4ff" : "#f0f0f0",
                    color: card.status === "进行中" ? "#0066cc" : "#666",
                    padding: "4px 10px",
                    borderRadius: "15px",
                    fontSize: "0.8rem",
                  }}
                >
                  {card.status}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "15px 0",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "5px 0",
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    奖励
                  </p>
                  <p
                    style={{
                      margin: "0",
                      fontWeight: "bold",
                      color: "#8a2be2",
                    }}
                  >
                    {formatTokenAmount(card.tokenAmount)} ETH
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      margin: "5px 0",
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    参与费
                  </p>
                  <p style={{ margin: "0", fontWeight: "bold" }}>
                    {formatTokenAmount(card.participationFee)} ETH
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "15px 0",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "5px 0",
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    创建时间
                  </p>
                  <p style={{ margin: "0", fontSize: "0.8rem" }}>
                    {formatTimestamp(card.createTime)}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      margin: "5px 0",
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    结束时间
                  </p>
                  <p style={{ margin: "0", fontSize: "0.8rem" }}>
                    {formatTimestamp(card.endAt)}
                  </p>
                </div>
              </div>

              <div
                style={{
                  marginTop: "15px",
                  paddingTop: "15px",
                  borderTop: "1px solid #eee",
                }}
              >
                <p
                  style={{
                    margin: "0 0 5px 0",
                    fontSize: "0.9rem",
                    color: "#666",
                  }}
                >
                  创建者
                </p>
                <p
                  style={{
                    margin: "0",
                    fontSize: "0.8rem",
                    wordBreak: "break-all",
                  }}
                >
                  {card.creator
                    ? `${card.creator.substring(
                        0,
                        6
                      )}...${card.creator.substring(card.creator.length - 4)}`
                    : "-"}
                </p>
              </div>
            </div>
          ))}

          {/* 如果没有数据，显示提示 */}
          {!isCountLoading &&
            !isQuestionsLoading &&
            !isLoadingParticipation &&
            !isCountError &&
            !isQuestionsError &&
            !participationError &&
            currentData.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  gridColumn: "1 / -1",
                }}
              >
                <p>暂无题目数据</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
