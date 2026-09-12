import styles from './LockedSkeleton.module.css';

const WIDTHS = ['100%', '94%', '88%', '72%', '96%', '64%', '90%', '58%'] as const;

export function LockedSkeleton({ partLabels }: { partLabels: string[] }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.blur} aria-hidden="true">
        {partLabels.map((label, partIndex) => (
          <div key={`${label}-${partIndex}`} className={styles.part}>
            <span className={styles.label}>{label}</span>
            <div className={styles.lines}>
              {WIDTHS.slice(0, 4 + (partIndex % 3)).map((width, i) => (
                <div
                  key={i}
                  className={styles.line}
                  style={{ width }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.overlay} />
    </div>
  );
}
