import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import axios from 'axios'
import {url} from "../../utils/api" 
import ChatLoading from '../reusables/ChatLoading'
import UserListItem from "../reusables/UserListItem"
import UserBadgeItem from '../reusables/UserBadgeItem'


const GroupChatModel = ({children}) => {
    const [selectedUsers,setSelectedUsers] = useState([])
    const [groupChatName,setGroupChatName] = useState('')
    const [search,setSearch] = useState('')
    const [searchResult,setSearchResult] = useState([])
    const [loading,setLoading] = useState(false)



    const { isOpen, onOpen, onClose } = useDisclosure()

    const {user,chats,setChats} = ChatState()

    const toast = useToast()

const handleSearch = async (query)=>{
if (!query) {
    return;
}


setSearch(query)

try {
    setLoading(true)

    const config = {
        headers :{
          Authorization : `Bearer ${user.token}`
        }
      }


    const {data} = await axios.get(`${url}/user?search=${search}`,config)
setSearchResult(data)
setLoading(false)

} catch (error) {
    toast({
        title: 'Cannot Get Search result Related to your search',
        description:"failed to Get Search Result",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      })
}

}

const handleSubmit = async ()=>{
if (!groupChatName || !selectedUsers) {
  return toast({
    title: 'All fields required',
    status: 'error',
    duration: 5000,
    isClosable: true,
    position: 'top',
  })
}


try {

  const config = {
    headers :{
      Authorization : `Bearer ${user.token}`
    }
  }


  const {data} = await axios.post(`${url}/chat/group`,{
    name:groupChatName,
    users:JSON.stringify(selectedUsers.map((u)=>u._id))
  },config)

  setChats([data,...chats])

  onClose()

  toast({
    title: 'New Group Created',
    status: 'success',
    duration: 5000,
    isClosable: true,
    position: 'top',
  })
  
} catch (error) {
  console.log(error)
  toast({
    title: 'An error accoured',
    description:error.response.data,
    status: 'error',
    duration: 5000,
    isClosable: true,
    position: 'top',
  })
}


}


const handleGroup = (userToAdd)=>{
if (selectedUsers.includes(userToAdd)) {
   return toast({
        title: 'Cannot Get Search result Related to your search',
        description:"User already added",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
}

setSelectedUsers([...selectedUsers,userToAdd])
}



const handleDelete = (delUser)=>{
setSelectedUsers(selectedUsers.filter((e)=>e._id !== delUser._id))
}

    return (
    <>
      <Button onClick={onOpen}>{children}</Button>

<Modal isOpen={isOpen} onClose={onClose} isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader fontFamily={"Work Sans"} fontSize={"2xl"} textAlign={"center"}>Create Group Chat</ModalHeader>
    <ModalCloseButton />
    <ModalBody display={"flex"} justifyContent={"center"} alignItems={"center"} flexDir={"column"} width={"100%"}>
      <FormControl>
        <Input placeholder='Group Name' my={2} onChange={(e)=>setGroupChatName(e.target.value)}/>
      </FormControl>

      <FormControl>
        <Input my={2} placeholder='Add User eg: John Doe , Selmon Bhoi etc' onChange={(e)=>handleSearch(e.target.value)} />
      </FormControl>
<Box display={"flex"}>


{selectedUsers?.map((u)=>(
  <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)}/>
  ))}

  </Box>

{
    loading ? <ChatLoading />
    :
    searchResult?.slice(0,4).map((user)=>(
        <UserListItem user={user} key={user._id} handleFunction={()=>handleGroup(user)}/>
    ))
}


    </ModalBody>

    <ModalFooter>
      <Button colorScheme='blue' mr={2} onClick={handleSubmit}>
        Create
      </Button>


      <Button onClick={onClose}>
        Close
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
      
    </>
  )
}

export default GroupChatModel
