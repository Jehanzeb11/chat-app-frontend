import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import { ViewIcon } from '@chakra-ui/icons'
import UserBadgeItem from "../reusables/UserBadgeItem"
import axios from 'axios'
import { url } from "../../utils/api"
import ChatLoading from "../reusables/ChatLoading"
import UserListItem from "../reusables/UserListItem"

const UpdateGroupModal = ({fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } = ChatState()


    const [groupChatName, setGroupChatName] = useState("")
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const toast = useToast()

    const handleRename = async () => {
        if (!groupChatName) return;


        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put(`${url}/chat/rename`, {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config)

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: 'Cannot Rename Group',
                description: error.response.data,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top',
            })
        }
    }

    const handleSearch = async (query) => {
        if (!query) {
            return;
        }


        setSearch(query)

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }


            const { data } = await axios.get(`${url}/user?search=${search}`, config)
            setSearchResult(data)
            console.log(data)
            setLoading(false)

        } catch (error) {
            toast({
                title: 'Cannot Get Search result Related to your search',
                description: "failed to Get Search Result",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
        }

    }

    const handleRemove = async (user1) => { 
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
         return toast({
            title: 'Only Admin Can Remove User From Group',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top',
        })
        }


        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }


            const { data } = await axios.put(`${url}/chat/removeUser`, {
                chatId: selectedChat._id, userId: user1._id
            }, config)

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            fetchMessages()
            setLoading(false)
        } catch (error) {
            toast({
                title: 'An Error Occured',
                description:error.response.data,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
        }
    }

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            return toast({
                title: 'User Already Added To The Group',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            return toast({
                title: 'Only Admin Can Add User To The Group',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
        }


        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }


            const { data } = await axios.put(`${url}/chat/addUser`, {
                chatId: selectedChat._id, userId: user1._id
            }, config)

            console.log(data)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Only Admin Can Add User To The Group',
                description:error.response.data,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
        }





    }

    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontFamily={"Work Sans"} fontSize={"3xl"} textAlign={"center"}>{selectedChat.chatName.toUpperCase()}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={"flex"} justifyContent={"center"} alignItems={"center"} flexDir={"column"} width={"100%"}>
                        <Box display={"flex"} flexWrap={"wrap"}  justifyContent={"center"} mb={3}>
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                            ))

                            }
                        </Box>

                        <FormControl display={"flex"} my={2}>
                            <Input placeholder='Rename Group' value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                            <Button colorScheme='blue' ml={2} isLoading={renameLoading} onClick={handleRename}>Update</Button>
                        </FormControl>


                        <FormControl my={2}>
                            <Input placeholder='Add User' onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>

                        {
                            loading ? <ChatLoading /> :
                                searchResult?.map((user) => (
                                    <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                                ))
                        }



                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => handleRemove(user)} >
                            Leave
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
export default UpdateGroupModal
