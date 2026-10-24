"use client";

import { useEffect, useState } from "react";
import Logo from "./logo";
import styles from "./SplashScreen.module.css";

export default function SplashScreen() {
  const [phase, setPhase] = useState("show");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fade"), 900);
    const t2 = setTimeout(() => setPhase("gone"), 1300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={`${styles.overlay} ${phase === "fade" ? styles.fade : ""}`}>
      <Logo size={72} />
      <div className={styles.bar} />
    </div>
  );
}