import styles from "../../css/card.module.css";
import { useShoppingCart } from "use-shopping-cart";
import convertRupiah from 'rupiah-format'

export default function Slide({setNotif, item}) {

  const {addItem} = useShoppingCart()
  function handleCart(e){
    e.preventDefault();
    addItem({
      id: item.id,
      author: item.author,
      name: item.title,
      currency: 'USD',
      price: item.price,
      image: item?.thumbnail
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.slideCard}>
        <div className={styles.left}>
          <img src={item.thumbnail}></img>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>
            <h4>{item.title}</h4>
          </div>
          <div className={styles.author}>
            <i>By {item.author}</i>
          </div>
          <div className={styles.desc}>
            <p>
              "{item.description}"
            </p>
          </div>
          <div className={styles.price}>
            <p>{convertRupiah.convert(item.price)}</p>
          </div>
          <button onClick={(e) => {setNotif(true); handleCart(e);}}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
