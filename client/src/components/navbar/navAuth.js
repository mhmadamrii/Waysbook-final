import styles from "../../css/nav.module.css";
import logo from "../../assets/icons/logo.png";
import blankProfile from "../../assets/temp/blank-profile.png";
import cart from "../../assets/icons/cart.png";
import Dropdown from "./dropdown";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { useShoppingCart } from "use-shopping-cart";
import { UserContext } from "../../context/userContext";
import { useQuery } from "react-query";
import { API } from "../../config/api";

export default function Navbar() {

  const [state] = useContext(UserContext)

  let {data: profile} = useQuery('profileCache', async () => {
    const response = await API.get(`/profile/` + state?.user.data.id)
    console.log(response.data.data)
    return response.data.data
  })

  const [drop, setDrop] = useState(false);

  const {cartDetails, clearCart} = useShoppingCart();
  const cartData = Object.entries(cartDetails)

  function logoutHandler() {
        localStorage.removeItem("token");
        clearCart();
    }

  return (
    <div className={styles.navContainer}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} alt="" />
        </Link>
      </div>
      <div className={styles.right}>
        <Link to="/cart">
          <img className={styles.cart} src={cart} alt="" />
        </Link>
        {drop ? (
          <button onClick={() => setDrop(false)}>
            <img className={styles.profile} src={profile?.image ? profile?.image : blankProfile} alt="" />
          </button>
        ) : (
          <button onClick={() => setDrop(true)}>
            <img className={styles.profile} src={profile?.image ? profile?.image : blankProfile} alt="" />
          </button>
        )}
      </div>
      <div className={styles.notification}>{cartData.length}</div>
      {drop && <Dropdown logoutHandler={logoutHandler} />}
    </div>
  );
}
