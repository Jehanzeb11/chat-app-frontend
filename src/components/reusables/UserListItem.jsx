import { Avatar, Box, Button, Text } from '@chakra-ui/react'
import React from 'react'

const UserListItem = ({user,handleFunction}) => {
  return (
    <Box display={"flex"} alignItems={"center"} onClick={handleFunction} cursor={"pointer"} color={"blackAlpha.800"} width={"100%"} px={2} py={2} my={2} borderRadius={"lg"} bg={"gray.100"}_hover={{bg:"whitesmoke",color:"blackAlpha.900"}}>
     <Avatar name={user.name} src={user.pic} size={"sm"}/>
     <Box mx={2}>
     <Text fontWeight={600}>{user.name}</Text>
     </Box>
    </Box>
  )
}

export default UserListItem
