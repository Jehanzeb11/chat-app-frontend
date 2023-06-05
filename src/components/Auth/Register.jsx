import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { url } from '../../utils/api'
import { useNavigate } from 'react-router-dom'

const Register = () => {

const [show,setShow] = useState(false)
const [loading,setloading] = useState(false)
const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [confirmPass,setConfirmPass] = useState("")
const [pic,setPic] = useState(null)

const toast = useToast()

const navigate = useNavigate()

const postDetails= async (pic)=>{
setloading(true)

if (pic === undefined) {
  toast({
    title: 'Image not Found',
    description: "Please Select an Image",
    status: 'error',
    duration: 3000,
    isClosable: true,
    position: 'top-center',
  })
  return;
}


if (pic.type === "image/jpeg" || pic.type === "image/png" || pic.type === "image/jpg") {
  

try {
  const data = new FormData()

  data.append("file",pic)
  data.append("upload_preset","chat-app")
  data.append("cloud_name","dkjdmewje")

  const res = await axios.post("https://api.cloudinary.com/v1_1/dkjdmewje/image/upload",data)


setPic(res.data.url.toString())
setloading(false)

toast({
  title: 'Image Successfully Uploaded',
  description: res.data.url,
  status: 'success',
  duration: 3000,
  isClosable: true,
  position: 'top-center',
})

console.log(res.data)

} catch (error) {
  console.log(error)
}


}else{
  toast({
    title: 'Please select a right format of Image',
    description: "Please Select an Image",
    status: 'error',
    duration: 3000,
    isClosable: true,
    position: 'top-center',
  })
}


setloading(false)

}






const handleSubmit = async (e)=>{
e.preventDefault()


  setloading(true)
  if (!name || !email || !password || !confirmPass) {
    toast({
      title: 'All Input Fields Are Required',
      status: 'error',
      duration: 3000,
      isClosable: true,
      position: 'top-center',
    })
}

setloading(false)

if (password !== confirmPass) {
  toast({
    title: 'Password and Confirm Password Does Not Match',
    status: 'error',
    duration: 3000,
    isClosable: true,
    position: 'top-center',
  })
}


try {

  
  const {data} = await axios.post(`${url}/user/register`,{name,email,password,pic})

  toast({
    title: 'User Successfully Created',
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
 return toast({
    title: 'An Error Occured',
    description:error.response.data,
    status: 'error',
    duration: 3000,
    isClosable: true,
    position: 'top-center',
  })
}



setloading(false)
}

  return (
    <form>

    <VStack spacing={"10px"}>
     <FormControl>
      <FormLabel>Name</FormLabel>
      <Input placeholder='Enter Your Name' border={"1px solid lightgrey"} onChange={(e)=>setName(e.target.value)} isRequired/>
     </FormControl>

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




     <FormControl>
      <FormLabel>Confirm Password</FormLabel>
      <InputGroup>
      
      <Input type={show ?"text":'password'} placeholder='Enter Your Confirm Password' border={"1px solid lightgrey"} onChange={(e)=>setConfirmPass(e.target.value)} isRequired/>
<InputRightElement width={"4rem"}>
<Button h={"2rem"} mx={1} size={"sm"} onClick={()=>setShow(!show)}>{show ? "Hide":"Show"}</Button>
</InputRightElement>
      </InputGroup>
     </FormControl>


     <FormControl>
      <FormLabel>Profile Picture</FormLabel>
      <Input type='file' accept='image/*' p={1}  onChange={(e)=>postDetails(e.target.files[0])}/>
     </FormControl>




     <Button isLoading={loading} colorScheme='telegram' width={"100%"} borderRadius={"20px"} type='submit' onClick={handleSubmit}>Register</Button>
    </VStack>
    </form>
  )
}

export default Register
