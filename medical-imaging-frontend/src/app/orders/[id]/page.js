"use client";
import Header from "@/components/Header";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, getToken, logout, formatPKR } from "@/lib/api";
import styles from "./order.module.css";

function badgeClass(status) {
  switch (status) {
    case "Pending": return "badge badge-pending";
    case "Rejected": return "badge badge-rejected";
    case "Awaiting Confirmation": return "badge badge-awaiting";
    case "Confirmed": return "badge badge-confirmed";
    default: return "badge badge-cancelled";
  }
}

export default function OrderPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch(`/orders/${id}/`);
      if (res.status === 401) {
        logout();
        router.replace("/login");
        return;
      }
      if (!res.ok) {
        setError("Order not found.");
        return;
      }
      setOrder(await res.json());
    } catch {
      setError("Could not load the order. Is Django running?");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    load();
  }, [load, router]);

  const editable = order && order.status === "Awaiting Confirmation";

  // live total, calculated from the quantities currently on screen
  const liveTotal = order
    ? order.items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)
    : 0;

  async function changeQuantity(item, newQty) {
    if (newQty < 1) return;
    setActionError("");
    setOrder((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.id === item.id ? { ...i, quantity: newQty } : i
      ),
    }));
    const res = await apiFetch(`/orders/${id}/items/${item.id}/`, {
      method: "PATCH",
      body: JSON.stringify({ quantity: newQty }),
    });
    if (!res.ok) {
      setActionError("Could not update the quantity.");
      load();
    }
  }

  async function removeItem(item) {
    if (!window.confirm(`Remove ${item.equipment_name} from this order?`)) return;
    setActionError("");
    const res = await apiFetch(`/orders/${id}/items/${item.id}/`, {
      method: "DELETE",
    });
    if (res.ok) {
  if (order.items.length === 1) {
    router.push("/orders");
    return;
  }
  setOrder((prev) => ({
    ...prev,
    items: prev.items.filter((i) => i.id !== item.id),
  }));
} else { 
      setActionError("Could not remove the item.");
    }
  }

  async function placeOrder() {
    setBusy(true);
    setActionError("");
    const res = await apiFetch(`/orders/${id}/place/`, { method: "POST" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setActionError(data ? JSON.stringify(data) : "Could not place the order.");
    }
    await load();
    setBusy(false);
  }

  async function cancelOrder() {
  if (!window.confirm("Cancel this order?")) return;
  setBusy(true);
  setActionError("");
  const res = await apiFetch(`/orders/${id}/cancel/`, { method: "POST" });
  if (res.ok) {
    router.push("/orders");
    return;
  }
  const data = await res.json().catch(() => null);
  setActionError(data ? JSON.stringify(data) : "Could not cancel the order.");
  setBusy(false);
}

  return (
    <div>
    <Header />

      <main className={styles.main}>
        <Link href="/orders" className={styles.back}>← Back to my orders</Link>

        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {order && (
          <div className={styles.card}>
            <div className={styles.top}>
              <h2 className={styles.title}>Order #{order.id}</h2>
              <span className={badgeClass(order.status)}>{order.status}</span>
            </div>

            <p className={styles.meta}>
              Placed on {new Date(order.order_date).toLocaleString()}
            </p>

          {order.status === "Pending" && (
           <div className={styles.notice}>
            Your enquiry is waiting for the admin to review it.
            <div style={{ marginTop: 12 }}>
         <button
        className={styles.cancel}
        onClick={cancelOrder}
        disabled={busy}
      >
        Cancel enquiry
      </button>
    </div>
  </div>
)}
            {order.status === "Rejected" && (
              <div className={styles.noticeRed}>
                This enquiry was rejected.
                {order.admin_note && <> Note: {order.admin_note}</>}
              </div>
            )}
            {order.status === "Cancelled" && (
              <div className={styles.notice}>This order was cancelled.</div>
            )}
            {editable && (
              <div className={styles.noticeBlue}>
                Your enquiry was accepted. Review the items below, then place
                the order.
                {order.estimated_timeline && (
                  <> Estimated timeline: <strong>{order.estimated_timeline}</strong>.</>
                )}
                {order.admin_note && <> Note: {order.admin_note}</>}
              </div>
            )}
            {order.status === "Confirmed" && (
              <div className={styles.noticeGreen}>
                Your order is confirmed.
                {order.estimated_timeline && (
                  <> Estimated timeline: <strong>{order.estimated_timeline}</strong>.</>
                )}{" "}
                <Link href={`/orders/${order.id}/invoice`} className={styles.invoiceLink}>
                  View invoice
                </Link>
              </div>
            )}

            {actionError && <p className={styles.error}>{actionError}</p>}

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  {editable && <th></th>}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.equipment_name}</td>
                    <td>{formatPKR(item.price)}</td>
                    <td>
                      {editable ? (
                        <div className={styles.qty}>
                          <button onClick={() => changeQuantity(item, item.quantity - 1)}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => changeQuantity(item, item.quantity + 1)}>+</button>
                        </div>
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td>{formatPKR(Number(item.price) * item.quantity)}</td>
                    {editable && (
                      <td>
                        <button
                          className={styles.remove}
                          onClick={() => removeItem(item)}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {order.items.length === 0 && (
              <p className={styles.meta}>No items left in this order.</p>
            )}

            <div className={styles.totalRow}>
              <span>Total</span>
              <span className={styles.totalValue}>{formatPKR(liveTotal)}</span>
            </div>

            {editable && (
              <div className={styles.actions}>
                <button
                  className={styles.place}
                  onClick={placeOrder}
                  disabled={busy || order.items.length === 0}
                >
                  Place order
                </button>
                <button className={styles.cancel} onClick={cancelOrder} disabled={busy}>
                  Cancel order
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}