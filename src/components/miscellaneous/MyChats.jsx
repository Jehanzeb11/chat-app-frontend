import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from '../reusables/ChatLoading'
import { getSender } from '../config/ChatLogics'
import GroupChatModel from './GroupChatModel'
import {url} from "../../utils/api" 


const MyChats = () => {
const [loggedUser,setLoggedUser,] = useState()

const {user,selectedChat,setSelectedChat,chats,setChats,fetchAgain} = ChatState()

const toast = useToast()


const fetchChats = async ()=>{
  try {

    const config = {
      headers :{
        Authorization : `Bearer ${user.token}`
      }
    }

const {data} = await axios.get(`${url}/chat`,config)

setChats(data)
    
  } catch (error) {
    toast({
      title: 'Cannot Get Search result Related to your search',
      description:"failed to load chat",
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'bottom-left',
    })
  }
}



useEffect(()=>{
setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
fetchChats()
},[fetchAgain])

  return (
    <Box
    display={{base : selectedChat ? "none" : "flex" , md : "flex"}}
    flexDir={"column"}
    alignItems={"center"}
    p={3}
    bg={"white"}
    w={{base:"100%",md:"30%" , }}
    borderRadius={"lg"}
    borderWidth={"1px"}
    >


<Box width={"100%"} p={3}>

  <Box width={"100%"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>

<Text fontSize={"1.5rem"} fontFamily={"Work Sans"} fontWeight={600}>My Chats</Text> 
<GroupChatModel>
<Button><AddIcon mr={2}/> New Group</Button>  
</GroupChatModel> 

  </Box>

</Box>



<Box width={"100%"} mt={3}>

{
  chats ?(<Stack overflowY={"hidden"}>

    {chats?.map((chat)=>(
      <Box
      onClick={()=>setSelectedChat(chat)}
      bg={selectedChat === chat ? "blue.400" :"blackAlpha.200" }
      color={selectedChat === chat ? "whitesmoke" :"black" }
      p={2}
      cursor={"pointer"}
      borderRadius={"lg"}
      key={chat?._id}
      >
        <Text>{
          !chat?.isGroupChat ? getSender(loggedUser , chat?.users): chat?.chatName
          }</Text>
      </Box>
    ))}
  
  </Stack>) : (<ChatLoading />)
}


</Box>

    </Box>
  )
}

export default MyChats
