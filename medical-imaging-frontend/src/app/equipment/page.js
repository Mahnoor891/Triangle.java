"use client";

import CategoryPills from "@/components/CategoryPills";
import Header from "@/components/Header";
import NotificationBell from "@/components/NotificationBell";
import EnquiryLink from "@/components/EnquiryLink";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, getToken, logout, BASE_URL } from "@/lib/api";
import styles from "./equipment.module.css";

function imageSrc(image) {
  if (!image) return null;
  return image.startsWith("http") ? image : `${BASE_URL}${image}`;
}

function categoryName(item) {
  return item.category_name || "";
}

export default function EquipmentPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
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
        // works whether the API is paginated ({results: [...]}) or a plain list
        setItems(Array.isArray(data) ? data : data.results || []);
      } catch {
        setError("Could not load equipment. Is Django running?");
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

    const categories = [
    ...new Map(
      items.filter((e) => e.category).map((e) => [e.category, e.category_name])
    ),
  ].map(([cid, name]) => ({ id: cid, name }));

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <h2 className={styles.heading}>Equipment</h2>
        <CategoryPills categories={categories} activeId={null} />

        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.grid}>
          {items.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.imageBox}>
                {imageSrc(item.image) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageSrc(item.image)} alt={item.name} className={styles.image} />
                ) : (
                  <span className={styles.noImage}>No image</span>
                )}
              </div>

              <div className={styles.body}>
              <span className={styles.category}>{categoryName(item)}</span>
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