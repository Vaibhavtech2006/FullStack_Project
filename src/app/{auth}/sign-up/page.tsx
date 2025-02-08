'use client'
import React, { use } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState,useEffect } from 'react'
import * as z from "zod"
import Link from 'next/link'
import {useDebounceValue,useDebounceCallback} from 'usehooks-ts'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation';

import { signupSchema } from '@/schemas/signupSchema'
import { set } from 'mongoose'
import axios,{AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader, Loader2 } from 'lucide-react'


const page = () => {
  const [username,setUsername] = useState('')
  const [usernameMessage,setUsernameMessage] = useState('')
  const [isCheckingUsername,setIsCheckingUsername] = useState(false)

  const [isSubmitting,setIssubmitting] = useState(false)

  const debouncedUsername = useDebounceValue(username, 300);

  const {toast} = useToast()
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues:{
      username:'',
      password:'',
      email:''
    }
  })

  useEffect(()=>{
    const checkUsernameUnique = async () => {
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try{
          const response =await axios.get(`/api/check-username-uniqueness?username=${username}`)
            console.log(response.data.message)
            let message = response.data.message
          setUsernameMessage(message)
        }catch(error){
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message || 'An error checking username')
        }
        finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },[debouncedUsername])
  const onSubmit = async (data:z.infer<typeof signupSchema>) => {
    setIssubmitting(true)
    try{
      const response = await axios.post<ApiResponse>('/api/signup',data)
      toast({
        title:'Success',
        description:response.data.message,
      })
      router.replace(`/verify/${username}`)
      setIssubmitting(false)
     
    }catch(error){
      console.error("Error signing up",error)
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message 
      toast({
        title:"SignupFailed",
        description:errorMessage,
        variant:"destructive"
      })
    }finally{
      setIsCheckingUsername(false)

  }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
            Join Mystery Message
          </h1>
          <p className='mb-4'>
            Signup to start your anonymous adventure
          </p>
        </div>
        <Form{...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
          name="username"
          control={form.control}
          
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="username"
                  className="resize-none"
                  {...field}
                  onChange={(e)=>{
                    field.onChange(e)
                    setUsername(e.target.value);
                  }}
                />
                
              </FormControl>
              {isCheckingUsername && <Loader2 className='animate-spin'/>}
              <p className={`text-sm ${usernameMessage ==="Username is unique"?'text-gray-500':'text-red-500'}`}>
                test {usernameMessage}
              </p>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email'
                  placeholder="Email"
                  className="resize-none"
                  {...field}
                 
                />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password'
                  placeholder="Password"
                  className="resize-none"
                  {...field}
                 
                />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {
            isSubmitting?(
              <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait
              </>
            ):('Signup')
          }
        </Button>
          </form>

        </Form>
        <div className='text-center mt-4'>
          <p>
            Already a member?(' ')
            <Link href='/auth/sign-in'  className='text-blue-800'>
             Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
}
export default page;