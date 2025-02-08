import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request){
    await dbConnect()

    const {username,content} = await request.json()
    try{
       const user = await  UserModel.findOne({username})
       if(!user){
              return Response.json(
                {
                     success: false,
                     message: "User not found",
                },
                {status: 404}
              )
       }
       if(!user.isAcceptingMessage){
              return Response.json(
                {
                     success: false,
                     message: "User is not accepting messages",
                },
                {status: 400}
              )
       }

       const newMessage ={content,createdAt:new Date()}
       user.messages.push(newMessage as Message)
       await user.save()

         return Response.json(
              {
                success: true,
                message: "Message sent successfully",
                newMessage
              },
              {status: 200}
         )
}
catch(error){
    console.error("error adding messages",error)
    return Response.json(
        {
            success: false,
            message: "Internal server error",
        },
        {status: 500}
    )
}
}