import styles from "../css/book.module.css";
import Navbar from "../components/navbar/navAuth";
import Bg from "../components/background/bg";
import attach from "../assets/icons/attachment.png";
import book from "../assets/icons/book.png";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { useContext, useState } from "react";
import { useMutation } from "react-query";
import { API } from "../config/api";

export default function Add() {
  const [state] = useContext(UserContext);

  const title = "Add Book";
  document.title = "Waysbook | " + title;

  let navigate = useNavigate();

  const [form, setForm] = useState({
    gender: "",
    email: "",
    phone: "",
    address: "",
    image:""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.set("gender", form.gender);
      formData.set("email", form.email);
      formData.set("phone", form.phone);
      formData.set("address", form.address);
      formData.set("image", form.cover[0], form.cover[0].name);

      const response = await API.patch("/profile/" + state?.user.data.id, formData, config);
      console.log(response);

      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className={styles.addForm}>
      <Bg />
      <h1 className={styles.abTitle}>Edit profile</h1>
      <form onSubmit={(e) => handleSubmit.mutate(e)}>
        <input
          type="text"
          name="gender"
          onChange={handleChange}
          placeholder="Gender"
        />
        <input
          type="text"
          name="email"
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="text"
          name="phone"
          onChange={handleChange}
          placeholder="Phone"
        />
        <input
          type="text"
          name="address"
          onChange={handleChange}
          placeholder="address"
        />
        <label htmlFor="cover" className={styles.cover}>
          <p>Profile Image</p>
          <img src={attach} alt="" />
          <input
            type="file"
            name="cover"
            onChange={handleChange}
            id="cover"
            hidden
          />
        </label>
        <button type="submit" className={styles.bookBtn}>
          Edit Profile
        </button>
      </form>
      <Navbar />
    </div>
  );
}
