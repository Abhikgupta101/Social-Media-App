import React, { useEffect, useState } from 'react'
import { Avatar, Flex, Text } from "@chakra-ui/react";
import { db } from '../Firebase'
import { v4 as uuidv4 } from 'uuid';
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, Timestamp, where } from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ScrollableFeed from 'react-scrollable-feed'

const ChatBox = () => {
    const { id } = useParams()
    const user1 = localStorage.getItem('userId')

    const [userData, setUserData] = useState([])

    const [msgs, setMsgs] = useState([])
    const [curmsg, setCurmsg] = useState('')

    const Mid = user1 > id ? `${user1 + id}` : `${id + user1}`;

    const navigate = useNavigate()

    const goBack = () => {
        navigate(`/chat`, { replace: true });
    }

    const sendMsg = async () => {
        let uniqueId = uuidv4();
        await setDoc(doc(db, `messages/${Mid}/chat`, uniqueId), {
            message: curmsg,
            messageId: uniqueId,
            createdAt: Timestamp.fromDate(new Date()),
            from: user1,
            to: id
        });
        setCurmsg('')
    }
    const deleteMsg = async (id) => {
        await deleteDoc(doc(db, `messages/${Mid}/chat`, id))
    }

    useEffect(() => {
        const usersRef = collection(db, "users");
        const unsub = onSnapshot(query(usersRef, where("uid", "==", id)), (querySnapshot) => {
            let tempArray = [];
            querySnapshot.forEach((doc) => {
                tempArray.push({ ...doc.data() });
            });
            setUserData([...tempArray]);
        });
        return () => unsub();
    }, [id]);

    useEffect(() => {

        const msgsRef = collection(db, "messages", Mid, "chat");
        const q = query(msgsRef, orderBy("createdAt", "asc"));

        onSnapshot(q, (querySnapshot) => {
            let tempArray = [];
            querySnapshot.forEach((doc) => {
                tempArray.push(doc.data());
            });
            setMsgs([...tempArray]);
        });

    }, [Mid])
    return (
        user1 ? <div>
            {
                userData.length == 1 ?
                    <div className='chatBox'>
                        <div className='go_back' onClick={goBack}>
                            <ArrowBackIcon style={{ fontSize: '30px' }} />
                        </div>
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'white' }}>
                            <img className='profile_img' src={userData[0].photoURL} />
                            <div>{userData[0].name}</div>
                        </div>
                        <div className='messageform'>
                            <ScrollableFeed className='messages_box' forceScroll='true'>
                                {
                                    msgs.map((msginfo) => (
                                        <div key={msginfo.messageId}>
                                            {
                                                msginfo.from == user1 ?
                                                    <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
                                                        <Flex w="100%" justify="flex-end">
                                                            <Flex
                                                                flexDirection="column"
                                                                borderRadius='5'
                                                                borderBottomLeftRadius='0'
                                                                bg="#056162"
                                                                color="white"
                                                                minW="100px"
                                                                maxW="350px"
                                                                my="0"
                                                                p="3"
                                                            >
                                                                <Text fontSize={8} >
                                                                    {msginfo.createdAt.toDate().toDateString()},{msginfo.createdAt.toDate().toTimeString().split(" ")[0]}
                                                                </Text>
                                                                <Text marginTop="0" fontSize={13} >{msginfo.message}
                                                                </Text>
                                                            </Flex>
                                                            <div style={{ alignItems: 'center' }} onClick={() => deleteMsg(msginfo.messageId)}>
                                                                <DeleteIcon style={{ color: 'white' }} />
                                                            </div>
                                                        </Flex>
                                                    </Flex>

                                                    :
                                                    <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
                                                        <Flex w="100%" justify="flex-start">
                                                            <Flex
                                                                flexDirection="column"
                                                                borderRadius='5'
                                                                borderBottomRightRadius='0'
                                                                bg="#262d31"
                                                                color="white"
                                                                minW="100px"
                                                                maxW="350px"
                                                                my="0"
                                                                p="3"
                                                            >
                                                                <Text fontSize={8} >
                                                                    {msginfo.createdAt.toDate().toDateString()},{msginfo.createdAt.toDate().toTimeString().split(" ")[0]}
                                                                </Text>
                                                                <Text marginTop="0" fontSize={13}>{msginfo.message}
                                                                </Text>
                                                            </Flex>
                                                        </Flex>
                                                    </Flex>
                                            }
                                        </div>
                                    ))
                                }
                            </ScrollableFeed>
                            <div className='message_cont'>
                                <input placeholder="Your Message" value={curmsg} onChange={(e) => setCurmsg(e.target.value)}></input>
                                <div onClick={sendMsg}>Send</div>
                            </div>
                        </div >
                    </div> : null
            }
        </div > : <Navigate to="/login" />
    )
}

export default ChatBox