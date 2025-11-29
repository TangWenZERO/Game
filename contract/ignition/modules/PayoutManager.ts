import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("StakedQuiz", (m) => {
  // 部署 StakedQuiz 合约
  const stakedQuiz = m.contract("StakedQuiz");

  return { stakedQuiz };
});
