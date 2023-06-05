import React, {  useEffect } from 'react'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import Login from "../components/Auth/Login"
import Register from "../components/Auth/Register"
import { useNavigate } from 'react-router-dom'

const HomePage = () => {


  const navigate = useNavigate()

useEffect(()=>{

  const user = JSON.parse(localStorage.getItem("userInfo"))

if (user) {
 navigate("/chats")
}

},[navigate])



  return (
    <>
      <Container maxW={"xl"} centerContent>
        
        <Box width={"100%"} backgroundColor={"whiteAlpha.800"} textAlign={"center"} p={1} borderRadius={10} my={5}>
          <Text fontFamily={"Work Sans"} fontSize={'4xl'}>Chad Chat</Text>
          </Box>


<Box width={"100%"} backgroundColor={"whiteAlpha.800"} textAlign={"center"} p={5} borderRadius={10} fontFamily={"Work Sans"}>
<Tabs variant='soft-rounded' colorScheme='messenger'>
  <TabList mb={"1"}>
    <Tab width={"50%"}>Login</Tab>
    <Tab width={"50%"}>Register</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login />
    </TabPanel>
    <TabPanel>
      <Register />
    </TabPanel>
  </TabPanels>
</Tabs>

</Box>

      </Container>
    </>
  )
}

export default HomePage
