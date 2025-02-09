'use client'
import { useToast } from '@/hooks/use-toast';
import { useParams, useRouter } from 'next/navigation';
import {  useForm } from 'react-hook-form';
import React from 'react';
import { verifySchema } from '@/schemas/verifySchema';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { FormField, FormItem, FormLabel, FormMessage, FormControl,Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";

const VerifyAccount = () => {
    const router = useRouter();
    const param = useParams<{ username: string }>();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: param.username,
                code: data.code
            });
            toast({
                title: 'Success',
                description: response.data.message
            });
            router.replace('/sign-in');
        } catch (error) {
            console.error("Error signing up", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message || "Something went wrong.";
            toast({
                title: "Signup Failed",
                description: errorMessage,
                variant: "destructive"
            });
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-8'>
                    Verify Your Account
                </h1>
                <p className='mb-4'>Enter the verification code sent to your email</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default VerifyAccount;
