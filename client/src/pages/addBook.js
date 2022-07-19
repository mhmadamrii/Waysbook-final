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
    title: "",
    pDate: "",
    author: "",
    desc: "",
    pages: "",
    isbn: "",
    promo: "",
    price: "",
    cover: "",
    attachment: "",
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
      formData.set("title", form.title);
      formData.set("publicationdate", form.pDate);
      formData.set("author", form.author);
      formData.set("desc", form.description);
      formData.set("pages", form.pages);
      formData.set("isbn", form.isbn);
      formData.set("promobook", form.promo);
      formData.set("price", form.price);
      formData.set("thumbnail", form.cover[0], form.cover[0].name);
      formData.set(
        "bookattachment",
        form.attachment[0],
        form.attachment[0].name
      );

      const response = await API.post("/book", formData, config);
      console.log(response);

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className={styles.addForm}>
      <Bg />
      <h1 className={styles.abTitle}>Add Book</h1>
      <Link to="/list-transaction" className={styles.lt}>
        List Transaction
      </Link>
      <form onSubmit={(e) => handleSubmit.mutate(e)}>
        <input
          type="text"
          name="title"
          onChange={handleChange}
          placeholder="Title"
        />
        <input
          type="date"
          name="pDate"
          onChange={handleChange}
          placeholder="Publication Date"
        />
        <input
          type="text"
          name="author"
          onChange={handleChange}
          placeholder="Author"
        />
        <input
          type="text"
          name="pages"
          onChange={handleChange}
          placeholder="Pages"
        />
        <input
          type="text"
          name="isbn"
          onChange={handleChange}
          placeholder="ISBN"
        />
        <input
          type="text"
          name="price"
          onChange={handleChange}
          placeholder="Price"
        />
        <textarea name="description" onChange={handleChange}>
          About This Book
        </textarea>
        <div className={styles.selectCon}>
          <h2>Promo:</h2>
          <select name="promo" onChange={handleChange}>
            <option value="" hidden></option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <label htmlFor="cover" className={styles.cover}>
          <p>Attach Book Cover</p>
          <img src={attach} alt="" />
          <input
            type="file"
            name="cover"
            onChange={handleChange}
            id="cover"
            hidden
          />
        </label>
        <label htmlFor="book" className={styles.cover}>
          <p>Attach Book File</p>
          <img src={attach} alt="" />
          <input
            type="file"
            name="attachment"
            onChange={handleChange}
            id="book"
            hidden
          />
        </label>
        <button type="submit" className={styles.bookBtn}>
          Add Book <img src={book} alt="" />
        </button>
      </form>
      <Navbar />
    </div>
  );
}
