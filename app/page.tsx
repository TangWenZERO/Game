"use client";

import Link from "next/link";
import { redirect } from 'next/navigation';
import styles from "./page.module.css";

const links = [
  {
    href: "/ethersPage",
    title: "Ethers.js 钱包",
    description: "使用 ethers.js 连接钱包并读取合约信息",
  },
  {
    href: "/wagmi",
    title: "wagmi 钱包",
    description: "通过 wagmi hooks 管理连接与数据",
  },
  {
    href: "/logs",
    title: "做mapping日志记录",
    description: "通过 ethers.js 实现",
  },
];

export default function Home() {
  // 重定向到 wagmi 首页
  redirect('/home');
}
