import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { url } from '../../utils/api'



const Login = () => {
  const [show,setShow] = useState(false)
const [loading,setloading] = useState(false)
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const navigate = useNavigate()

const toast = useToast()

const handleSubmit = async (e)=>{
  e.preventDefault()
  
  
    setloading(true)
    if (!email || !password) {
      toast({
        title: 'All Input Fields Are Required',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-center',
      })
  }
  
  
  
  try {
  
    
    const {data} = await axios.post(`${url}/user/login`,{email,password})
  
    toast({
      title: 'User Successfully Logged in',
      status: 'success',
      duration: 4000,
      isClosable: true,
      position: 'top-center',
    })
  
    localStorage.setItem("userInfo",JSON.stringify(data))
    
    
    if (data) {
      navigate("/chats")
    }
  
  } catch (error) {
    console.log(error)
   toast({
      title: 'An Error Occured',
      description:error?.response.data,
      status: 'error',
      duration: 3000,
      isClosable: true,
      position: 'top-center',
    })
  }
  
  
  
  setloading(false)
  }
  return (
    <form onSubmit={handleSubmit}>

    <VStack spacing={"10px"}>
     <FormControl>
      <FormLabel>Email</FormLabel>
      <Input type='email' placeholder='Enter Your Email' border={"1px solid lightgrey"} onChange={(e)=>setEmail(e.target.value)} isRequired/>
     </FormControl>


     <FormControl>
      <FormLabel>Password</FormLabel>
      <InputGroup>
      
      <Input type={show ?"text":'password'} placeholder='Enter Your Password' border={"1px solid lightgrey"} onChange={(e)=>setPassword(e.target.value)} isRequired/>
<InputRightElement width={"4rem"}>
<Button h={"2rem"} mx={1} size={"sm"} onClick={()=>setShow(!show)}>{show ? "Hide":"Show"}</Button>
</InputRightElement>
      </InputGroup>
     </FormControl>



     <Button colorScheme='telegram' isLoading={loading} width={"100%"} borderRadius={"20px"} type='submit' onClick={handleSubmit}>Login</Button>
    
     {/* <Button isLoading={loading} colorScheme='red' width={"100%"} borderRadius={"20px"} type='submit' onClick={handleSubmit}>Become Guest User</Button> */}

    </VStack>
    </form>
  )
}

export default Login
