import React from "react";
import Navbar from "../components/navbar/navAuth";
import Bg from "../components/background/bg";
import styles from "../css/cart.module.css";
import MyCart from "../components/cart/cart";
import PaymentModal from "../components/card/payment"
import {useState, useEffect} from 'react'
import { useShoppingCart } from "use-shopping-cart"
import { useQuery, useMutation } from "react-query";
import { API } from "../config/api";
import { useNavigate } from "react-router-dom";
// import { useParams, useHistory } from "react-router-dom";

export default function Cart() {

  let navigate = useNavigate()

  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = "SB-Mid-client-M9jH4MYrAGpr-E7mc";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, [])

  const handleBuy = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      keys = keys.map(function(x){
      return parseInt(x);
    });

      const data = {
        totalpayment: totalPrice,
        booksId: keys
      };
    
      const body = JSON.stringify(data);

      const response = await API.post('/transaction', body, config);
      console.log(response)
      // Create variabel for store token payment from response here ...
      const token = response.data.payment.token;

      // Init Snap for display payment page with token here ...
      window.snap.pay(token, {
        onSuccess: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate("/user/profile");
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate("/user/profile");
        },
        onError: function (result) {
          /* You may add your own implementation here */
          console.log(result);
        },
        onClose: function () {
          /* You may add your own implementation here */
          alert("you closed the popup without finishing the payment");
        },
      })
    } catch (error) {
      console.log(error);
    }
  });

  const [success, setSuccess] = useState(false)

  const { cartCount, cartDetails, removeItem, totalPrice, clearCart} = useShoppingCart();
    let keys   = Object.keys(cartDetails);
    const entries   = Object.entries(cartDetails);

  const formatterPrice    = new Intl.NumberFormat('id-ID', {
    style       : 'currency',
    currency    : 'IDR'
  });

  return (
    <div>
      <Bg />
      <Navbar />
      <div className={styles.cartContainer}>
        <div className={styles.left}>
          <h1 className={styles.mc}>My Cart</h1>
          <h1 className={styles.ryo}>Review Your order</h1>
          <hr />
          <div className={styles.list}>
            {entries.map(item => (
              <MyCart item={item} removeItem={removeItem} />
            ))}
          </div>
          <hr />
        </div>
        <div className={styles.right}>
          <hr />
          <div className={styles.total}>
            <div className={styles.subtotal}>
              <p>Subtotal:</p>
              <p>{formatterPrice.format(totalPrice)}</p>
            </div>
            <div className={styles.qty}>
              <p>Qty:</p>
              <p>{cartCount}</p>
            </div>
          </div>
          <hr />
          <div className={styles.price}>
            <p>Total:</p>
            <p>{formatterPrice.format(totalPrice)}</p>
          </div>
          <button onClick={(e) => handleBuy.mutate(e)} className={styles.btnBuy}>Pay</button>
        </div>
      </div>
      {success && <PaymentModal setSuccess={setSuccess}/>}
    </div>
  );
}
