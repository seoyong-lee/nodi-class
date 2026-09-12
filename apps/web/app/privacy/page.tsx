import styles from '../../styles/page.module.css';

export default function PrivacyPage() {
  return (
    <main>
      <section className={styles.sectionLast}>
        <h1 className={styles.legalTitle}>개인정보처리방침</h1>
        <div className={styles.legalBody}>
          <h2>수집 항목</h2>
          <ul>
            <li>이메일</li>
            <li>선택 정보</li>
            <li>유입 경로</li>
            <li>동의 시각</li>
          </ul>
          <h2>이용 목적</h2>
          <ul>
            <li>자료 전달</li>
            <li>새 자료 안내</li>
          </ul>
          <h2>보관 기간</h2>
          <p>해지 시까지</p>
          <h2>처리 위탁</h2>
          <p>AWS</p>
        </div>
      </section>
    </main>
  );
}
