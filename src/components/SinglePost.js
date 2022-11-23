import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';
import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { v4 as uuidv4 } from 'uuid';

const SinglePost = ({ postData, userData }) => {
    const user1 = useSelector(state => state.user.userUid)

    const [comment, setComment] = useState('')

    const navigate = useNavigate()

    const location = useLocation();
    const dispatch = useDispatch();

    const [likes, setLikes] = useState(false)
    const [save, setSave] = useState(false)
    const [follow, setFollow] = useState(false)


    const messgeUser = async () => {
        await updateDoc(doc(db, "users", user1), {
            userChats: arrayUnion(postData.uid),
        });
        navigate(`/message/${postData.uid}`, { replace: true });
    }

    const followUser = async () => {
        if (follow == false) {
            await updateDoc(doc(db, "users", user1), {
                following: arrayUnion(postData.uid),
            });

            await updateDoc(doc(db, "users", postData.uid), {
                followers: arrayUnion(user1),
            });
            setFollow(true)
        }

        else {
            await updateDoc(doc(db, "users", user1), {
                following: arrayRemove(postData.uid),
            });

            await updateDoc(doc(db, "users", postData.uid), {
                followers: arrayRemove(user1),
            });
            setFollow(false)
        }

    }


    const addComment = async () => {
        await updateDoc(doc(db, `posts`, postData.postUid), {
            comments: arrayUnion(
                {
                    from: userData[0].name,
                    comment,
                }
            )
        });
        setComment('')
    }

    const updateLikes = async () => {
        if (likes == false) {
            await updateDoc(doc(db, "posts", postData.postUid), {
                likes: arrayUnion(user1)
            });
            setLikes(true)
        }
        else {
            await updateDoc(doc(db, "posts", postData.postUid), {
                likes: arrayRemove(user1)
            });
            setLikes(false)
        }
    }

    const updateSave = async () => {
        if (save == false) {
            await updateDoc(doc(db, "users", user1), {
                saved: arrayUnion(postData.postUid)
            });

            await updateDoc(doc(db, "posts", postData.postUid), {
                saves: arrayUnion(user1)
            });
            setSave(true)
        }
        else {
            await updateDoc(doc(db, "users", user1), {
                saved: arrayRemove(postData.postUid)
            });

            await updateDoc(doc(db, "posts", postData.postUid), {
                saves: arrayRemove(user1)
            });
            setSave(false)
        }
    }

    const deletePost = async () => {
        await deleteDoc(doc(db, `posts`, postData.postUid))
        await updateDoc(doc(db, "users", userData[0].uid), {
            userPosts: arrayRemove(postData.postUid)
        });

    }

    useEffect(() => {
        if (postData.likes.includes(user1)) {
            setLikes(true)
        }
        else {
            setLikes(false)
        }
    }, [])

    useEffect(() => {
        if (postData.saves.includes(user1)) {
            setSave(true)
        }
        else {
            setSave(false)
        }
    }, [])

    useEffect(() => {
        if (userData.length == 1) {
            if (userData[0].following.includes(postData.uid)) {
                setFollow(true)
            }
            else {
                setFollow(false)
            }
        }

    }, [userData])

    return (
        < div className='singlepost_cont'>

            <div className='singlepost_header'>
                <div style={{ display: 'flex', height: '100%', width: '40%', justifyContent: 'space-evenly', alignItems: 'center' }} >
                    <img className='profile_img' src={postData.profileImage} style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/profile/${postData.uid}`, { replace: true })} />
                    <div>{postData.profileName}</div>
                </div>
                <div style={{ display: 'flex', height: '100%', width: '40%', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <div style={{ cursor: 'pointer' }} onClick={followUser}>
                        {
                            user1 != postData.uid ?
                                <div>
                                    {
                                        follow ? <p style={{ color: '#9bc1e4' }}>Unfollow</p> :
                                            <p style={{ color: 'rgb(0, 115, 255)' }}>Follow</p>
                                    }
                                </div> : null
                        }
                    </div>
                    {
                        user1 == postData.uid ?
                            <div onClick={deletePost}>
                                <DeleteIcon />
                            </div> :
                            <div onClick={messgeUser}>
                                <ChatIcon />
                            </div>
                    }

                </div>
            </div>
            <div className='singlepost_img'>
                <img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={postData.postImg} />
            </div>
            <div className='singlepost_footer'>
                <div style={{
                    display: 'flex', height: '25%', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden', marginLeft: '1%',
                    marginRight: '3%'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={updateLikes} >
                        {
                            likes ? <FavoriteIcon style={{ color: 'red' }} /> :
                                <FavoriteBorderIcon />
                        }
                        <p style={{ margin: '5px' }}>{postData.likes.length} likes</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={updateSave}>
                        {
                            save ? <BookmarkIcon /> :
                                <BookmarkBorderIcon />
                        }
                    </div>
                </div>
                <div className='footer_comment_sec'>
                    <div className='comments_box'>
                        {
                            postData.comments.map((comment) => (
                                <div key={uuidv4()} style={{ display: 'flex' }}>
                                    <div style={{ fontWeight: 'bold', margin: '5px' }}>{comment.from}</div>
                                    <div style={{ margin: '5px' }}>{comment.comment}</div>
                                </div>
                            ))
                        }
                    </div>
                    <div className='comments_cont'>
                        <input value={comment} type="text" placeholder="Add a comment..." onChange={(e) => setComment(e.target.value)}></input>
                        <div onClick={addComment}>Post</div>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default SinglePost