import styles from "../../css/card.module.css";
import {Link} from 'react-router-dom'
import convertRupiah from 'rupiah-format'

export default function Book({item}) {

  return (
    <div>
      <Link to={`/detail/${item.id}`} >
      <div className={styles.book}>
        <div className={styles.bookImg}>
          <img src={item.thumbnail}/>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.title}>
            <h1>{item.title}</h1>
          </div>
          <div className={styles.author}>
            <i>{item.author}</i>
          </div>
          <div className={styles.price}>{convertRupiah.convert(item.price)}</div>
        </div>
      </div>
      </Link>
    </div>
  );
}
