import Navbar from "../components/navbar/navbar";
import NavbarAuth from "../components/navbar/navAuth"
import Background from "../components/background/bg";
import styles from "../css/home.module.css";

// components
import Book from "../components/card/book";
import Card from "../components/card/slide";
import LoginModal from "../components/auth/login"
import NotifModal from '../components/card/addCart'
import RegisterModal from "../components/auth/register"

// module
import {useState, useContext} from 'react'
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { API } from "../config/api";
import { useQuery } from "react-query";



export default function Home() {

  const [login, setLogin] = useState(false)
  const [register, setRegister] = useState(false)
  const [notif, setNotif] = useState(false)

  const title = 'Books';
  document.title = 'Waysbook | ' + title;

  const [state] = useContext(UserContext)

  let {data: book} = useQuery('bookData', async () => {
    const response = await API.get('/book')
    console.log(response.data.data)
    return response.data.data
  })

  return (
    <div>
      <div className={styles.bgWhite}></div>
      <Background />
      {state?.isLogin === true ? <NavbarAuth/> : <Navbar setLogin={setLogin} setRegister={setRegister}/>}
      <div className={styles.heading}>
        <h1>
          With us, you can shop online & help save your high street at the same
          time
        </h1>
      </div>
        <div className={styles.slider}>
        {book?.map((item, index) => item.promobook === "yes" &&
          <Card setNotif={setNotif} item={item} key={index} />
        )}
      </div>
      <div className={styles.listBook}>
        <div className={styles.title}>
          <h1>List Book</h1>
        </div>
          {book?.length !==0 && 
          <div className={styles.book}>
          {book?.map((item, index) => (
            <Book item={item} key={index} />
          ))

          }
          </div>
          }
        </div>
      {login && <LoginModal setLogin={setLogin} setRegister={setRegister}/>}
      {register && <RegisterModal setLogin={setLogin} setRegister={setRegister}/>}
      {notif && <NotifModal setNotif={setNotif} />}
    </div>
  );
}
