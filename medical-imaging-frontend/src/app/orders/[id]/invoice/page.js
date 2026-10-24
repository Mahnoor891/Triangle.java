"use client";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, getToken, logout, formatPKR } from "@/lib/api";
import styles from "./invoice.module.css";

const STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

export default function InvoicePage() {
  const { id } = useParams();
  const router = useRouter();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    async function load() {
      try {
        const res = await apiFetch(`/orders/${id}/invoice/`);
        if (res.status === 401) {
          logout();
          router.replace("/login");
          return;
        }
        if (res.ok) {
          setInvoice(await res.json());
        } else {
          setError(
            "No invoice is available for this order yet. It is created when you place the order."
          );
        }
      } catch {
        setError("Could not load the invoice. Is Django running?");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  const shipment = invoice?.shipment || null;
  const stepIndex = shipment ? STEPS.indexOf(shipment.status) : -1;

  return (
    <div>
    <Header />  
      <main className={styles.main}>
        <Link href={`/orders/${id}`} className={`${styles.back} ${styles.noPrint}`}>
          ← Back to order
        </Link>

        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {invoice && (
          <>
            <div className={`${styles.card} ${styles.noPrint}`}>
              <h3 className={styles.sectionTitle}>Shipment status</h3>

              {!shipment && (
                <p className={styles.muted}>
                  Your shipment has not been created yet.
                </p>
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
                  {shipment.shipment_date && (
                    <div>
                      Shipment created:{" "}
                      <strong>{new Date(shipment.shipment_date).toLocaleDateString()}</strong>
                    </div>
                  )}
                  {shipment.expected_delivery_date && (
                    <div>
                      Expected delivery:{" "}
                      <strong>{new Date(shipment.expected_delivery_date).toLocaleDateString()}</strong>
                    </div>
                  )}
                  {invoice.estimated_timeline && (
                    <div>Estimated timeline: <strong>{invoice.estimated_timeline}</strong></div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.card}>
              <div className={styles.invoiceTop}>
                <div>
                  <h2 className={styles.title}>Invoice #{invoice.invoice_id}</h2>
                  <p className={styles.muted}>
                    Order #{invoice.order_id} · Issued on{" "}
                    {new Date(invoice.invoice_date).toLocaleDateString()}
                  </p>
                </div>
                {invoice.invoice_status && (
                  <span className={styles.status}>{invoice.invoice_status}</span>
                )}
              </div>

              <div className={styles.billTo}>
                <div className={styles.billLabel}>Billed to</div>
                <div><strong>{invoice.hospital}</strong></div>
                <div>{invoice.shipping_address}</div>
                <div>{invoice.email}</div>
                {invoice.phone && <div>{invoice.phone}</div>}
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Equipment</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.equipment_name}</td>
                      <td>{formatPKR(item.price)}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPKR(item.line_total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.totalRow}>
                <span>Total amount</span>
                <span className={styles.totalValue}>{formatPKR(invoice.total_amount)}</span>
              </div>

              <button
                className={`${styles.print} ${styles.noPrint}`}
                onClick={() => window.print()}
              >
                Print invoice
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}