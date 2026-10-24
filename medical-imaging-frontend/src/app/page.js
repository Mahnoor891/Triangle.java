"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, getToken } from "@/lib/api";
import { SITE } from "@/lib/site";
import Header from "@/components/Header";
import styles from "./home.module.css";

const COLORS = ["#1b6ca8", "#14a3a8", "#f5a524", "#2e9e6b"];

const SERVICES = [
  {
    icon: "✚",
    title: "Equipment supply",
    text: "MRI, CT, X-ray and ultrasound systems: locally manufactured, refurbished and remanufactured units.",
  },
  {
    icon: "⚙",
    title: "Installation and setup",
    text: "Delivery, positioning, room setup and calibration, handled for your hospital.",
  },
  {
    icon: "✔",
    title: "Warranty and support",
    text: "Local warranty, quick support and maintenance after your equipment is delivered.",
  },
];

const STEPS = [
  "Send an enquiry",
  "We review and accept it",
  "Review and place your order",
  "Track your delivery",
];

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!getToken()) return;
    setLoggedIn(true);

    async function load() {
      try {
        const res = await apiFetch("/equipment/");
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results || [];
        const seen = new Map();
        list.forEach((e) => {
          if (e.category && !seen.has(e.category)) {
            seen.set(e.category, e.category_name);
          }
        });
        setCategories([...seen].map(([id, name]) => ({ id, name })));
      } catch {
        // the home page works without categories
      }
    }
    load();
  }, []);

  return (
    <div>
      <Header />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.badge}>Trusted by hospitals and clinics</span>
          <h1 className={styles.heroTitle}>
            Medical imaging equipment for your hospital
          </h1>
          <p className={styles.heroText}>
            Browse our catalogue, send an enquiry, and follow your order from
            approval to delivery, all in one place.
          </p>
          <div className={styles.heroButtons}>
            {loggedIn ? (
              <>
                <Link href="/equipment" className={styles.primary}>
                  Browse equipment
                </Link>
                <Link href="/dashboard" className={styles.secondary}>
                  Go to dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className={styles.primary}>
                  Log in
                </Link>
                <Link href="/register" className={styles.secondary}>
                  Register your hospital
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>What we do</h2>
        <div className={styles.cards}>
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className={styles.card}
              style={{ borderTopColor: COLORS[i % COLORS.length] }}
            >
              <div
                className={styles.icon}
                style={{ background: COLORS[i % COLORS.length] }}
              >
                {s.icon}
              </div>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardText}>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {loggedIn && categories.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.heading}>Browse by category</h2>
          <div className={styles.cards}>
            {categories.map((c, i) => (
              <Link
                key={c.id}
                href={`/equipment/category/${c.id}`}
                className={styles.category}
                style={{ borderLeftColor: COLORS[i % COLORS.length] }}
              >
                <span>{c.name}</span>
                <span className={styles.arrow}>→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.heading}>How it works</h2>
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={s} className={styles.step}>
              <div
                className={styles.stepNumber}
                style={{ background: COLORS[i % COLORS.length] }}
              >
                {i + 1}
              </div>
              <div className={styles.stepText}>{s}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Have a question first?</h2>
        <p>Talk to us at {SITE.email} or call {SITE.phone}.</p>
        <Link href="/contact" className={styles.primary}>
          Contact us
        </Link>
      </section>
    </div>
  );
}