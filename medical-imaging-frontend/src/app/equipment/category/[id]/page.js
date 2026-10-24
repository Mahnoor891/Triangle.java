"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, getToken, logout, BASE_URL } from "@/lib/api";
import Header from "@/components/Header";
import CategoryPills from "@/components/CategoryPills";
import styles from "../../equipment.module.css";

function imageSrc(image) {
  if (!image) return null;
  return image.startsWith("http") ? image : `${BASE_URL}${image}`;
}

export default function CategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    async function load() {
      try {
        const res = await apiFetch("/equipment/");
        if (res.status === 401) {
          logout();
          router.replace("/login");
          return;
        }
        const data = await res.json();
        setAll(Array.isArray(data) ? data : data.results || []);
      } catch {
        setError("Could not load equipment. Is Django running?");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const categories = [
    ...new Map(
      all.filter((e) => e.category).map((e) => [e.category, e.category_name])
    ),
  ].map(([cid, name]) => ({ id: cid, name }));

  const items = all.filter((e) => String(e.category) === String(id));
  const current = categories.find((c) => String(c.id) === String(id));

  return (
    <div>
      <Header />

      <main className={styles.main}>
        <h2 className={styles.heading}>
          {current ? current.name : "Equipment"}
        </h2>

        <CategoryPills categories={categories} activeId={id} />

        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p>No equipment found in this category.</p>
        )}

        <div className={styles.grid}>
          {items.map((item) => (
            <div key={item.id} className={styles.card}>
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

              <div className={styles.body}>
                <span className={styles.category}>{item.category_name}</span>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.meta}>
                  {item.manufacturer} · {item.manufacture_year}
                </p>
                <span className={styles.status}>{item.status}</span>
                <p className={styles.price}>
                  PKR {Number(item.price).toLocaleString()}
                </p>
                <Link href={`/equipment/${item.id}`} className={styles.button}>
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}