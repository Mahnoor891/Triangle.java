"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCart } from "@/lib/api";
import styles from "./EnquiryLink.module.css";

export default function EnquiryLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function update() {
      setCount(getCart().reduce((sum, i) => sum + i.quantity, 0));
    }
    update();
    window.addEventListener("cart-changed", update);
    return () => window.removeEventListener("cart-changed", update);
  }, []);

  return (
    <Link href="/enquiry" className={styles.link}>
      Enquiry list
      {count > 0 && <span className={styles.count}>{count}</span>}
    </Link>
  );
}