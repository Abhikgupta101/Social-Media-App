import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../Firebase';
import Users from './Users';
import { useDispatch, useSelector } from 'react-redux';
import { setUserName } from '../store/usernameSlice';

const Search = () => {
    const dispatch = useDispatch();
    const name = useSelector(state => state.username.userName)
    const [usersData, setUsersData] = useState([])

    useEffect(() => {

        const userRef = collection(db, 'users')
        const unsub = onSnapshot(query(userRef), (snapshot) => {
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

    let data = usersData.filter((val) => name == val.name.substring(0, name.length))

    return (
        <div style={{ flex: '0.5' }}>
            <div style={{ display: 'flex' }}>
                <SearchIcon />
                <input style={{ outline: 'none' }} type="text" placeholder='Search' value={name} onChange={(e) =>
                    dispatch(setUserName(e.target.value))
                }
                ></input>
            </div>
            {
                name ?
                    <div className='search_suggestion'>
                        {
                            data.map((user) => (
                                <Users key={user.uid} user={user} />
                            ))
                        }
                        {
                            data.length === 0 ?
                                <div style={{ margin: 'auto' }}>No results found.</div> : null
                        }
                    </div> : null
            }
        </div >
    )
}

export default Search