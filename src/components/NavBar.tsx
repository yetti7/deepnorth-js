"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct import for Next.js App Router
import Link from "next/link";
import styles from "./NavBar.module.css";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when navigating to a new page
  useEffect(() => {
    setIsOpen(false); // Close the menu on route change

    // Preload important routes for a better UX
    router.prefetch("/");
    router.prefetch("/apps");
  }, [router]);

  return (
    <nav className={styles.navBar}>
      <Link href="/" className={styles.logo}>
        Deep North
      </Link>
      <div className={`${styles.navLinks} ${isOpen ? styles.open : ""}`}>
        <Link href="/" className={styles.navLink} onClick={() => setIsOpen(false)}>
          Home
        </Link>
        <a
          href="https://releases.deepnorth.app"
          className={styles.navLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setIsOpen(false)}
        >
          Releases
        </a>
      </div>
      <div
        className={`${styles.hamburger} ${isOpen ? styles.openHamburger : ""}`}
        onClick={toggleMenu}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>
    </nav>
  );
};

export default NavBar;