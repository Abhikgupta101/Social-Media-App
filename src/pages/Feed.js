import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar'
import SinglePost from '../components/SinglePost';
import Upload from '../components/Upload'
import Users from '../components/Users';
import { db } from '../Firebase';
const Feed = () => {
    const follow = true;
    const following = false;
    const user1 = localStorage.getItem('userId')
    const [userData, setUserData] = useState([])
    const [usersData, setUsersData] = useState([])
    const [post, setPost] = useState([])

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

    useEffect(() => {
        const colRef = collection(db, 'posts')
        const unsub = onSnapshot(query(colRef, orderBy("postTime", "desc")), (snapshot) => {
            let tempArray = []
            snapshot.docs.forEach((doc) => {
                tempArray.push({ ...doc.data() })
            })

            setPost([...tempArray])
        })
        return () => {
            unsub();
        }

    }, [])

    useEffect(() => {
        const colRef = collection(db, 'users')
        const unsub = onSnapshot(query(colRef), (snapshot) => {
            let tempArray = []
            snapshot.docs.forEach((doc) => {
                tempArray.push({ ...doc.data() })
            })

            setUsersData([...tempArray])
        })
        return () => {
            unsub();
        }

    }, [])

    return (
        user1 ?
            <div>
                <Navbar />
                <div className='feed'>
                    <div className='follow_suggestion'>
                        <div style={{ marginLeft: '5vh', color: 'grey', fontWeight: 'bold' }}>Suggestions For You</div>

                        {
                            usersData.map((user) => (
                                !user.followers.includes(user1) && userData.length == 1 && user1 != user.uid ?
                                    <Users key={user.uid} user={user} /> : null
                            ))
                        }
                    </div>
                    <div className='feed_singlepost'>
                        {
                            userData.length == 1 ?
                                <div>
                                    {
                                        post.map((postData) => (
                                            <SinglePost key={postData.postUid} postData={postData} userData={userData} />
                                        ))
                                    }
                                </div> : null
                        }
                    </div>
                </div>

            </div> : <Navigate to="/login" />
    )
}

export default Feed