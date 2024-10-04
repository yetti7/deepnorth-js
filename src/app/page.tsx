import Image from 'next/image';
import styles from './home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <a href="https://deepnorth.app">
          <Image 
            src="/logos/Transparent_Yetti_Dark.webp" 
            alt="Yeti Logo"
            width={600} 
            height={600}
          />
        </a>
      </div>
      <div className={styles.textContainer}>
        <h1>Welcome to Deep North</h1>
        <p>Your journey starts here</p>
      </div>
    </div>
  );
}