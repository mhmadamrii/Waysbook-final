import styles from "../css/profile.module.css";
import Navbar from "../components/navbar/navAuth";
import Bg from "../components/background/bg";

import mail from "../assets/icons/mail.png";
import phone from "../assets/icons/phone.png";
import gender from "../assets/icons/gender.png";
import location from "../assets/icons/location.png";

import Book from "../components/card/bookProf";

import { Link } from 'react-router-dom'
import { useQuery } from "react-query";
import { API } from "../config/api.js"
import { useContext } from 'react'
import { UserContext } from "../context/userContext";

export default function Profile() {

  const [state] = useContext(UserContext)

  let {data: profile} = useQuery('profileCache', async () => {
    const response = await API.get(`/profile/` + state?.user.data.id)
    console.log(response.data.data)
    return response.data.data
  })

  return (
    <div>
      <Bg />
      <Navbar />
      <div className={styles.profileContainer}>
        <div className={styles.top}>
          <h1>Profile</h1>
          <div className={styles.profile}>
            <div className={styles.left}>
              <div className={styles.email}>
                <img src={mail} />
                <div className={styles.val}>
                  <h3>{profile?.users.email}</h3>
                  <p>Email</p>
                </div>
              </div>
              <div className={styles.gender}>
                <img src={gender} />
                <div className={styles.val}>
                  <h3>{profile?.gender}</h3>
                  <p>Gender</p>
                </div>
              </div>
              <div className={styles.phone}>
                <img src={phone} />
                <div className={styles.val}>
                  <h3>{profile?.phone}</h3>
                  <p>Phone</p>
                </div>
              </div>
              <div className={styles.location}>
                <img src={location} />
                <div className={styles.val}>
                  <h3>{profile?.address}</h3>
                  <p>Location</p>
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <img src={profile?.image} alt="" />
              <Link to={"/edit-profile/" + state?.user.data.id}><button style={{padding: "10px 60px"}}>Edit Profile</button></Link>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <h1>My Books</h1>
          <div className={styles.bookCon}>
            <Book />
          </div>
        </div>
      </div>
    </div>
  );
}
