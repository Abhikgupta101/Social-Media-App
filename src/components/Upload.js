import { arrayUnion, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../Firebase';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const Upload = ({ userData }) => {
    const [loading, setLoading] = useState(0)
    const upload = (file) => {
        if (file == null) {
            return;
        }
        let uid = uuidv4();
        const storageRef = ref(storage, `${userData[0].uid}/post/${uid}`);

        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setLoading(progress + 1)
                switch (snapshot.state) {
                    case 'paused':
                        break;
                    case 'running':
                        break;
                }
            },
            (error) => {
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    let obj = {
                        profileName: userData[0].name,
                        profileImage: userData[0].photoURL,
                        likes: [],
                        comments: [],
                        postImg: downloadURL,
                        post: [],
                        saves: [],
                        uid: userData[0].uid,
                        postUid: uid,
                        postTime: serverTimestamp()


                    }
                    await setDoc(doc(db, "posts", uid), obj)
                    await updateDoc(doc(db, "users", userData[0].uid), {
                        userPosts: arrayUnion(uid)
                    });
                });
                setLoading(0)
            }
        );
    }

    return (
        loading == 0 ?

            < div className='links_icons'>
                <input style={{ display: 'none' }} type="file" id="file" accept='image/*' onChange={(e) => upload(e.target.files[0])}>
                </input>
                <label htmlFor="file" className='links_icons'>
                    <AddPhotoAlternateIcon />
                    <div>Upload</div>
                </label>
            </div > : <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    )
}

export default Upload