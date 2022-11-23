import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login';
import { useSelector, useDispatch } from "react-redux";
import { setUser } from './store/userSlice';
import { setUserName } from './store/usernameSlice';
import { auth } from './Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import ChatBox from './pages/ChatBox';

export default function App() {
  const userID = localStorage.getItem('userId')

  const dispatch = useDispatch();
  const user = useSelector(state => state.user.userUid)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user.uid))
        localStorage.setItem('userId', user.uid)

      }

    });
  }, [user]);

  window.addEventListener('click', handleWindowResize);
  function handleWindowResize() {
    dispatch(setUserName(''))
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }

  return (
    <BrowserRouter>

      <Routes >
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Feed />} />
        <Route path='/profile/:id' element={<Profile />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/message/:id' element={<ChatBox />} />
        < Route path='/*' element={<Navigate to="/login" />} />
      </Routes >
    </BrowserRouter>
  );
}
