import { NextAuthOptions } from "next-auth";
import { CredentialsProvider } from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import Email from "next-auth/providers/email";



export const AuthOptions : NextAuthOptions = {
    providers:[
            CredentialsProvider({
                id:"Credentials",
                name:"Credentials",
                credentials: {
                    Email: { label: "Email", type: "text" },
                    password: { label: "Password", type: "password" }
                  },
                  async authorize(credentials:any):Promise<any>{
                    await dbConnect()
                    try{
                       const user =  await UserModel.findOne({
                            $or:[
                                {email:credentials.identifier.email},
                                {username:credentials.identifier}
                                
                            ]
                        })
                        if(!user){
                            throw new Error('No User found with this email')
                        }
                        if(user.isVerified){
                            throw new Error('No User found with this email')
                        }
                       const isPasswordCorrect= await bcrypt.compare(credentials.password,user.password)
                       if(isPasswordCorrect){
                        return user
                       }
                       else{
                        throw new Error('Incorrect Password')
                       }
                    }
                    catch(error:any){
                        throw new Error(err)
                    }
                  }
            })
    ],
    callbacks:{
        async jwt({ token, user }) {
            if(user){
                token._id=user._id?.toString()
                token.isVerfied=user.isVerified
                token.isAcceptingMessage=user.isAcceptingMessages;
                token.username=user.username
            }
            return token
          },
        async session({ session,  token }) {
            if(token){
                session.user._id=token._id
                session.user.isVerfied= token.isVerified
                session.user.isAcceptingMessage=token.isAcceptingMessages
                session.user.username=token.username
            }
            return session
          },
         
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET,
}