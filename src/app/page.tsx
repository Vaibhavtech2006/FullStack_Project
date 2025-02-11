'use client'

import { useToast } from "@/hooks/use-toast"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import { Axios } from "axios"
import { set } from "mongoose"
import { useSession } from "next-auth/react"
import { use, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"

const page=()=>{
  const [message,setMessage]=useState<Message[]>([])
  const [isLoading,setIsLoading]=useState<boolean>(true)
  const [iswitchLoading,setSwitchLoading]=useState(false)
  const {toast} = useToast()

  const handleDeleteMessage = (messageId:string)=>{
    setMessage(messages.filter((message)=>message._id !== messageId))
  }
  const {data:session}= useSession()

  const form = useForm({
    resolver:zodResolver(acceptMessageSchema)
  })

  const {register,watch,setValue} = form;


  const acceptMessages=watch('acceptMessages')

  const fetchAcceptMessages = useCallback(async ()=>{
    setIsSwitchLoading(true)
    try{
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages',response.data.isAcceptingMessages)
    }
    catch(error){
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title:"Error",
        discription:axiosError.response?.data.message || "failed to fetch message settings",
        variant:"destructive"
      })
    }
    finally(
      setIsLoading(true)
      setIsSwitchLoading(false)
    )

  },[setValue])

  const fetchMessages = useCallback(async(refresh:boolean = false)=>{
    setIsLoading(true)
    setIsSwitchLoading(false)
    try{
      const response =await axios.get<ApiResponse>('/api/get-messages')
      setMessage(response.data.messages || [])
      if(refresh){
        toast({
          title:"Refreshed messages",
          description:"Showing latest messages",
        })
      }
    }
    catch(error){

    }

  },[])
useEffect(()=>{
  if(!session || !sessionStorage.user)return
  fetchMessages()
  fetchAcceptMessage()
  
},[session,setValue,fetchAcceptMessage,fetchMessages])

//handle switch change
const handleSwitchChange = async()=>{
  try{
    await axios.post<ApiResponse>('/api/accept-messages',{
      acceptMessages:!acceptMessages
    })
    setValue('acceptMessages',!acceptMessages)
    toast({
      title:response.data.message,
      variant:'default'
    })
  }catch(error){
    const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title:"Error",
        discription:axiosError.response?.data.message || "failed to fetch message settings",
        variant:"destructive"
      })
    }
  }
}
if(!session || !sessionStorage.user){
  return <div>Please Login</div>
}
  return (
    <div>Dashboard</div>
  )
}

export default page