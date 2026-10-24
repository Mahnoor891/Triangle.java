"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch, getToken, logout } from "@/lib/api";
import { SITE } from "@/lib/site";
import Logo from "./logo";
import SocialIcons from "./SocialIcons";
import NotificationBell from "./NotificationBell";
import EnquiryLink from "./EnquiryLink";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dropRef = useRef(null);

  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const token = getToken();
    setLoggedIn(!!token);
    if (!token) return;

    try {
      const cached = JSON.parse(sessionStorage.getItem("mieb_categories"));
      if (cached) setCategories(cached);
    } catch {}

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
        const cats = [...seen].map(([id, name]) => ({ id, name }));
        setCategories(cats);
        sessionStorage.setItem("mieb_categories", JSON.stringify(cats));
      } catch {}
    }
    load();
  }, []);

  useEffect(() => {
    function onClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleLogout() {
    logout();
    sessionStorage.removeItem("mieb_categories");
    router.push("/login");
  }

  function isActive(href) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  const cls = (href) => `${styles.link} ${isActive(href) ? styles.active : ""}`;

  return (
    <>
      <div className={styles.ribbon}>
        <div className={styles.ribbonInner}>
          <div className={styles.contact}>
            <span>{SITE.email}</span>
            <span>{SITE.phone}</span>
          </div>
          <SocialIcons size={16} />
        </div>
      </div>

      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>
            <Logo dark />
          </Link>

          <button
            className={styles.burger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            ☰
          </button>

          <div className={`${styles.collapse} ${menuOpen ? styles.open : ""}`}>
            <nav className={styles.nav}>
              <Link href="/" className={cls("/")}>Home</Link>
              <Link href="/about" className={cls("/about")}>About Us</Link>

              <div className={styles.dropdown} ref={dropRef}>
                <Link href="/equipment" className={cls("/equipment")}>
                  Equipment
                </Link>
                {loggedIn && categories.length > 0 && (
                  <button
                    className={styles.arrow}
                    onClick={() => setDropOpen(!dropOpen)}
                    aria-label="Show categories"
                  >
                    ▾
                  </button>
                )}
                {loggedIn && categories.length > 0 && (
                  <div className={`${styles.menu} ${dropOpen ? styles.menuOpen : ""}`}>
                    <Link href="/equipment">All equipment</Link>
                    {categories.map((c) => (
                      <Link key={c.id} href={`/equipment/category/${c.id}`}>
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/contact" className={cls("/contact")}>Contact Us</Link>
              {loggedIn && (
                <Link href="/dashboard" className={cls("/dashboard")}>Dashboard</Link>
              )}
            </nav>

            <div className={styles.right}>
              {loggedIn ? (
                <>
                  <EnquiryLink />
                  <NotificationBell />
                  <button className={styles.logout} onClick={handleLogout}>
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className={styles.link}>Log in</Link>
                  <Link href="/register" className={styles.logout}>Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}