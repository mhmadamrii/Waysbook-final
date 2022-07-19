import styles from "../../css/cart.module.css";
import del from "../../assets/icons/trash.png";
import convertRupiah from 'rupiah-format'

export default function Cart({item, removeItem}) {
  return (
    <div className={styles.myCart}>
      <div className={styles.left}>
        <img src={item[1].image}/>
      </div>
      <div className={styles.right}>
        <div className={styles.title}>
          <h1>{item[1].name}</h1>
          <button onClick={() => removeItem(item[0])}>
            <img src={del} alt="" />
          </button>
        </div>
        <div className={styles.author}>
          <i>{item[1].author}</i>
        </div>
        <div className={styles.price}>
          <p>{convertRupiah.convert(item[1].price)}</p>
        </div>
      </div>
    </div>
  );
}
