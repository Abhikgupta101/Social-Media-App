import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase";
const Users = ({ user }) => {

    const user1 = useSelector(state => state.user.userUid)
    const navigate = useNavigate();

    const [isFollowing, setIsFollowing] = useState(false)
    const follow_user = async () => {
        if (!user.followers.includes(user1)) {
            await updateDoc(doc(db, "users", user1), {
                following: arrayUnion(user.uid),
            });
            await updateDoc(doc(db, "users", user.uid), {
                followers: arrayUnion(user1),
            });
            setIsFollowing(true)
        }
        else {
            await updateDoc(doc(db, "users", user1), {
                following: arrayRemove(user.uid),
            });
            await updateDoc(doc(db, "users", user.uid), {
                followers: arrayRemove(user1),
            });
            setIsFollowing(false)
        }
    }

    useEffect(() => {
        if (user.followers.includes(user1)) {
            setIsFollowing(true)
        }
        else {
            setIsFollowing(false)
        }
    }, [])

    return (
        <div style={{
            marginTop: "5px", marginBottom: "5px", display: "flex", width: "100% ", height: "7vh", color: 'white', justifyContent: 'space-around', alignItems: 'center'
        }}>
            <img className='profile_img' src={user.photoURL} style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/profile/${user.uid}`, { replace: true })}
            />
            <div>{user.name}</div>
            {user1 != user.uid ? <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", height: "100%", cursor: 'pointer' }} onClick={follow_user}>
                {
                    isFollowing ? <div style={{ color: '#9bc1e4' }}>Unfollow</div> : <div style={{ color: 'rgb(0, 115, 255)' }}>Follow</div>
                }
            </div> : <div style={{ color: 'black' }}>Follow</div>}
        </div >
    )
}

export default Users