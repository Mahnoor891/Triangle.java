import Header from "@/components/Header";
import SocialIcons from "@/components/SocialIcons";
import { SITE } from "@/lib/site";
import styles from "./contact.module.css";

function Icon({ children, color }) {
  return (
    <span className={styles.icon} style={{ background: color }}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </span>
  );
}

export default function ContactPage() {
  return (
    <div>
      <Header />

      <section className={styles.banner}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.subtitle}>We would be glad to hear from you</p>
      </section>

      <main className={styles.main}>
        <div className={styles.cards}>
          <div className={styles.card}>
            <Icon color="#1b6ca8">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </Icon>
            <h3 className={styles.cardTitle}>Office</h3>
            <p className={styles.cardText}>{SITE.address}</p>
          </div>

          <div className={styles.card}>
            <Icon color="#14a3a8">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </Icon>
            <h3 className={styles.cardTitle}>Email</h3>
            <p className={styles.cardText}>{SITE.email}</p>
          </div>

          <div className={styles.card}>
            <Icon color="#f5a524">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </Icon>
            <h3 className={styles.cardTitle}>Phone</h3>
            <p className={styles.cardText}>{SITE.phone}</p>
          </div>
        </div>

        <div className={styles.social}>
          <h3 className={styles.socialTitle}>Follow us</h3>
          <div className={styles.socialIcons}>
            <SocialIcons size={26} gap={22} />
          </div>
        </div>
      </main>
    </div>
  );
}