"use client";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  apiFetch,
  getToken,
  getCart,
  saveCart,
  clearCart,
  formatPKR,
} from "@/lib/api";
import NotificationBell from "@/components/NotificationBell";
import styles from "./enquiry.module.css";

export default function EnquiryPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [ready, setReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setCart(getCart());
    setReady(true);
  }, [router]);

  function update(newCart) {
    setCart(newCart);
    saveCart(newCart);
  }

  function changeQuantity(id, qty) {
    if (qty < 1) return;
    update(cart.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  }

  function removeItem(id) {
    update(cart.filter((i) => i.id !== id));
  }

  function emptyList() {
    if (!window.confirm("Remove everything from the enquiry list?")) return;
    clearCart();
    setCart([]);
  }

  const total = cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  async function submit() {
    setSending(true);
    setError("");
    try {
      const res = await apiFetch("/orders/", {
        method: "POST",
        body: JSON.stringify({
          items: cart.map((i) => ({ equipment: i.id, quantity: i.quantity })),
        }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        clearCart();
        router.push(data && data.id ? `/orders/${data.id}` : "/orders");
        return;
      }

      const data = await res.json().catch(() => null);
      setError(data ? JSON.stringify(data) : "Could not send the enquiry.");
    } catch {
      setError("Cannot reach the server. Is Django running?");
    }
    setSending(false);
  }

  return (
    <div>
      <Header />

      <main className={styles.main}>
        <h2 className={styles.heading}>Enquiry list</h2>

        {ready && cart.length === 0 && (
          <div className={styles.card}>
            <p>Your enquiry list is empty.</p>
            <Link href="/equipment" className={styles.browse}>
              Browse equipment
            </Link>
          </div>
        )}

        {cart.length > 0 && (
          <div className={styles.card}>
            {error && <p className={styles.error}>{error}</p>}

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <Link href={`/equipment/${i.id}`}>{i.name}</Link>
                    </td>
                    <td>{formatPKR(i.price)}</td>
                    <td>
                      <div className={styles.qty}>
                        <button onClick={() => changeQuantity(i.id, i.quantity - 1)}>−</button>
                        <span>{i.quantity}</span>
                        <button onClick={() => changeQuantity(i.id, i.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td>{formatPKR(Number(i.price) * i.quantity)}</td>
                    <td>
                      <button
                        className={styles.remove}
                        onClick={() => removeItem(i.id)}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.totalRow}>
              <span>Estimated total</span>
              <span className={styles.totalValue}>{formatPKR(total)}</span>
            </div>
            <p className={styles.note}>
              Based on listed prices. The admin reviews your enquiry and
              confirms the final price and timeline. Your hospital details are
              added automatically.
            </p>

            <div className={styles.actions}>
              <button className={styles.send} onClick={submit} disabled={sending}>
                {sending ? "Sending..." : "Send enquiry"}
              </button>
              <button className={styles.clear} onClick={emptyList} disabled={sending}>
                Clear list
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}