"use client";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, getToken, getCart, logout, formatPKR } from "@/lib/api";
import styles from "./dashboard.module.css";

function badgeClass(status) {
  switch (status) {
    case "Pending": return "badge badge-pending";
    case "Rejected": return "badge badge-rejected";
    case "Awaiting Confirmation": return "badge badge-awaiting";
    case "Confirmed": return "badge badge-confirmed";
    default: return "badge badge-cancelled";
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [orders, setOrders] = useState([]);
  const [unread, setUnread] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setName(localStorage.getItem("username") || "");
    setCartCount(getCart().reduce((sum, i) => sum + i.quantity, 0));

    async function load() {
      try {
        const [ordersRes, unreadRes] = await Promise.all([
          apiFetch("/orders/"),
          apiFetch("/notifications/unread-count/"),
        ]);
        if (ordersRes.status === 401) {
          logout();
          router.replace("/login");
          return;
        }
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          const list = Array.isArray(data) ? data : data.results || [];
          setOrders(list.sort((a, b) => b.id - a.id));
        }
        if (unreadRes.ok) {
          const data = await unreadRes.json();
          setUnread(data.unread || 0);
        }
      } catch {
        // the dashboard still works without the numbers
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const awaiting = orders.filter((o) => o.status === "Awaiting Confirmation").length;
  const pending = orders.filter((o) => o.status === "Pending").length;
  const confirmed = orders.filter((o) => o.status === "Confirmed").length;

  const tiles = [
    { href: "/equipment", title: "Equipment", text: "Browse the equipment catalogue" },
    { href: "/enquiry", title: "Enquiry list", text: "Send one enquiry for several items", badge: cartCount },
    { href: "/orders", title: "My Orders", text: "View and review all your orders" },
    { href: "/tracking", title: "Track my orders", text: "See where your shipments are" },
    { href: "/notifications", title: "Notifications", text: "Updates from the admin", badge: unread },
    { href: "/account", title: "Account settings", text: "Update your hospital details" },
  ];

  return (
    <div>
        <Header />

      <main className={styles.main}>
        <h2 className={styles.heading}>Welcome{name ? `, ${name}` : ""}</h2>

        {awaiting > 0 && (
          <Link href="/orders" className={styles.alert}>
            You have {awaiting} accepted order{awaiting === 1 ? "" : "s"} waiting
            for your review. Click here to review.
          </Link>
        )}

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNumber}>{loading ? "–" : pending}</div>
            <div className={styles.statLabel}>Enquiries pending</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>{loading ? "–" : awaiting}</div>
            <div className={styles.statLabel}>Awaiting your review</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>{loading ? "–" : confirmed}</div>
            <div className={styles.statLabel}>Confirmed orders</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>{unread}</div>
            <div className={styles.statLabel}>Unread notifications</div>
          </div>
        </div>

        <div className={styles.tiles}>
          {tiles.map((t) => (
            <Link key={t.href} href={t.href} className={styles.tile}>
              <div className={styles.tileTop}>
                <span className={styles.tileTitle}>{t.title}</span>
                {t.badge > 0 && <span className={styles.tileBadge}>{t.badge}</span>}
              </div>
              <span className={styles.tileText}>{t.text}</span>
            </Link>
          ))}
        </div>

        {orders.length > 0 && (
          <>
            <h3 className={styles.subheading}>Recent orders</h3>
            <div className={styles.recent}>
              {orders.slice(0, 3).map((o) => (
                <Link key={o.id} href={`/orders/${o.id}`} className={styles.recentRow}>
                  <span className={styles.recentId}>Order #{o.id}</span>
                  <span>{formatPKR(o.total)}</span>
                  <span className={badgeClass(o.status)}>{o.status}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}