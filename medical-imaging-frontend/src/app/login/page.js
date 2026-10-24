"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, saveLogin } from "@/lib/api";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/accounts/login/", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        saveLogin(data);
        router.push("/dashboard");
      } else {
        setError("Invalid username or password.");
      }
    } catch {
      setError("Cannot reach the server. Is Django running on port 8000?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Medical Imaging Equipment</h1>
        <p className={styles.subtitle}>Hospital login</p>

        {error && <p className={styles.error}>{error}</p>}

        <label className={styles.label} htmlFor="username">Username</label>
        <input
          id="username"
          className={styles.input}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className={styles.label} htmlFor="password">Password</label>
        <input
          id="password"
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p className={styles.switch}>
          New hospital? <Link href="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}