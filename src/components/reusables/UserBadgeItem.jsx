import { CloseIcon } from '@chakra-ui/icons'
import { Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user,handleFunction}) => {
  return (
    <Box m={1} display={"flex"} justifyContent={"center"} alignItems={"center"} py={1} px={2} borderRadius={"xl"} backgroundColor={"blueviolet"} color={"whiteAlpha.900"}>
     <Text fontSize={"sm"}> {user.name}</Text> 
      <CloseIcon onClick={handleFunction} ml={2} cursor={"pointer"} color={"whiteAlpha.900"} fontSize={"10px"}/>
    </Box>
  )
}

export default UserBadgeItem
