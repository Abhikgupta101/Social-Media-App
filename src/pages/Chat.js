import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ShowUsersList from '../components/ShowUsersList';
import { db } from '../Firebase';

const Chat = () => {
    const user1 = localStorage.getItem('userId')
    const [userData, setUserData] = useState([])

    const profile = false;
    const follower = false;

    const navigate = useNavigate()

    const showChatBox = (id) => {
        navigate(`/message/${id}`, { replace: true });
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
        user1 ?
            <div>
                <Navbar />
                {
                    userData.length == 1 ?
                        <div>
                            {
                                userData[0].userChats.length != 0 ?
                                    <div className='users_list'>
                                        <div className='chat_users'>
                                            Chat Users
                                        </div>
                                        {
                                            userData[0].userChats.map((user) => (
                                                <div onClick={() => showChatBox(user)} key={user} style={{ border: '1px solid #1e1e1e' }}>
                                                    <ShowUsersList user={user} profile={profile} follower={follower} />
                                                </div>
                                            ))
                                        }
                                    </div> :
                                    < div style={{ display: 'flex', width: '100%', height: '100%', marginTop: '10vh', justifyContent: 'center' }} >
                                        <p style={{ fontSize: '40px', color: 'blue' }}>No Users To Chat</p>
                                    </div>
                            }
                        </div> : null
                }
            </div > : <Navigate to="/login" />
    )
}

export default Chat