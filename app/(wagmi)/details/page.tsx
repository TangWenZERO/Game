"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount, useReadContract, useSwitchChain } from "wagmi";
import HeaderPlan from "../components/HeaderPlan";
import styles from "./style.module.css";
import quizAbi from "@/app/abi/StakedQuiz.json";
import { QUIZ_CONTRACT_ADDRESS, fromHex } from "@/app/utils/utils";

export default function DetailsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const searchParams = useSearchParams();
  const qid = searchParams.get("qid");
  const { address: userAddress, chain } = useAccount();
  const { switchChain } = useSwitchChain();

  const tabs = [
    { id: 0, name: "题目详情" },
    { id: 1, name: "参与记录" },
  ];

  // 检查是否在正确的网络上
  const isCorrectNetwork =
    chain?.id === 31337 || chain?.id === 1337 || chain?.id === 11155111;

  // 从合约读取题目详情
  const {
    data: questionData,
    isLoading: isQuestionLoading,
    isError: isQuestionError,
    error: questionError,
  } = useReadContract({
    address: isCorrectNetwork ? QUIZ_CONTRACT_ADDRESS : undefined,
    abi: quizAbi.abi,
    functionName: "questions",
    args: [qid ? BigInt(qid) : BigInt(1)],
  });

  // 获取当前用户参与信息
  const {
    data: participantData,
    isLoading: isParticipantLoading,
    isError: isParticipantError,
    error: participantError,
  } = useReadContract({
    address: isCorrectNetwork ? QUIZ_CONTRACT_ADDRESS : undefined,
    abi: quizAbi.abi,
    functionName: "participants",
    args: [
      qid ? BigInt(qid) : BigInt(1),
      userAddress || "0x0000000000000000000000000000000000000000",
    ],
  });

  // 解析题目内容
  const [parsedQuestion, setParsedQuestion] = useState<any>(null);
  console.log("participantData:", participantData);
  useEffect(() => {
    console.log("questionData", questionData);
    if (questionData) {
      const question: any = questionData;
      let content = "";

      try {
        // 使用 fromHex 方法解析十六进制内容
        if (question.contentUri.startsWith("0x")) {
          // 移除 '0x' 前缀并使用 fromHex 方法解码
          const hex = question.contentUri.slice(2);
          content = fromHex(hex);
        } else {
          content = question.contentUri;
        }
      } catch (e) {
        console.error("解析题目内容出错:", e);
        content = question.contentUri;
      }

      // 解析内容字符串
      let title = "";
      let description = "";
      const options: string[] = [];
      let correctAnswer = "";

      if (content.includes("Question:")) {
        const lines = content.split("\n");
        title = lines[0].replace("Question: ", "");

        let inOptions = false;
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if (line === "Options:") {
            inOptions = true;
            continue;
          }

          if (line.startsWith("Correct Answer:")) {
            inOptions = false;
            correctAnswer = line.replace("Correct Answer: ", "");
            continue;
          }

          if (inOptions && line.trim() !== "") {
            options.push(line);
          }
        }

        description = title; // 使用题目作为描述
      }

      setParsedQuestion({
        id: qid,
        title: title || `题目 #${qid}`,
        description: description || "题目详情",
        options: options,
        correctAnswer: correctAnswer,
        tokenAmount: question.rewardPool?.toString() || "0",
        status: getStateText(Number(question.state)),
        creator: question.creator,
        createTime: question.startAt?.toString() || "0",
        endTime: question.endAt?.toString() || "0",
        participationFee: question.participationFee?.toString() || "0",
        totalStaked: question.totalStakedFromParticipants?.toString() || "0",
        state: Number(question.state),
      });
    }
  }, [questionData, qid]);

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
            题目详情
          </h3>
        </div>

        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* 用户信息展示 */}
          {userAddress && (
            <div
              style={{
                background: "linear-gradient(145deg, #1e1e2e, #252536)",
                border: "1px solid rgba(100, 100, 255, 0.2)",
                borderRadius: "16px",
                padding: "15px",
                marginBottom: "20px",
              }}
            >
              <div style={{ color: "white" }}>
                <strong>当前用户地址:</strong> {userAddress}
              </div>
              {participantData && (participantData as any).participated && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    background: "rgba(46, 204, 113, 0.2)",
                    borderRadius: "5px",
                    color: "#2ecc71",
                  }}
                >
                  您已参与此题目
                </div>
              )}
            </div>
          )}

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
                    onClick={() => switchChain({ chainId: 31337 })}
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
                    onClick={() => switchChain({ chainId: 11155111 })}
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

          {/* 加载状态 */}
          {isQuestionLoading && (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>正在加载题目数据...</p>
            </div>
          )}

          {/* 错误状态 */}
          {(isQuestionError || isParticipantError) && (
            <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
              <p>
                加载数据失败:{" "}
                {questionError?.message || participantError?.message}
              </p>
              <p>请检查网络连接和合约地址</p>
            </div>
          )}

          {/* 题目详情 */}
          {parsedQuestion && !isQuestionLoading && (
            <>
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
                    {parsedQuestion.title}
                  </h2>

                  <p
                    style={{
                      color: "#aaa",
                      lineHeight: "1.6",
                      marginBottom: "20px",
                    }}
                  >
                    {parsedQuestion.description}
                  </p>

                  {/* 显示选项 */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ color: "white", marginBottom: "10px" }}>
                      选项:
                    </h3>
                    {parsedQuestion.options.map(
                      (option: string, index: number) => (
                        <div
                          key={index}
                          style={{
                            padding: "10px",
                            background: "rgba(255, 255, 255, 0.1)",
                            borderRadius: "5px",
                            marginBottom: "5px",
                            color: "white",
                          }}
                        >
                          {option}
                        </div>
                      )
                    )}
                  </div>

                  {parsedQuestion.state === 1 &&
                    parsedQuestion.correctAnswer && (
                      <div
                        style={{
                          padding: "10px",
                          background: "rgba(46, 204, 113, 0.2)",
                          borderRadius: "5px",
                          marginBottom: "20px",
                          color: "#2ecc71",
                        }}
                      >
                        正确答案: {parsedQuestion.correctAnswer}
                      </div>
                    )}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
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
                        {formatTokenAmount(parsedQuestion.tokenAmount)} ETH
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
                        参与费用
                      </div>
                      <div
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                        }}
                      >
                        {formatTokenAmount(parsedQuestion.participationFee)} ETH
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
                            parsedQuestion.status === "进行中"
                              ? "#57a75a"
                              : "#ff8f00",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                        }}
                      >
                        {parsedQuestion.status}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "15px",
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
                        创建者
                      </div>
                      <div
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                          wordBreak: "break-all",
                        }}
                      >
                        {parsedQuestion.creator
                          ? `${parsedQuestion.creator.substring(
                              0,
                              6
                            )}...${parsedQuestion.creator.substring(
                              parsedQuestion.creator.length - 4
                            )}`
                          : "-"}
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
                        开始时间
                      </div>
                      <div
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                        }}
                      >
                        {new Date(
                          Number(parsedQuestion.createTime) * 1000
                        ).toLocaleString()}
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
                        结束时间
                      </div>
                      <div
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                        }}
                      >
                        {new Date(
                          Number(parsedQuestion.endTime) * 1000
                        ).toLocaleString()}
                      </div>
                    </div>
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
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: "10px 20px",
                      background:
                        activeTab === tab.id
                          ? "linear-gradient(90deg, #8a2be2, #00bfff)"
                          : "#f0f0f0",
                      color: activeTab === tab.id ? "white" : "#333",
                      border: "none",
                      borderRadius: "20px",
                      cursor: "pointer",
                    }}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* 题目详情 */}
              {activeTab === 0 && (
                <div
                  style={{
                    background: "white",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3 style={{ margin: "0 0 15px 0" }}>题目描述</h3>
                  <p>{parsedQuestion.description}</p>

                  <h3 style={{ margin: "20px 0 15px 0" }}>选项</h3>
                  {parsedQuestion.options.map(
                    (option: string, index: number) => (
                      <div key={index} style={{ marginBottom: "10px" }}>
                        {option}
                      </div>
                    )
                  )}

                  {parsedQuestion.state === 1 &&
                    parsedQuestion.correctAnswer && (
                      <div
                        style={{
                          marginTop: "20px",
                          padding: "10px",
                          background: "#d4edda",
                          borderRadius: "5px",
                          color: "#155724",
                        }}
                      >
                        <strong>
                          正确答案: {parsedQuestion.correctAnswer}
                        </strong>
                      </div>
                    )}
                </div>
              )}

              {/* 参与记录 */}
              {activeTab === 1 && (
                <div
                  style={{
                    background: "white",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3 style={{ margin: "0 0 15px 0" }}>参与记录</h3>
                  {isParticipantLoading ? (
                    <p>正在加载参与信息...</p>
                  ) : isParticipantError ? (
                    <p>加载参与信息失败</p>
                  ) : participantData ? (
                    <div>
                      {(participantData as any).participated ? (
                        <div>
                          <p>您已参与此题目</p>
                          <p>
                            您的答案: 选项{" "}
                            {(participantData as any).answerIndex}
                          </p>
                          {(participantData as any).isCorrect ? (
                            <div
                              style={{
                                padding: "10px",
                                background: "#d4edda",
                                borderRadius: "5px",
                                color: "#155724",
                                marginTop: "10px",
                              }}
                            >
                              恭喜！您的答案正确
                            </div>
                          ) : (
                            <div
                              style={{
                                padding: "10px",
                                background: "#f8d7da",
                                borderRadius: "5px",
                                color: "#721c24",
                                marginTop: "10px",
                              }}
                            >
                              很遗憾，您的答案不正确
                            </div>
                          )}
                        </div>
                      ) : (
                        <p>您尚未参与此题目</p>
                      )}
                    </div>
                  ) : (
                    <p>暂无参与记录</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
