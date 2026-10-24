"use client";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, getToken, logout, formatPKR } from "@/lib/api";
import styles from "./orders.module.css";

function badgeClass(status) {
  switch (status) {
    case "Pending": return "badge badge-pending";
    case "Rejected": return "badge badge-rejected";
    case "Awaiting Confirmation": return "badge badge-awaiting";
    case "Confirmed": return "badge badge-confirmed";
    default: return "badge badge-cancelled";
  }
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    async function load() {
      try {
        const res = await apiFetch("/orders/");
        if (res.status === 401) {
          logout();
          router.replace("/login");
          return;
        }
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results || [];
        setOrders(list.sort((a, b) => b.id - a.id));
      } catch {
        setError("Could not load orders. Is Django running?");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  return (
    <div>
      <Header />

      <main className={styles.main}>
        <h2 className={styles.heading}>My Orders</h2>

        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p>No orders yet. Use Enquire Now on any equipment to start.</p>
        )}

        <div className={styles.list}>
          {orders.map((o) => (
            <Link key={o.id} href={`/orders/${o.id}`} className={styles.card}>
              <div>
                <div className={styles.orderNo}>Order #{o.id}</div>
                <div className={styles.meta}>
                  {new Date(o.order_date).toLocaleDateString()} ·{" "}
                  {o.items.length} item{o.items.length === 1 ? "" : "s"}
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.total}>{formatPKR(o.total)}</div>
                <span className={badgeClass(o.status)}>{o.status}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}