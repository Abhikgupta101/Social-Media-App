import { signOut } from 'firebase/auth';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from '../Firebase';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Upload from './Upload';
import Search from './Search';

const Navbar = () => {
    const user1 = localStorage.getItem('userId')
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const userid = useSelector(state => state.user.userUid)
    const userMenu = useSelector(state => state.responsive)
    const [userData, setUserData] = useState([])

    const updateUrl = (id) => {
        navigate(`/${id}`, { replace: true });
    }

    const logout = async () => {
        await updateDoc(doc(db, "users", userid), {
            isOnline: false,
        });
        await signOut(auth);
        localStorage.removeItem('userId')
        navigate('/register', { replace: true });
    }
    useEffect(() => {
        const usersRef = collection(db, "users");
        const unsub = onSnapshot(query(usersRef, where("uid", "==", user1)), (querySnapshot) => {
            let tempArray = [];
            querySnapshot.forEach((doc) => {
                tempArray.push({ ...doc.data() });
            });
            setUserData([...tempArray]);
        });
        return () => unsub();
    }, [user1]);

    return (
        <div className='nav_container'>
            <div className='nav_logo'>
                <div onClick={() => navigate('/', { replace: true })}>beReal</div>
            </div>
            <Search />
            <div className='nav_links'>
                <div onClick={() => updateUrl('')} className='links' >
                    <div className='links_icons'>
                        <HomeIcon />
                        <div>Home</div>
                    </div>
                </div>
                <div onClick={() => updateUrl('chat')} className='links' >
                    <div className='links_icons'>
                        <ChatIcon />
                        <div>Chat</div>
                    </div>
                </div>
                <div onClick={() => navigate(`/profile/${userid}`, { replace: true })} className='links' >
                    <div className='links_icons'>
                        <AccountCircleIcon />
                        <div>Profile</div>
                    </div>
                </div>
                <div className='links' >
                    <div className='links_icons'>
                        <Upload userData={userData} />
                    </div>
                </div>
                <div onClick={logout}>
                    <div className='links_icons'>
                        <LogoutIcon onClick={logout} />
                        <div>Logout</div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Navbar