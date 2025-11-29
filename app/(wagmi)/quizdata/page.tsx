"use client";
import { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import HeaderPlan from "../components/HeaderPlan";

// Quiz合约ABI（简化版）
const QUIZ_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "data",
        "type": "string"
      }
    ],
    "name": "storeData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "data",
        "type": "string"
      }
    ],
    "name": "storeGlobalData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getData",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyData",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGlobalData",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// 合约地址（需要根据实际部署地址进行替换）
const QUIZ_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function QuizDataPage() {
  const [personalDataInput, setPersonalDataInput] = useState("");
  const [globalDataInput, setGlobalDataInput] = useState("");
  const { address } = useAccount();

  // 写入个人数据
  const { writeContract: writePersonalData, isPending: isWritingPersonalData } = useWriteContract();
  
  // 写入全局数据
  const { writeContract: writeGlobalData, isPending: isWritingGlobalData } = useWriteContract();
  
  // 读取个人数据
  const { data: myData, refetch: refetchMyData } = useReadContract({
    address: QUIZ_ADDRESS,
    abi: QUIZ_ABI,
    functionName: "getMyData",
  });
  
  // 读取全局数据
  const { data: globalData, refetch: refetchGlobalData } = useReadContract({
    address: QUIZ_ADDRESS,
    abi: QUIZ_ABI,
    functionName: "getGlobalData",
  });

  // 存储个人数据
  const handleStorePersonalData = () => {
    if (!personalDataInput) return;
    
    writePersonalData({
      address: QUIZ_ADDRESS,
      abi: QUIZ_ABI,
      functionName: "storeData",
      args: [personalDataInput],
    }, {
      onSuccess: () => {
        refetchMyData();
        setPersonalDataInput("");
      }
    });
  };

  // 存储全局数据
  const handleStoreGlobalData = () => {
    if (!globalDataInput) return;
    
    writeGlobalData({
      address: QUIZ_ADDRESS,
      abi: QUIZ_ABI,
      functionName: "storeGlobalData",
      args: [globalDataInput],
    }, {
      onSuccess: () => {
        refetchGlobalData();
        setGlobalDataInput("");
      }
    });
  };

  return (
    <div>
      <HeaderPlan />
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ 
          textAlign: "center",
          background: "linear-gradient(90deg, #8a2be2, #00bfff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "2rem",
          margin: "0 0 2rem 0"
        }}>
          Quiz 数据存储演示
        </h1>

        {address ? (
          <div style={{ 
            background: "linear-gradient(145deg, #1e1e2e, #252536)",
            border: "1px solid rgba(100, 100, 255, 0.2)",
            borderRadius: "16px",
            padding: "25px",
            marginBottom: "2rem"
          }}>
            <h2 style={{ color: "white", margin: "0 0 1rem 0" }}>当前用户</h2>
            <p style={{ color: "#aaa" }}>{address}</p>
          </div>
        ) : (
          <div style={{ 
            background: "linear-gradient(145deg, #1e1e2e, #252536)",
            border: "1px solid #ff8f00",
            borderRadius: "16px",
            padding: "25px",
            marginBottom: "2rem",
            color: "#ff8f00"
          }}>
            <h2>⚠️ 未连接钱包</h2>
            <p>请连接钱包以使用数据存储功能</p>
          </div>
        )}

        {/* 个人数据部分 */}
        <div style={{ 
          background: "white",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: "2rem"
        }}>
          <h2>个人数据</h2>
          
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              存储您的个人数据:
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={personalDataInput}
                onChange={(e) => setPersonalDataInput(e.target.value)}
                placeholder="输入要存储的个人数据"
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px"
                }}
                disabled={!address || isWritingPersonalData}
              />
              <button
                onClick={handleStorePersonalData}
                disabled={!address || isWritingPersonalData || !personalDataInput}
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(90deg, #8a2be2, #00bfff)",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: (!address || isWritingPersonalData || !personalDataInput) ? "not-allowed" : "pointer",
                  opacity: (!address || isWritingPersonalData || !personalDataInput) ? 0.6 : 1
                }}
              >
                {isWritingPersonalData ? "存储中..." : "存储"}
              </button>
            </div>
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              您的个人数据:
            </label>
            <div style={{
              padding: "15px",
              background: "#f8f9fa",
              borderRadius: "5px",
              minHeight: "20px",
              border: "1px dashed #dee2e6"
            }}>
              {myData !== undefined ? myData : "无数据"}
            </div>
            <button
              onClick={() => refetchMyData()}
              style={{
                marginTop: "10px",
                padding: "5px 15px",
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              刷新
            </button>
          </div>
        </div>

        {/* 全局数据部分 */}
        <div style={{ 
          background: "white",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <h2>全局数据</h2>
          
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              设置全局数据:
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={globalDataInput}
                onChange={(e) => setGlobalDataInput(e.target.value)}
                placeholder="输入要设置为全局数据的内容"
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px"
                }}
                disabled={!address || isWritingGlobalData}
              />
              <button
                onClick={handleStoreGlobalData}
                disabled={!address || isWritingGlobalData || !globalDataInput}
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(90deg, #8a2be2, #00bfff)",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: (!address || isWritingGlobalData || !globalDataInput) ? "not-allowed" : "pointer",
                  opacity: (!address || isWritingGlobalData || !globalDataInput) ? 0.6 : 1
                }}
              >
                {isWritingGlobalData ? "设置中..." : "设置"}
              </button>
            </div>
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              当前全局数据:
            </label>
            <div style={{
              padding: "15px",
              background: "#f8f9fa",
              borderRadius: "5px",
              minHeight: "20px",
              border: "1px dashed #dee2e6"
            }}>
              {globalData !== undefined ? globalData : "无数据"}
            </div>
            <button
              onClick={() => refetchGlobalData()}
              style={{
                marginTop: "10px",
                padding: "5px 15px",
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              刷新
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}