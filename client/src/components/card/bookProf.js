import pic from "../../assets/book/book1.png";
import styles from "../../css/profile.module.css";

export default function Book() {
  return (
    <div>
      <div className={styles.book}>
        <div className={styles.bookImg}>
          <img src={pic} />
        </div>
        <div className={styles.cardBody}>
          <div className={styles.title}>
            <h1>Boys do write love letters</h1>
          </div>
          <div className={styles.author}>
            <i>By Kansa Airlangga</i>
          </div>
      <button className={styles.bookBtn}>Download</button>
        </div>
      </div>
    </div>
  );
}
