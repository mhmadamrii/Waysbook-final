import styles from "../../css/nav.module.css";
import logo from "../../assets/icons/logo.png";
import { Link } from "react-router-dom"

export default function Navbar({setLogin, setRegister}) {

  return (
    <div className={styles.navContainer}>
      <div className={styles.logo}>
        <Link to="/"><img src={logo} alt="" /></Link>
      </div>
      <div className={styles.auth}>
        <button onClick={() => setLogin(true)} className={styles.login}>Login</button>
        <button onClick={() => setRegister(true)} className={styles.register}>Register</button>
      </div>
    </div>
  );
}
