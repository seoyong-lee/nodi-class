import styles from '../../styles/page.module.css';

export default function TermsPage() {
  return (
    <main>
      <section className={styles.sectionLast}>
        <h1 className={styles.legalTitle}>이용약관</h1>
        <div className={styles.legalBody}>
          <p>
            본 이용약관은 노디 AI 클래스에서 제공하는 무료 자료 열람·이메일 안내
            서비스에 적용됩니다. Step 1 범위의 무료 서비스에 한합니다.
          </p>
          <h2>서비스 내용</h2>
          <p>
            이메일을 등록하고 확인 링크를 누르면, 공개된 무료 자료를 열람할 수
            있습니다. 유료 결제·회원 가입은 포함하지 않습니다.
          </p>
          <h2>이용자의 의무</h2>
          <p>
            타인의 이메일을 도용하거나, 자료를 무단으로 재판매·재배포해서는 안
            됩니다.
          </p>
          <h2>운영</h2>
          <p>
            서비스는 Cascades가 운영합니다. 약관은 필요 시 개정될 수 있으며,
            개정 시 사이트에 게시합니다.
          </p>
        </div>
      </section>
    </main>
  );
}
