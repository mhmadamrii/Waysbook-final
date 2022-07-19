import styles from "../../css/auth.module.css";
import { useMutation } from 'react-query'
import { API } from '../../config/api'
import {useState} from 'react'

export default function Login({ setLogin, setRegister }) {

  const title = 'Register';
  document.title = 'DumbMerch | ' + title;

  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = form;

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

      const response = await API.post('/register', body, config);
      console.log(response.data)

      setRegister(false)

    } catch (error) {
      console.log(error)
    }
  });


  return (
    <div className={styles.regAnimation}>
      <button onClick={() => setRegister()} className={styles.logModal}></button>
      <div className={styles.register}>
        <h1 className={styles.logTitle}>Register</h1>
        <form onSubmit={(e) => handleSubmit.mutate(e)}>
          <input name="email" onChange={handleChange} type="text" value={email} placeholder="Email" />
          <input name='password' onChange={handleChange} type="password" value={password} placeholder="Password" />
          <input name="name" onChange={handleChange} type="text" value={name} placeholder="Full Name" />
        <button type="submit" className={styles.logButton}>Register</button>
        </form>
        <p>
          Already have an account? click <button onClick={() => {setRegister && setRegister(false)}} className={styles.chBtn}>here</button>
        </p>
      </div>
    </div>
  );
}
