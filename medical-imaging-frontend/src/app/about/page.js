import Link from "next/link";
import Header from "@/components/Header";
import { SITE } from "@/lib/site";
import styles from "./about.module.css";

const POINTS = [
  {
    title: "Wide range",
    text: "MRI, CT, X-ray, C-arm and ultrasound equipment for hospitals and diagnostic centres.",
    color: "#1b6ca8",
  },
  {
    title: "Clear process",
    text: "Send an enquiry, review the accepted order, place it, and track delivery from your account.",
    color: "#14a3a8",
  },
  {
    title: "Local support",
    text: "Delivery, setup and after-sales support handled by a team close to you.",
    color: "#f5a524",
  },
];

export default function AboutPage() {
  return (
    <div>
      <Header />

      <section className={styles.banner}>
        <h1 className={styles.title}>About {SITE.name}</h1>
        <p className={styles.subtitle}>{SITE.tagline}</p>
      </section>

      <main className={styles.main}>
        <p className={styles.intro}>
          {SITE.name} helps hospitals and clinics find the right medical
          imaging equipment. Browse the catalogue, send an enquiry for one or
          several machines, and follow your order from approval to delivery,
          all in one place.
        </p>

        <div className={styles.cards}>
          {POINTS.map((p) => (
            <div
              key={p.title}
              className={styles.card}
              style={{ borderTopColor: p.color }}
            >
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardText}>{p.text}</p>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <p>Want to know more or talk before ordering?</p>
          <Link href="/contact" className={styles.button}>
            Contact us
          </Link>
        </div>
      </main>
    </div>
  );
}