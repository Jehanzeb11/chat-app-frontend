import { Box, Button, FormControl, IconButton, Input, Text, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import ProfileModal from "../miscellaneous/ProfileModal"
import {getSender, getSenderFull} from "../config/ChatLogics"
import GroupChatModel from './GroupChatModel'
import UpdateGroupModal from './UpdateGroupModal'
import ChatLoading from '../reusables/ChatLoading'
import { url } from '../../utils/api'
import axios from 'axios'
import ScrollableChat from '../reusables/ScrollableChat'
import io from "socket.io-client"




const ENDPOINT = "https://chad-chat-production.up.railway.app/"

let socket, selectedChatCompare



const SingleChat = () => {
  const {user,selectedChat,setSelectedChat,fetchAgain,setFetchAgain,notifications,setNotifications} = ChatState()

  const [messages,setMessages] = useState([])
  const [loading,setLoading] = useState(false)
  const [newMessage,setNewMessage] = useState()
  const [socketConnected,setSocketConnected] = useState(false)
  const [typing,setTyping] = useState(false)
  const [isTyping,setIsTyping] = useState(false)


const toast = useToast()


useEffect(()=>{
  socket = io(ENDPOINT)
  socket.emit("setup",user)
  socket.on("connected",()=>setSocketConnected(true))
  socket.on("typing",()=>setIsTyping(true))
  socket.on("stop typing",()=>setIsTyping(false))
  },[])



const fetchMessages = async ()=>{
  try {
    const config = {
      headers :{
        Authorization : `Bearer ${user.token}`
      }
    }

setLoading(true)

    const {data} = await axios.get(`${url}/message/${selectedChat._id}`,config)
  
    // console.log(data)
    setMessages(data)
    setLoading(false)
    socket.emit("join chat",selectedChat._id)
    
  } catch (error) {
    toast({
      title: 'An error accoured',
      description:error?.response?.data,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'bottom',
    })
  }
}


useEffect(()=>{
  fetchMessages()

  selectedChatCompare = selectedChat
},[selectedChat])



useEffect(()=>{
  socket.on("message recieved",(newMessageRecieved)=>{
if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
if (!notifications.includes(newMessageRecieved)) {
    setNotifications([newMessageRecieved,...notifications])
    setFetchAgain(!fetchAgain)
}
}else{
  setMessages([...messages,newMessageRecieved])
}
  })
})

console.log(notifications)

const sendMessage = async (e)=>{
  e.preventDefault()
  socket.emit("stop typing",selectedChat._id)
  try {
    setNewMessage("")
    
  const config = {
    headers :{
      Authorization : `Bearer ${user.token}`
    }
  }
  const {data} = await axios.post(`${url}/message`,{
    content:newMessage,
    chatId:selectedChat._id
  },config)


setMessages([...messages,data])
socket.emit("new message",data)


  } catch (error) {
    toast({
      title: 'An error accoured',
      description:error.response.data,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'bottom',
    })
  }
}



const handleTyping = (e)=>{
  setNewMessage(e.target.value)

  if(!socketConnected) return;

  if (!typing) {
    setTyping(true)
    socket.emit("typing",selectedChat._id)
  }
  
  
let lastTyping = new Date().getTime() 
let timer = 3000



setTimeout(() => {
  let afterTyping = new Date().getTime()

  let diff = afterTyping - lastTyping
if (diff >= timer && typing) {
  socket.emit("stop typing",selectedChat._id)
  setTyping(false)
}
}, timer);




}

  return (
    <Box width={"100%"}  borderRadius={"lg"} h={"92%"}>
      {selectedChat ? (
        <>
        <Text fontSize={{base:"30px",md:"35px"}} p={2} w={"100%"} fontFamily={"Work Sans"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
<IconButton display={{base:"flex",md:"none"}} icon={<ArrowBackIcon />}  onClick={()=>setSelectedChat("")}/>

{!selectedChat.isGroupChat ? (
<>
{getSender(user,selectedChat.users)}
        <ProfileModal user={getSenderFull(user,selectedChat.users)} />
</>
):(
    <>{selectedChat.chatName.toUpperCase()}
    
    <UpdateGroupModal fetchMessage={fetchMessages}/>
    
    
    
    </>
)}
        </Text>
        

<Box
display={"flex"}
justifyContent={"flex-end"}
flexDir={"column"}
p={3}
w={"100%"}
bg={"gray.200"}
h={"100%"}
borderRadius={"lg"}
overflowY={"hidden"}
>

{
  loading ? (
<ChatLoading />
  ):(
    <>
 <div className='messages'><ScrollableChat messages={messages}/></div>
    </>
  )
}



<form onSubmit={sendMessage} style={{display:"flex", alignItems:"center",marginTop:"15px"}}>

<FormControl isRequired>
  {/* {typing ? <div>typing...</div>:<></>} */}
  <Input variant={"filled"} placeholder='Enter a Message' value={newMessage} onChange={handleTyping} bg={"gray.300"}/>
</FormControl>

<Button type='submit' p={0} ml={1}><ArrowForwardIcon /></Button>

</form>

</Box>





        </>
      ):(
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} h={"100%"}>
<Text fontSize={"3xl"} fontFamily={"Work Sans"} p={2}>Click On Chat To Start Chatting</Text>
        </Box>
      )
      
      }
    </Box>
  )
}

export default SingleChat
