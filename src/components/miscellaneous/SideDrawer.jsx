import { BellIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'
import { Avatar, Badge, Box, Button, Divider, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {url} from "../../utils/api"
import SkeletonCmp from '../reusables/SkeletonCmp'
import UserListItem from '../reusables/UserListItem'

const SideDrawer = () => {
  const {user,setSelectedChat,chats,setChats,notifications,setNotifications}= ChatState()

  const [search,setSearch] = useState("")
  const [searchResult,setSearchResult] = useState([])
  const [loading,setLoading] = useState(false)
  const [chatLoading,setChatLoading] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()


const navigate = useNavigate()

  const logout = ()=>{
localStorage.removeItem("userInfo")
navigate("/")
}

const toast = useToast()


const handleSearch = async ()=>{
  if (!search) {
    toast({
      title: 'Cannot Search Empty Input',
      status: 'warning',
      duration: 4000,
      isClosable: true,
      position: 'top-left',
    })
  }

try {
  setLoading(true)

  const config = {
    headers :{
      Authorization : `Bearer ${user.token}`
    }
  }

  const {data} = await axios.get(`${url}/user?search=${search}`,config)

  console.log(data)

  setSearchResult(data)

  setLoading(false)

} catch (error) {
  console.log(error.response.data)
  toast({
    title: 'Cannot Get Search result Related to your search',
    status: 'error',
    duration: 4000,
    isClosable: true,
    position: 'top-left',
  })
}

  }


  
const accessChat = async (userId) =>{
try {

  setChatLoading(true)
  const config = {
    headers :{
      "Content-type":"application/json",
      Authorization : `Bearer ${user.token}`
    }
  }

const {data} = await axios.post(`${url}/chat`,{userId},config)

if (!chats.find((c)=>c._id === data._id)) setChats([data,...chats])

setSelectedChat(data)
setChatLoading(false)
onClose()
} catch (error) {
  console.log(error)
  toast({
    title: 'Cannot Get Search result Related to your search',
    description:error.response.data,
    status: 'error',
    duration: 5000,
    isClosable: true,
    position: 'top-left',
  })
}
}



  return (
    <>
     <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} width={"100%"} bgColor={"whiteAlpha.900"} p={2} borderWidth={"5px"}>
      <Tooltip label="Search user to chat" placeItems={"baseline"} hasArrow >
        <Button variant={"ghost"} onClick={onOpen}>
      <SearchIcon cursor={"pointer"}/>
      <Text hideBelow={"md"} px={3}>Search Usser</Text>
        </Button>
      </Tooltip>


      <Text fontFamily={"Work Sans"} fontSize={"2xl"} fontWeight={400}>Chad Chat</Text>

<Box display={"flex"} justifyContent={"center"} alignItems={"center"}>

      <Menu>
      <MenuButton mr={3} fontSize={"3xl"}><BellIcon />
      <sup>
        {notifications.length > 0 &&
          <Badge color={"whiteAlpha.900"} py={3} px={2} ml={"-3"} borderRadius={"full"} bgColor={"red.500"} fontSize={"lg"}>
{notifications.length}
      </Badge>
      }
      </sup>
      </MenuButton>
      <MenuList pl={3}>
        
        {!notifications.length && "No New Message"}
        {notifications.map((notif)=>(
<MenuItem key={notif._id} onClick={()=>{
  setSelectedChat(notif.chat)
  setNotifications(notifications.filter((n)=>n !== notif))
}}>
  {notif.chat.isGroupChat ? `New Message In ${notif.chat.chatName}` : `new Message From ${notif.sender.name}`}
</MenuItem>
        ))}     
      
      </MenuList>
      </Menu>

      <Menu>
        <MenuButton as={Button}><Avatar name={user.name} cursor={"pointer"} size={"sm"} src={user?.pic}/><ChevronDownIcon mx={1} /> </MenuButton>
        <MenuList>
        <ProfileModal user={user}>
          <MenuItem>Profile</MenuItem>
        </ProfileModal>
        <MenuItem onClick={logout}>Logout</MenuItem>
        </MenuList>
      </Menu>

</Box>
     </Box>





<Drawer placement='left' onClose={onClose} isOpen={isOpen}>
  <DrawerOverlay />
  <DrawerContent>
    <DrawerHeader>Search User</DrawerHeader>
    <DrawerBody >
      <Box display={"flex"}>

<Input placeholder='search by name or email' value={search} onChange={(e)=>setSearch(e.target.value)} mr={2}/>

 <Button onClick={handleSearch}>Go</Button>

      </Box>

<Box>
  {loading ? <SkeletonCmp /> : searchResult?.map((user)=>(
<UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)}/>
  ))}
</Box>

    </DrawerBody>
  </DrawerContent>
</Drawer>

    </>
  )
}

export default SideDrawer
