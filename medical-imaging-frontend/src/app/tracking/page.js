"use client";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, getToken, logout, formatPKR } from "@/lib/api";
import styles from "./tracking.module.css";

const STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

export default function TrackingPage() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
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
        const confirmed = list
          .filter((o) => o.status === "Confirmed")
          .sort((a, b) => b.id - a.id);

        const withShipment = await Promise.all(
          confirmed.map(async (o) => {
            try {
              const r = await apiFetch(`/orders/${o.id}/invoice/`);
              if (r.ok) {
                const inv = await r.json();
                return { order: o, shipment: inv.shipment, timeline: inv.estimated_timeline };
              }
            } catch {}
            return { order: o, shipment: null, timeline: "" };
          })
        );
        setRows(withShipment);
      } catch {
        setError("Could not load your orders. Is Django running?");
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
        <h2 className={styles.heading}>Track my orders</h2>

        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && rows.length === 0 && (
          <p>
            You have no confirmed orders yet. Shipments appear here once you
            place an accepted order.
          </p>
        )}

        {rows.map(({ order, shipment, timeline }) => {
          const stepIndex = shipment ? STEPS.indexOf(shipment.status) : -1;
          return (
            <div key={order.id} className={styles.card}>
              <div className={styles.top}>
                <div>
                  <div className={styles.orderNo}>Order #{order.id}</div>
                  <div className={styles.meta}>
                    {order.items.map((i) => `${i.equipment_name} × ${i.quantity}`).join(", ")}
                  </div>
                </div>
                <div className={styles.total}>{formatPKR(order.total)}</div>
              </div>

              {!shipment && (
                <p className={styles.meta}>Your shipment has not been created yet.</p>
              )}

              {shipment && stepIndex >= 0 && (
                <div className={styles.steps}>
                  {STEPS.map((s, i) => (
                    <div
                      key={s}
                      className={`${styles.step} ${i <= stepIndex ? styles.done : ""}`}
                    >
                      <div className={styles.dot}>{i <= stepIndex ? "✓" : i + 1}</div>
                      <div className={styles.stepLabel}>{s}</div>
                    </div>
                  ))}
                </div>
              )}

              {shipment && stepIndex < 0 && (
                <p>Status: <strong>{shipment.status}</strong></p>
              )}

              {shipment && (
                <div className={styles.shipMeta}>
                  {shipment.tracking_number && (
                    <div>Tracking number: <strong>{shipment.tracking_number}</strong></div>
                  )}
                  {shipment.expected_delivery_date && (
                    <div>
                      Expected delivery:{" "}
                      <strong>{new Date(shipment.expected_delivery_date).toLocaleDateString()}</strong>
                    </div>
                  )}
                  {timeline && <div>Estimated timeline: <strong>{timeline}</strong></div>}
                </div>
              )}

              <Link href={`/orders/${order.id}/invoice`} className={styles.invoiceLink}>
                View invoice
              </Link>
            </div>
          );
        })}
      </main>
    </div>
  );
}