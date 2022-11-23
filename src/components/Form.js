import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../Firebase'

import Profile from '../assests/Profile.jpg'

const Form = ({ register }) => {

    const userID = localStorage.getItem('userId')

    const [file, setFile] = useState(Profile)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    // const [randomUser, setRandomUser] = useState(false)

    const navigate = useNavigate();

    const createAccount = async () => {
        if (!name || !email || !password) {
            setError('All Fields Are Mandatory')
            return;
        }
        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            const storageRef = ref(storage, `${user.user.uid}/profile`);

            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    switch (snapshot.state) {
                        case 'paused':
                            break;
                        case 'running':
                            break;
                    }
                },
                (error) => {
                    setError(error.message)
                    return;
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        let obj = {
                            name: name,
                            email: email,
                            uid: user.user.uid,
                            photoURL: downloadURL,
                            followers: [],
                            following: [],
                            userChats: [],
                            userPosts: [],
                            saved: [],
                            createdAt: Timestamp.fromDate(new Date()),
                            isOnline: true,


                        }
                        await setDoc(doc(db, "users", user.user.uid), obj)
                    });
                }

            );
        } catch (error) {
            setError(error.message.split(":")[1])
            return;
        }
        if (!error) {
            navigate('/', { replace: true });
        }


    }


    const login = async () => {

        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            await updateDoc(doc(db, "users", user.user.uid), {
                isOnline: true,
            });

        } catch (error) {
            setError(error.message.split(":")[1])
            return;
        }
        if (!error) {
            navigate('/', { replace: true });
        }

    }

    const randomUser = async () => {

        try {
            const user = await signInWithEmailAndPassword(auth, 'shahid@gmail.com', '123456');
            await updateDoc(doc(db, "users", user.user.uid), {
                isOnline: true,
            });

        } catch (error) {
            setError(error.message.split(":")[1])
            return;
        }
        if (!error) {
            navigate('/', { replace: true });
        }
    }


    useEffect(() => {
        const timer = setTimeout(() => {
            setError('')
        }, 2000);
        return () => clearTimeout(timer);
    }, [error]);

    return (
        !userID ?
            <div className='signup_main'>
                {error ?
                    <div style={{ display: 'flex', alignItems: 'center', width: '28rem', height: '3rem', color: 'red', justifyContent: 'center' }}>
                        <div>*{error}</div>
                    </div> : null
                }

                {
                    register ? <h1>Sign Up</h1> : <h1>Log In</h1>
                }

                <div className='signup_cont'>
                    {
                        register ?

                            <input className='signup_input' type="text" placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></input> : null
                    }
                    <input className='signup_input' type="text" placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <input className='signup_input' type="password" placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)}></input>

                    {
                        register ?
                            <div style={{ width: '100%', height: '100%' }}>
                                <input style={{ display: 'none' }} type="file" id="file" accept='image/*' onChange={(e) => setFile(e.target.files[0])}>
                                </input>
                                <label htmlFor="file" className='signup_file_lable'>
                                    Upload Profile Pic
                                </label>


                                <div className='btn' onClick={createAccount}>
                                    Sign Up
                                </div>
                                <div style={{ marginTop: '2%' }}>
                                    Already Have An Account?
                                    <Link to='/login' style={{ color: 'green' }}>
                                        Login
                                    </Link>
                                </div>
                            </div> :
                            <div>
                                <div className='btn' onClick={login}>
                                    Log In
                                </div>
                                <div>
                                    Don't Have An Account?
                                    <Link to='/register' style={{ color: 'green' }}>
                                        Create Account
                                    </Link>
                                </div>
                            </div>
                    }
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '50%', justifyContent: 'space-evenly' }}>
                        <div>
                            OR
                        </div>
                        <div className='btn' style={{ backgroundColor: 'red' }} onClick={randomUser} >
                            Log In As Random User
                        </div>
                    </div>
                </div >

            </div > : <Navigate to="/" />

    )
}

export default Form
