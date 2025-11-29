"use client";
import { useAccount } from "wagmi";
import Container from "./container";
import { ConnectKitButton } from "connectkit";
import { useEffect } from "react";

export default function WagmiWalletPage() {
  const { address, chain, isConnected } = useAccount();

  // 监听钱包连接状态变化
  useEffect(() => {
    if (isConnected) {
      console.log("钱包已连接:", { address, chain });
    } else {
      console.log("钱包已断开连接");
    }
  }, [isConnected, address, chain]);

  // return <Container />;
  return (
    <div>
      <div>
        <ConnectKitButton label="链接钱包" />
      </div>
      {isConnected && <Container />}
    </div>
  );
}
