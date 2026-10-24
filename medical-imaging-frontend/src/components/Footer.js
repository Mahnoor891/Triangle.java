"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";
import Logo from "./logo";
import SocialIcons from "./SocialIcons";
import styles from "./Footer.module.css";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.col}>
          <Logo dark />
          <p className={styles.text}>
            Medical imaging equipment for hospitals and clinics.
          </p>
        </div>

        <div className={styles.col}>
          <h4 className={styles.heading}>Quick links</h4>
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/equipment">Equipment</Link>
          <Link href="/contact">Contact Us</Link>
        </div>

        <div className={styles.col}>
          <h4 className={styles.heading}>Contact</h4>
          <span>{SITE.address}</span>
          <span>{SITE.email}</span>
          <span>{SITE.phone}</span>
          <SocialIcons size={18} />
        </div>
      </div>

      <div className={styles.bottom}>
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}