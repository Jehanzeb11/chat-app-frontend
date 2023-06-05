import { Spinner } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = () => {
  return (
    <>
      <Spinner
  thickness='5px'
  speed='0.65s'
  emptyColor='gray.200'
  color='blue.500'
  size='xl'
  margin={"auto"}
/>
    </>
  )
}

export default ChatLoading
