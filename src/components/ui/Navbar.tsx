"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'

const Navbar = () => {
    const { data: session } = useSession()
    const user: User | undefined = session?.user as User

    return (
        <nav className="p-4 bg-gray-900 text-white flex justify-between items-center shadow-md">
            <a href="#" className="text-xl font-bold">Mystery Message</a>
            {session ? (
                <div className="flex items-center space-x-4">
                    <span className='mr-4'>Welcome, {user?.name || user?.email}</span>
                    <Button className='w-full md:w-auto' onClick={() => signOut()}>Logout</Button>
                </div>
            ) : (
                <Link href="/sign-in" className="w-full md:w-auto"><Button>
                    Login</Button></Link>
            )}
        </nav>
    )
}

export default Navbar
