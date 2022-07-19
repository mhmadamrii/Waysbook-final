import styles from "../../css/auth.module.css";
import {useState, useContext} from 'react'
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { API } from "../../config/api";

export default function Login({ setLogin, setRegister }) {

  let navigate = useNavigate()

  const title = 'Login';
  document.title = 'DumbMerch | ' + title;

  const [state, dispatch] = useContext(UserContext);

  console.log(state)

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const { email, password } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
  
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
  
      const body = JSON.stringify(form);
  
      const response = await API.post('/login', body, config);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data
      })

      setLogin(false)

    } catch (error) {
      console.log(error)
    }
  });

  return (
    <div className={styles.logAnimation}>
      <button onClick={() => setLogin()} className={styles.logModal}></button>
      <div className={styles.login}>
        <h1 className={styles.logTitle}>Login</h1>
        <form onSubmit={(e) => handleSubmit.mutate(e)}>
          <input name="email" onChange={handleChange} type="text" value={email} placeholder="Email" />
          <input name="password" onChange={handleChange} type="password" value={password} placeholder="Password" />
        <button type="submit" className={styles.logButton}>Login</button>
        </form>
        <p>
          Don't have an account? click <button onClick={() => setRegister(true)} className={styles.chBtn} >here</button>
        </p>
      </div>
    </div>
  );
}
