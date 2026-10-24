"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL, saveLogin } from "@/lib/api";
import styles from "../login/login.module.css";

const LABELS = {
  hospital_name: "Hospital name",
  branch: "Branch",
  username: "Username",
  email: "Email",
  phone: "Phone",
  address: "Address",
  password: "Password",
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    hospital_name: "",
    branch: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("The two passwords do not match.");
      return;
    }

    setLoading(true);
    const { confirm, ...payload } = form;

    try {
      const res = await fetch(`${API_URL}/accounts/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (data && typeof data === "object") {
          const messages = Object.entries(data).map(
            ([field, msg]) =>
              `${LABELS[field] || field}: ${[].concat(msg).join(" ")}`
          );
          setError(messages.join(" · "));
        } else {
          setError("Could not create the account.");
        }
        setLoading(false);
        return;
      }

      // account created, log in straight away
      const loginRes = await fetch(`${API_URL}/accounts/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      if (loginRes.ok) {
        saveLogin(await loginRes.json());
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch {
      setError("Cannot reach the server. Is Django running on port 8000?");
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <form className={`${styles.card} ${styles.cardWide}`} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Create an account</h1>
        <p className={styles.subtitle}>Register your hospital</p>

        {error && <p className={styles.error}>{error}</p>}

        <label className={styles.label} htmlFor="hospital_name">Hospital name</label>
        <input id="hospital_name" name="hospital_name" className={styles.input}
          value={form.hospital_name} onChange={handleChange} required />

        <label className={styles.label} htmlFor="branch">Branch (optional)</label>
        <input id="branch" name="branch" className={styles.input}
          value={form.branch} onChange={handleChange} placeholder="Main" />

        <label className={styles.label} htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className={styles.input}
          value={form.email} onChange={handleChange} required />

        <label className={styles.label} htmlFor="phone">Phone number</label>
        <input id="phone" name="phone" className={styles.input}
          value={form.phone} onChange={handleChange} required />

        <label className={styles.label} htmlFor="address">Address</label>
        <textarea id="address" name="address" rows={3} className={styles.input}
          value={form.address} onChange={handleChange} required />

        <label className={styles.label} htmlFor="username">Username</label>
        <input id="username" name="username" className={styles.input}
          value={form.username} onChange={handleChange} required />

        <label className={styles.label} htmlFor="password">Password</label>
        <input id="password" name="password" type="password" className={styles.input}
          value={form.password} onChange={handleChange} required />

        <label className={styles.label} htmlFor="confirm">Confirm password</label>
        <input id="confirm" name="confirm" type="password" className={styles.input}
          value={form.confirm} onChange={handleChange} required />

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className={styles.switch}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}