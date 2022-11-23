import { arrayRemove, arrayUnion, collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../Firebase'
import { useSelector } from 'react-redux';

const ShowUsersList = ({ user, follower, profile, profileId, mainUserData }) => {
    const [userData, setUserData] = useState([])
    const mainUser = useSelector(state => state.user.userUid)

    const follow_user = async () => {
        if (!mainUserData[0].following.includes(user)) {
            await updateDoc(doc(db, "users", mainUser), {
                following: arrayUnion(user),
            });
            await updateDoc(doc(db, "users", user), {
                followers: arrayUnion(mainUser),
            });
        }
        else {
            await updateDoc(doc(db, "users", mainUser), {
                following: arrayRemove(user),
            });
            await updateDoc(doc(db, "users", user), {
                followers: arrayRemove(mainUser),
            });
        }
    }

    const unfollow_user = async () => {
        await updateDoc(doc(db, "users", mainUser), {
            following: arrayRemove(user),
        });
        await updateDoc(doc(db, "users", user), {
            followers: arrayRemove(mainUser),
        });
    }

    const remove_user = async () => {
        await updateDoc(doc(db, "users", user), {
            following: arrayRemove(mainUser),
        });
        await updateDoc(doc(db, "users", mainUser), {
            followers: arrayRemove(user),
        });
    }


    useEffect(() => {
        const userRef = collection(db, 'users')
        const unsub = onSnapshot(query(userRef, where("uid", "==", user)), (snapshot) => {
            let tempArray = []
            snapshot.docs.forEach((doc) => {
                tempArray.push({ ...doc.data() })
            })

            setUserData([...tempArray])
        })
        return () => {
            unsub();
        }

    }, [user])

    return (
        userData.length == 1 ?
            <div style={{ display: 'flex', height: '10vh', justifyContent: 'space-around', alignItems: 'center', color: 'white' }}>
                <img className='profile_img' src={userData[0].photoURL} />
                <div>{userData[0].name}</div>
                {profile ?
                    <div style={{ cursor: 'pointer' }}>
                        {
                            follower ?
                                <div style={{ color: 'red' }}>
                                    {
                                        mainUser == profileId ? <p onClick={remove_user}>Remove</p> :
                                            mainUser != user ?
                                                <div onClick={follow_user}>
                                                    {mainUserData[0].following.includes(user) ? <p style={{ color: '#9bc1e4' }}>Unfollow</p> : <p style={{ color: 'blue' }}>Follow</p>}
                                                </div> : <p style={{ color: '#090909' }}>Follow</p>
                                    }
                                </div> :
                                <div>
                                    {
                                        mainUser == profileId ? <p style={{ color: '#9bc1e4' }} onClick={unfollow_user}>Unfollow</p> :
                                            mainUser != user ? <div onClick={follow_user}>
                                                {mainUserData[0].following.includes(user) ? <p style={{ color: '#9bc1e4' }}>Unfollow</p> : <p style={{ color: 'blue' }}>Follow</p>}
                                            </div> : <p style={{ color: '#090909' }}>Follow</p>
                                    }
                                </div>
                        }
                    </div> :
                    <div>
                        {
                            userData[0].isOnline ?
                                <div style={{ color: 'green' }}>Online</div> :
                                <div style={{ color: 'red' }}>Offline</div>
                        }
                    </div>
                }
            </div> : null
    )
}

export default ShowUsersList