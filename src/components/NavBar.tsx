import Link from "next/link";
import styles from "./NavBar.module.css";  // Import styles from a CSS module

const NavBar = () => {
  return (
    <nav className={styles.navBar}>
      {/* "Deep North" logo on the left, linking to the landing page */}
      <Link href="https://deepnorth.app" className={styles.logo}>
        Deep North
      </Link>

      {/* Boxed navigation items on the left */}
      <ul className={styles.navLinks}>
        <li className={styles.navItem}>
          <Link href="/about" className={styles.navLink}>
            About
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/contact" className={styles.navLink}>
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;