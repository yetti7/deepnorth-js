"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './NavBar.module.css';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navBar}>
      <Link href="/" className={styles.logo}>
        Deep North
      </Link>
      <div className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
        <Link href="/" className={styles.navLink}>
          Home
        </Link>
        <Link href="/apps" className={styles.navLink}>
          Apps
        </Link>
      </div>
      <div
        className={`${styles.hamburger} ${isOpen ? styles.openHamburger : ''}`}
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