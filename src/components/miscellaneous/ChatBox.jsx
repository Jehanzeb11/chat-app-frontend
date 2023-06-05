import { Box } from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider'
import React from 'react'
import SingleChat from './SingleChat'

const ChatBox = () => {

  const {selectedChat} = ChatState()


  return (
    <Box display={{base : selectedChat ? "flex" : "none" , md : "flex"}}
    flexDir={"column"}
    alignItems={"center"}
    p={3}
    bg={"white"}
    w={{base:"100%",md:"69%" , }}
    borderRadius={"lg"}
    borderWidth={"1px"}
    h={"100%"}
    >

      <SingleChat />
      
    </Box>
  )
}

export default ChatBox
