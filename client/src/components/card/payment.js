import styles from "../../css/modal.module.css";

export default function AddCart({ setSuccess }) {
  return (
    <div>
      <button onClick={() => setSuccess()} className={styles.bg}></button>
      <div className={styles.notif}>
        Thank you for ordering, please wait 1 x 24 hours to verify your order
      </div>
    </div>
  );
}
