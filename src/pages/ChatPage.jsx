import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../context/ChatProvider'
import SideDrawer from '../components/miscellaneous/SideDrawer'
import ChatBox from '../components/miscellaneous/ChatBox'
import MyChats from '../components/miscellaneous/MyChats'

const ChatPage = () => {

  const {user}= ChatState()


  return (
    <div>
{user && <SideDrawer />}

<Box display={"flex"} justifyContent={"space-between"} p={3} height={"90vh"}>
{user && <MyChats />}
{user && <ChatBox />}
</Box>
    </div>
  )
}

export default ChatPage
