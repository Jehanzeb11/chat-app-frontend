import { Avatar, Box, Tooltip } from '@chakra-ui/react'
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { ChatState } from '../../context/ChatProvider'

const ScrollableChat = ({messages}) => {

    const {user} = ChatState()


  return (
    <ScrollableFeed className='messages'>
      {messages && messages.map((m,i)=>{
       return (
        <Box display={"flex"} key={m._id}>
            {(isSameSender(messages,m,i,user._id) || isLastMessage(messages,m,i,user._id)) && (
                <Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
                    <Avatar mr={1} cursor={"pointer"} size="sm" name={m.sender.name} src={m.sender.pic} />
                </Tooltip>
            )}

<span style={{backgroundColor : `${m.sender._id === user._id ? "#92E5FE":"#75FD90"}`,borderRadius:"15px", padding:"5px 10px",maxWidth:"75%",marginTop:5,marginLeft:isSameSenderMargin(messages,m,i,user._id)}}>{m.content}</span>

        </Box>
      )})}



    </ScrollableFeed>
  )
}

export default ScrollableChat
