"use client";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, getToken, logout, BASE_URL, addToCart } from "@/lib/api";
import styles from "./detail.module.css";

function imageSrc(image) {
  if (!image) return null;
  return image.startsWith("http") ? image : `${BASE_URL}${image}`;
}

function FormattedDescription({ text }) {
  if (!text) return null;

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const blocks = [];
  let bullets = [];

  function flush() {
    if (bullets.length) {
      blocks.push({ type: "list", items: bullets });
      bullets = [];
    }
  }

  lines.forEach((line) => {
    const colon = line.indexOf(":");
    const hasLabel =
      colon > 0 && colon <= 60 && line.slice(colon + 1).trim().length > 0;

    if (/^key features/i.test(line) || /\s*:$/.test(line)) {
      flush();
      blocks.push({ type: "heading", text: line });
    } else if (/^\d+[.)]\s/.test(line)) {
      flush();
      blocks.push({ type: "numbered", text: line });
    } else if (hasLabel) {
      bullets.push(line);
    } else {
      flush();
      blocks.push({ type: "para", text: line });
    }
  });
  flush();

  return (
    <div className={styles.description}>
      {blocks.map((b, i) => {
        if (b.type === "heading")
          return <h3 key={i} className={styles.specHeading}>{b.text}</h3>;
        if (b.type === "numbered")
          return <h4 key={i} className={styles.numbered}>{b.text}</h4>;
        if (b.type === "para") return <p key={i}>{b.text}</p>;
        return (
          <ul key={i} className={styles.list}>
            {b.items.map((item, j) => {
              const c = item.indexOf(":");
              return (
                <li key={j}>
                  <strong>{item.slice(0, c + 1)}</strong>
                  {item.slice(c + 1)}
                </li>
              );
            })}
          </ul>
        );
      })}
    </div>
  );
}

export default function EquipmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    async function load() {
      try {
        let res = await apiFetch(`/equipment/${id}/`);
        if (res.status === 401) {
          logout();
          router.replace("/login");
          return;
        }

        if (res.ok) {
          setItem(await res.json());
        } else {
          // fallback: find the item in the full list
          const listRes = await apiFetch("/equipment/");
          const data = await listRes.json();
          const list = Array.isArray(data) ? data : data.results || [];
          const found = list.find((e) => String(e.id) === String(id));
          if (found) setItem(found);
          else setError("Equipment not found.");
        }
      } catch {
        setError("Could not load equipment. Is Django running?");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  function handleAdd() {
  addToCart(item, Number(quantity) || 1);
  setAdded(true);
  setShowForm(false);
}

  async function handleEnquire(e) {
    e.preventDefault();
    setFormError("");
    setSending(true);

    try {
      const res = await apiFetch("/orders/", {
        method: "POST",
        body: JSON.stringify({
          items: [{ equipment: item.id, quantity: Number(quantity) }],
        }),
      });

      if (res.ok) {
        setSent(true);
        setShowForm(false);
      } else {
        const data = await res.json().catch(() => null);
        setFormError(
          data ? JSON.stringify(data) : "Could not send the enquiry."
        );
      }
    } catch {
      setFormError("Cannot reach the server. Is Django running?");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <Header />

      <main className={styles.main}>
        <Link href="/equipment" className={styles.back}>
          ← Back to equipment
        </Link>

        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {item && (
          <div className={styles.layout}>
            <div className={styles.imageBox}>
              {imageSrc(item.image) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageSrc(item.image)}
                  alt={item.name}
                  className={styles.image}
                />
              ) : (
                <span className={styles.noImage}>No image</span>
              )}
            </div>

            <div className={styles.info}>
              <span className={styles.category}>{item.category_name}</span>
              <h2 className={styles.name}>{item.name}</h2>
              <span className={styles.status}>{item.status}</span>
              <p className={styles.price}>
                PKR {Number(item.price).toLocaleString()}
              </p>

              <table className={styles.table}>
                <tbody>
                  <tr>
                    <td>Manufacturer</td>
                    <td>{item.manufacturer}</td>
                  </tr>
                  <tr>
                    <td>Year</td>
                    <td>{item.manufacture_year}</td>
                  </tr>
                  <tr>
                    <td>Category</td>
                    <td>{item.category_name}</td>
                  </tr>
                </tbody>
              </table>

              <FormattedDescription text={item.description} />
              {sent && (
                <div className={styles.success}>
                  Enquiry sent. The admin will review it, and you will be
                  notified here once it is accepted or rejected.
                </div>
              )}

              {added && (
               <div className={styles.success}>
                 Added to your enquiry list.{" "}
                <Link href="/enquiry"><strong>View enquiry list</strong></Link> or keep
                 browsing.
                </div>
                 )}

              {!showForm && !sent && (
                <button
                  className={styles.enquire}
                  onClick={() => setShowForm(true)}
                >
                  Enquire Now
                </button>
              )}

              {showForm && (
                <form className={styles.form} onSubmit={handleEnquire}>
                  <h3 className={styles.formTitle}>Enquiry</h3>
                  <p className={styles.formText}>
                    {item.name}. Your hospital details are added automatically.
                  </p>

                  {formError && <p className={styles.error}>{formError}</p>}

                  <label htmlFor="quantity" className={styles.label}>
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    className={styles.input}
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />

                  <div className={styles.actions}>
                    <button
                      type="submit"
                      className={styles.enquire}
                      disabled={sending}
                    >
                      {sending ? "Sending..." : "Send enquiry"}
                    </button>
                    <button
                      type="button"
                      className={styles.cancel}
                      onClick={handleAdd}
                    >
                      Add to enquiry list
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}