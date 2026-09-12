import styles from '../../styles/page.module.css';

export default function RefundPage() {
  return (
    <main>
      <section className={styles.sectionLast}>
        <h1 className={styles.legalTitle}>환불 정책</h1>
        <div className={styles.legalBody}>
          <p>현재 유료 상품이 없습니다</p>
        </div>
      </section>
    </main>
  );
}
