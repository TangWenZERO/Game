"use client";

import Link from "next/link";
import { ConnectKitButton } from "connectkit";
import styles from "./header.module.css";

const HeaderPlan = () => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>Logo</div>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navItem}>
            质押游戏
          </Link>
        </nav>
      </div>

      <nav className={styles.center}>
        <Link href="/" className={styles.navItem}>
          首页
        </Link>
        <Link href="/title" className={styles.navItem}>
          出题
        </Link>
        <Link href="/profile" className={styles.navItem}>
          个人中心
        </Link>
      </nav>

      <div className={styles.right}>
        <ConnectKitButton label="链接钱包" />
      </div>
    </header>
  );
};

export default HeaderPlan;
