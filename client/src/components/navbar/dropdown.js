import React from "react";
import styles from "../../css/nav.module.css";
import profile from "../../assets/icons/profile.png";
import complain from "../../assets/icons/complain.png";
import logoutIcon from "../../assets/icons/logout.png";
import arrow from "../../assets/icons/polygon.png";
import book from "../../assets/icons/book.png"
// import {useState} from 'react'
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function Dropdown({logoutHandler}) {

  const [state, dispatch] = useContext(UserContext)

  let navigate = useNavigate()

  function logout(){
      console.log(state)
      dispatch({
          type: "LOGOUT"
      })
      navigate("/")
  }

  return (
    <div>
      <div className={styles.dropCon}>
        {state?.user.data.status === "admin" ? 
        <Link to="/add-book">
          <div className={styles.profile}>
            <img src={book} />
            <p>Add Book</p>
          </div>
        </Link> 
        :
        <Link to="/profile">
          <div className={styles.profile}>
            <img src={profile} />
            <p>Profile</p>
          </div>
        </Link> 
        }
        {state?.user.data.status === "admin" ? 
        <Link to="/complain-admin">
        <div className={styles.complain}>
          <img src={complain} />
          <p>Complain</p>
        </div>
        </Link> 
        :
        <Link to="/complain">
        <div className={styles.complain}>
          <img src={complain} />
          <p>Complain</p>
        </div>
        </Link>
        }
        <div className={styles.hLine}></div>
        <Link onClick={() => {logout(); logoutHandler()}} to="/">
        <div className={styles.logout}>
          <img src={logoutIcon} />
          <p>Logout</p>
        </div>
        </Link>
        <img src={arrow} className={styles.arrow} />
      </div>
    </div>
  );
}
