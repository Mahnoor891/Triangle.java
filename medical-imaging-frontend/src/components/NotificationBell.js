"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, getToken } from "@/lib/api";
import styles from "./NotificationBell.module.css";

export default function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!getToken()) return;
    let active = true;

    async function load() {
      try {
        const res = await apiFetch("/notifications/unread-count/");
        if (res.ok && active) {
          const data = await res.json();
          setCount(data.unread || 0);
        }
      } catch {
        // ignore, we try again in 30 seconds
      }
    }

    load();
    const timer = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <Link href="/notifications" className={styles.bell}>
      Notifications
      {count > 0 && <span className={styles.count}>{count}</span>}
    </Link>
  );
}