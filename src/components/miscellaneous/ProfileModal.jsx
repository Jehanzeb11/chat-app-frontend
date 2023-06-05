import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({user,children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      {
children ? <span onClick={onOpen}>{children}</span>
: 
(
<IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
)
      }


<Modal isOpen={isOpen} onClose={onClose} isCentered size={"lg"}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader textAlign={"center"}>{user.name}</ModalHeader>
    <ModalCloseButton />
    <ModalBody display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
      <Image src={user.pic} width={"70%"} borderRadius={"50%"}/>
      <Text mt={3}>{user.email}</Text>
    </ModalBody>

    <ModalFooter>
      <Button colorScheme='blue' mr={3} onClick={onClose}>
        Close
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </>
  )
}

export default ProfileModal
