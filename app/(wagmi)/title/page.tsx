"use client";
import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useRouter } from "next/navigation";
import HeaderPlan from "../components/HeaderPlan";
import styles from "./style.module.css";
import quizAbi from "@/app/abi/StakedQuiz.json";
import { QUIZ_CONTRACT_ADDRESS } from "@/app/utils/utils";

const TitlePage = () => {
  const router = useRouter();
  const { address } = useAccount(); // 获取当前钱包地址
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { id: 1, text: "", isCorrect: false },
    { id: 2, text: "", isCorrect: false },
  ]);
  const [correctOptionId, setCorrectOptionId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false); // 控制确认弹框显示
  const [isCreating, setIsCreating] = useState(false); // 控制创建状态
  
  // wagmi写合约相关hook
  const { data: hash, writeContract, isPending } = useWriteContract();
  
  // 等待交易完成
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleAddOption = () => {
    const newId =
      options.length > 0 ? Math.max(...options.map((opt) => opt.id)) + 1 : 1;
    setOptions([...options, { id: newId, text: "", isCorrect: false }]);
  };

  const handleRemoveOption = (id) => {
    if (options.length <= 2) return; // 至少保留两个选项
    setOptions(options.filter((option) => option.id !== id));
    if (correctOptionId === id) {
      setCorrectOptionId(null);
    }
  };

  const handleOptionChange = (id, text) => {
    setOptions(
      options.map((option) => (option.id === id ? { ...option, text } : option))
    );
  };

  const handleSetCorrect = (id) => {
    setCorrectOptionId(id);
    setOptions(
      options.map((option) =>
        option.id === id
          ? { ...option, isCorrect: true }
          : { ...option, isCorrect: false }
      )
    );
  };

  // 检查表单是否有效（题目不为空，所有选项不为空，已选择正确答案）
  const isFormValid = () => {
    return (
      question.trim() &&
      options.every((option) => option.text.trim()) &&
      correctOptionId
    );
  };

  // 显示确认弹框
  const handleShowConfirmation = () => {
    if (isFormValid()) {
      setShowConfirmation(true);
    }
  };

  // 关闭确认弹框
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  // 确认创建题目
  const handleConfirmCreate = async () => {
    setShowConfirmation(false);
    setIsCreating(true);

    try {
      // 准备题目数据
      const questionData = {
        question,
        options,
        correctOptionId,
        creatorAddress: address,
        createdAt: new Date().toISOString(),
        rewardAmount: "0.01",
        currency: "ETH",
        status: "pending",
      };

      // 获取正确答案
      const correctOption = options.find(opt => opt.id === correctOptionId);
      const correctAnswerIndex = options.findIndex(opt => opt.id === correctOptionId);

      // 生成答案哈希 (简化实现)
      const answerSalt = "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const answerHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');

      // 调用智能合约创建问题
      writeContract({
        address: QUIZ_CONTRACT_ADDRESS,
        abi: quizAbi.abi,
        functionName: 'createQuestion',
        args: [
          "0x0000000000000000000000000000000000000000", // 使用ETH作为代币地址
          question, // 题目内容
          answerHash, // 答案哈希
          "10000000000000000", // 奖励池 (0.01 ETH)
          "1000000000000000", // 参与费用 (0.001 ETH)
          Math.floor(Date.now() / 1000), // 开始时间
          Math.floor(Date.now() / 1000) + 7 * 24 * 3600 // 结束时间 (7天后)
        ]
      });

      alert("题目创建成功！");
      
      // 跳转到个人中心页面
      router.push("/profile");

      // 重置表单
      setQuestion("");
      setOptions([
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
      ]);
      setCorrectOptionId(null);
    } catch (error) {
      console.error("创建题目失败:", error);
      alert("题目创建失败，请重试");
    } finally {
      setIsCreating(false);
    }
  };

  // 获取正确的选项
  const getCorrectOption = () => {
    return options.find((option) => option.isCorrect);
  };

  return (
    <div>
      <HeaderPlan />
      <div className={styles.pageContainer}>
        <div className={styles.headerContainer}>
          <h3 className={styles.title}>创建题目</h3>
          <h4 className={styles.subtitle}>
            设置题目并质押代币，答对者将赢取全部奖池
          </h4>
        </div>

        <div className={styles.formCard}>
          {/* 题目输入 */}
          <div className={styles.formSection}>
            <label className={styles.formLabel}>
              题目 <span className={styles.required}>*</span>
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="请输入题目内容（最多100字）"
              maxLength={100}
              className={styles.textarea}
              disabled={isCreating}
            />
            <div className={styles.characterCount}>{question.length}/100</div>
          </div>

          {/* 选项设置 */}
          <div className={styles.formSection}>
            <label className={styles.formLabel}>
              选项 <span className={styles.required}>*</span>
            </label>

            {options.map((option, index) => (
              <div key={option.id} className={styles.optionContainer}>
                <div className={styles.optionInputWrapper}>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(option.id, e.target.value)
                    }
                    placeholder={`选项 ${String.fromCharCode(
                      65 + index
                    )}（必填）`}
                    className={styles.optionInput}
                    disabled={isCreating}
                  />
                  {!option.text.trim() && (
                    <span className={styles.requiredMark}>*</span>
                  )}
                </div>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    checked={option.isCorrect}
                    onChange={() => handleSetCorrect(option.id)}
                    className={styles.radioButton}
                    disabled={isCreating}
                  />
                  设置为正确答案
                </label>
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(option.id)}
                    className={styles.removeButton}
                    disabled={isCreating}
                  >
                    删除
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddOption}
              className={styles.addButton}
              disabled={isCreating}
            >
              + 添加选项
            </button>
          </div>

          {/* 信息说明 */}
          <div className={styles.infoBox}>
            <h4 className={styles.infoTitle}>创建规则</h4>
            <ul className={styles.infoList}>
              <li className={styles.infoItem}>需要质押 0.01 ETH</li>
              <li className={styles.infoItem}>题目将在 7 天后自动结束</li>
              <li className={styles.infoItem}>第一个答对的人将赢得全部奖池</li>
              <li className={styles.lastInfoItem}>
                如果无人答对，质押金将在结束后返还
              </li>
            </ul>
          </div>

          {/* 按钮 */}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.cancelFormButton}
              disabled={isCreating}
            >
              取消
            </button>
            <button
              type="button"
              disabled={!isFormValid() || isCreating}
              onClick={handleShowConfirmation}
              className={styles.createButton}
            >
              {isCreating ? "创建中..." : "创建题目（质押0.01ETH）"}
            </button>
          </div>
        </div>
      </div>

      {/* 确认弹框 */}
      {showConfirmation && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalHeader}>确认题目信息</h3>

            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>题目内容：</h4>
              <div className={styles.questionContent}>{question}</div>
            </div>

            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>选项列表：</h4>
              <div className={styles.optionsList}>
                {options.map((option, index) => (
                  <div
                    key={option.id}
                    className={
                      option.isCorrect
                        ? styles.optionItemCorrect
                        : styles.optionItem
                    }
                  >
                    <span className={styles.optionLabel}>
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className={styles.optionText}>{option.text}</span>
                    {option.isCorrect && (
                      <span className={styles.correctTag}>正确答案</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 质押代币信息 */}
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>质押信息：</h4>
              <div className={styles.infoBox}>
                <div className={styles.stakingInfo}>
                  <span className={styles.stakingLabel}>质押代币:</span>
                  <span className={styles.stakingValue}>0.01 ETH</span>
                </div>
                <div className={styles.stakingInfo}>
                  <span className={styles.stakingLabel}>奖励规则:</span>
                  <span className={styles.stakingValue}>
                    第一个答对者获得全部奖励
                  </span>
                </div>
                <div className={styles.stakingInfo}>
                  <span className={styles.stakingLabel}>过期处理:</span>
                  <span className={styles.stakingValue}>
                    如无人答对，质押金将返还
                  </span>
                </div>
                {address && (
                  <div className={styles.stakingInfo}>
                    <span className={styles.stakingLabel}>创建者地址:</span>
                    <span className={styles.stakingValue}>
                      {address.substring(0, 6)}...
                      {address.substring(address.length - 4)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={handleCloseConfirmation}
                className={styles.cancelButton}
                disabled={isCreating}
              >
                返回修改
              </button>
              <button
                type="button"
                onClick={handleConfirmCreate}
                className={styles.confirmButton}
                disabled={isCreating}
              >
                确认创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TitlePage;
