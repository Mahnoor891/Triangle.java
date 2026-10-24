"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, getToken, logout } from "@/lib/api";
import Header from "@/components/Header";
import styles from "./account.module.css";

export default function AccountPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    async function load() {
      try {
        const res = await apiFetch("/my-hospital/");
        if (res.status === 401) {
          logout();
          router.replace("/login");
          return;
        }
        const data = await res.json();
        if (res.ok) {
          setForm({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
          });
          setBranch(data.branch || "");
        } else {
          setError(data.detail || "Could not load your details.");
        }
      } catch {
        setError("Could not load your details. Is Django running?");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  }

  async function handleSubmit(e) {
  e.preventDefault();
  setSaving(true);
  setError("");
  setSaved(false);

  try {
    const res = await apiFetch("/my-hospital/", {
      method: "PATCH",
      body: JSON.stringify(form),
    });
    const text = await res.text();

    if (res.ok) {
      setSaved(true);
    } else {
      let message = "";
      try {
        const data = JSON.parse(text);
        message = Object.entries(data)
          .map(([field, msg]) => `${field}: ${[].concat(msg).join(" ")}`)
          .join(" · ");
      } catch {
        message = text.slice(0, 300);
      }
      setError(`Error ${res.status}. ${message}`);
    }
  } catch {
    setError("Cannot reach the server. Is Django running?");
  }
  setSaving(false);
}

  return (
    <div>
      <Header />

      <main className={styles.main}>
        <h2 className={styles.heading}>Account settings</h2>

        {loading && <p>Loading...</p>}

        {!loading && (
          <form className={styles.card} onSubmit={handleSubmit}>
            <p className={styles.note}>
              These details are filled into your enquiries automatically.
              Changes apply to new enquiries only, not to existing orders.
            </p>

            {error && <p className={styles.error}>{error}</p>}
            {saved && <p className={styles.success}>Your details were saved.</p>}

            {branch && (
              <>
                <label className={styles.label}>Branch</label>
                <input className={styles.inputReadonly} value={branch} readOnly />
              </>
            )}

            <label className={styles.label} htmlFor="name">Hospital name</label>
            <input
              id="name"
              name="name"
              className={styles.input}
              value={form.name}
              onChange={handleChange}
              required
            />

            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              value={form.email}
              onChange={handleChange}
              required
            />

            <label className={styles.label} htmlFor="phone">Phone number</label>
            <input
              id="phone"
              name="phone"
              className={styles.input}
              value={form.phone}
              onChange={handleChange}
              required
            />

            <label className={styles.label} htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              rows={3}
              className={styles.input}
              value={form.address}
              onChange={handleChange}
              required
            />

            <button className={styles.button} type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}