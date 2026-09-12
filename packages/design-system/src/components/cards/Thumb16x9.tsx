import type { ReactNode } from 'react';
import styles from './Thumb16x9.module.css';

export type Thumb16x9Props = {
  src?: string;
  alt?: string;
  children?: ReactNode;
};

export function Thumb16x9({ src, alt = '', children }: Thumb16x9Props) {
  return (
    <div className={styles.root}>
      {src ? <img className={styles.image} src={src} alt={alt} /> : (
        <span className={styles.placeholder}>16:9</span>
      )}
      {children}
    </div>
  );
}
