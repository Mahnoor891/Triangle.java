import Link from "next/link";
import styles from "./CategoryPills.module.css";

export default function CategoryPills({ categories, activeId }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className={styles.pills}>
      <Link
        href="/equipment"
        className={`${styles.pill} ${!activeId ? styles.active : ""}`}
      >
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/equipment/category/${c.id}`}
          className={`${styles.pill} ${
            String(activeId) === String(c.id) ? styles.active : ""
          }`}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}