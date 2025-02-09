'use client'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { signIn } from 'next-auth/react' // Import NextAuth signin function
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { signinSchema } from '@/schemas/signinSchema'

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [username, setUsername] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameMessage, setUsernameMessage] = useState('')

  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.email, // Make sure `email` is used correctly
        password: data.password
      })

      if (result?.error) {
        toast({
          title: "Login Failed",
          description: result.error === 'CredentialsSignin' ? "Invalid credentials" : result.error,
          variant: "destructive"
        })
      } else if (result?.url) {
        router.replace("/dashboard")
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
            Join Mystery Message
          </h1>
          <p className='mb-4'>Sign in to continue your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder="Enter your email" {...field} />
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
                    <Input type='password' placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>

        <div className='text-center mt-4'>
          <p>
            New here?{' '}
            <Link href='/auth/sign-up' className='text-blue-800'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
