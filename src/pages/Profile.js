import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import GridOnIcon from '@mui/icons-material/GridOn';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShowUsersList from '../components/ShowUsersList'
import { db } from '../Firebase'
import ClearIcon from '@mui/icons-material/Clear';
import SinglePost from '../components/SinglePost';

const Profile = () => {
  const { id } = useParams()
  const profileId = id
  const user1 = localStorage.getItem('userId')

  const [post, setPost] = useState([])
  const [postInfoId, setPostInfoId] = useState('')
  const [showPostInfo, setShowPostInfo] = useState(false)
  const [userData, setUserData] = useState([])
  const [mainUserData, setMainUserData] = useState([])

  const [showPosts, setShowPosts] = useState(true)
  const [showSavedPosts, setShowSavedPosts] = useState(false)

  const [follower, setFollower] = useState(false)
  const [following, setFollowing] = useState(false)

  const profile = true;

  const navigate = useNavigate()


  const postInfo = (id) => {
    setPostInfoId(id)
    setShowPostInfo(true)
  }

  const showFollowers = () => {
    if (userData[0].followers.length != 0) {
      setFollower(true)
      setFollowing(false)
    }

  }

  const showFollowing = () => {
    if (!userData[0].following.length == 0) {
      setFollowing(true)
      setFollower(false)
    }


  }

  const cancel = () => {
    setFollower(false)
    setFollowing(false)
  }


  useEffect(() => {
    const userRef = collection(db, 'users')
    const unsub = onSnapshot(query(userRef, where("uid", "==", profileId)), (snapshot) => {
      let tempArray = []
      snapshot.docs.forEach((doc) => {
        tempArray.push({ ...doc.data() })
      })

      setUserData([...tempArray])
    })
    return () => {
      unsub();
    }

  }, [profileId])

  useEffect(() => {
    const userRef = collection(db, 'users')
    const unsub = onSnapshot(query(userRef, where("uid", "==", user1)), (snapshot) => {
      let tempArray = []
      snapshot.docs.forEach((doc) => {
        tempArray.push({ ...doc.data() })
      })

      setMainUserData([...tempArray])
    })
    return () => {
      unsub();
    }

  }, [user1])

  useEffect(() => {
    setShowPostInfo(false)
    setShowPosts(true)
    setShowSavedPosts(false)
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

  }, [profileId])

  return (
    user1 ?
      <div>
        {!follower && !following ?
          <div>
            < Navbar />
            {
              userData.length == 1 ?

                <div style={{ display: 'flex', height: '10vh', width: '100%', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '10vh', backgroundColor: 'black', color: 'white', cursor: 'pointer' }}>
                  <img className='profile_img' src={userData[0].photoURL} />
                  <div>{userData[0].name}</div>
                  <div>{userData[0].userPosts.length} Posts</div>
                  <div onClick={showFollowers}>{userData[0].followers.length} Followers</div>
                  <div onClick={showFollowing}>{userData[0].following.length} Following</div>
                </div> : null
            }
            <div className='profile_dashboard'>
              <div onClick={() => {
                setShowPosts(true)
                setShowSavedPosts(false)
              }} style={showPosts ? { color: 'white' } : { color: 'grey' }}>POSTS <GridOnIcon /></div>
              <div onClick={() => {
                setShowPosts(false)
                setShowSavedPosts(true)
              }} style={showSavedPosts ? { color: 'white' } : { color: 'grey' }}
              >SAVED <BookmarkBorderIcon /></div>
            </div>
            {showPosts && userData.length == 1 && post.length != 0 ?
              < div>
                {
                  post.length != 0 && userData[0].userPosts.length != 0 ?
                    < div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', height: '100%', marginTop: '5vh', justifyContent: 'center' }} >
                      {
                        post.map((postData) => (
                          profileId == postData.uid ?
                            <div key={postData.postUid}>
                              <div style={{
                                width: '240px', height: '240px', marginLeft: '1.5px', marginRight: "1.5px", marginTop: '2.5px', overflow: 'hidden'
                              }} onClick={() => postInfo(postData.postUid)}>
                                <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={postData.postImg} />
                              </div>
                              {showPostInfo == true && postInfoId == postData.postUid ?
                                <div className='postInfo'>
                                  <div className='postInfo_cancel_btn' onClick={() => setShowPostInfo(false)}>
                                    <ClearIcon style={{ fontSize: '30px' }} />
                                  </div>
                                  <SinglePost postData={postData} userData={mainUserData} />
                                </div> : null
                              }
                            </div> : null
                        ))
                      }
                    </div> :
                    < div style={{ display: 'flex', width: '100%', height: '100%', marginTop: '5vh', justifyContent: 'center' }} >
                      <p style={{ fontSize: '50px', color: 'white' }}>No Posts Yet</p>
                    </div>
                }
              </div> : null
            }

            {
              showSavedPosts && userData.length == 1 && post.length != 0 ?
                < div>
                  {
                    post.length != 0 && userData[0].saved.length != 0 ?
                      < div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', height: '100%', marginTop: '5vh', justifyContent: 'center' }} >
                        {
                          post.map((postData) => (
                            userData[0].saved.includes(postData.postUid) ?
                              <div key={postData.postUid}>
                                <div style={{
                                  width: '240px', height: '240px', marginLeft: '1.5px', marginRight: "1.5px", marginTop: '2.5px', overflow: 'hidden'
                                }} onClick={() => postInfo(postData.postUid)}>
                                  <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={postData.postImg} />
                                </div>
                                {showPostInfo == true && postInfoId == postData.postUid ?
                                  <div className='postInfo'>
                                    <div className='postInfo_cancel_btn' onClick={() => setShowPostInfo(false)}>
                                      <ClearIcon style={{ fontSize: '30px' }} />
                                    </div>
                                    <SinglePost postData={postData} userData={mainUserData} />
                                  </div> : null
                                }
                              </div> : null
                          ))
                        }
                      </div> :
                      < div style={{ display: 'flex', width: '100%', height: '100%', marginTop: '5vh', justifyContent: 'center' }} >
                        <p style={{ fontSize: '50px', color: 'white' }}>No Saved Posts</p>
                      </div>
                  }
                </div> : null
            }
          </div > :

          (
            follower ?
              <div className='users_list'>
                <div className='cancel_btn' onClick={cancel}>
                  <ClearIcon style={{ fontSize: '30px' }} />
                </div>
                {
                  userData[0].followers.map((user) => (
                    <ShowUsersList key={user} user={user} follower={follower} profile={profile} profileId={profileId} mainUserData={mainUserData} />
                  ))
                }
              </div> :
              <div className='users_list'>
                <div className='cancel_btn' onClick={cancel}>
                  <ClearIcon style={{ fontSize: '30px' }} />
                </div>
                {
                  userData[0].following.map((user) => (
                    < ShowUsersList key={user} user={user} follower={follower} profile={profile} profileId={profileId} mainUserData={mainUserData} />
                  ))
                }
              </div >)}
      </div > : <Navigate to="/login" />
  )
}

export default Profile