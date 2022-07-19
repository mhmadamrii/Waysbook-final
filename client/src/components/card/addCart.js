import styles from "../../css/modal.module.css";

export default function AddCart({ setNotif }) {
  return (
    <div>
      <button onClick={() => setNotif()} className={styles.bg}></button>
      <div className={styles.notif}>
        The product is successfully added to cart
      </div>
    </div>
  );
}
