import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/home";
import Detail from "./pages/detail";
import Cart from "./pages/cart";
import Profile from "./pages/profile";
import Complain from "./pages/complain"
import AddBook from "./pages/addBook"
import Transaction from "./pages/transaction"
import EditProfile from "./pages/editProfile"
import ComplainAdmin from "./pages/complainAdmin"

import { API, setAuthToken } from "./config/api"
import { useContext, useEffect } from 'react'
import { UserContext } from './context/userContext'
import { useNavigate } from 'react-router-dom'


function App() {

  let navigate = useNavigate();

  const [state, dispatch] = useContext(UserContext);
  console.clear();
  
  console.log(state);

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    if (state.isLogin === false) {
      navigate('/');
    } else {
      if (state.user.status === 'admin') {
        navigate('/complain-admin');
      } else if (state.user.status === 'customer') {
        navigate('/');
      }
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth');

      if (response.status === 404) {
        return dispatch({
          type: 'AUTH_ERROR',
        });
      }

      let payload = response.user;
      payload.token = localStorage.token;

      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.token) {
      checkUser();
    }
  }, []);

  

  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/detail/:id" element={<Detail />}></Route>
      <Route path="/edit-profile/:id" element={<EditProfile/>}></Route>
      <Route path="/cart" element={<Cart />}></Route>
      <Route path="/profile" element={<Profile />}></Route>
      <Route path="/complain" element={<Complain/>}></Route>
      <Route path="/complain-admin" element={<ComplainAdmin/>}></Route>
      <Route path="/add-book" element={<AddBook/>}></Route>
      <Route path="/list-transaction" element={<Transaction/>}></Route>
    </Routes>
  );
}

export default App;
