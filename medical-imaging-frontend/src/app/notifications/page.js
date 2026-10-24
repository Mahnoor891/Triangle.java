"use client";
import Header from "@/components/Header";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, getToken, logout } from "@/lib/api";
import styles from "./notifications.module.css";

export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await apiFetch("/notifications/");
      if (res.status === 401) {
        logout();
        router.replace("/login");
        return;
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.results || [];
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setItems(list);
    } catch {
      setError("Could not load notifications. Is Django running?");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    load();
  }, [load, router]);

  const unread = items.filter((n) => !n.is_read).length;

  async function openNotification(n) {
    if (!n.is_read) {
      await apiFetch(`/notifications/${n.id}/read/`, { method: "POST" });
      setItems((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x))
      );
    }
    if (n.order) router.push(`/orders/${n.order}`);
  }

  async function markAllRead() {
    const res = await apiFetch("/notifications/read-all/", { method: "POST" });
    if (res.ok) {
      setItems((prev) => prev.map((x) => ({ ...x, is_read: true })));
    }
  }

  return (
    <div>
    <Header /> 
      <main className={styles.main}>
        <div className={styles.top}>
          <h2 className={styles.heading}>
            Notifications {unread > 0 && <span className={styles.count}>{unread}</span>}
          </h2>
          {unread > 0 && (
            <button className={styles.markAll} onClick={markAllRead}>
              Mark all as read
            </button>
          )}
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && items.length === 0 && <p>No notifications yet.</p>}

        <div className={styles.list}>
          {items.map((n) => (
            <button
              key={n.id}
              className={`${styles.item} ${n.is_read ? "" : styles.unread}`}
              onClick={() => openNotification(n)}
            >
              <span className={styles.message}>{n.message}</span>
              <span className={styles.time}>
                {new Date(n.created_at).toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}