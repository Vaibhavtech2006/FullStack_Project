import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(AuthOptions);
    if (!session || !session.user) {
        return NextResponse.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            { status: 401 }
        );
    }

    const user: User = session.user;
    const userId = user._id;
    
    try {
        const { acceptMessages } = await request.json();
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to update user status to accept messages",
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to update user status to accept messages:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(AuthOptions);
    if (!session || !session.user) {
        return NextResponse.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            { status: 401 }
        );
    }

    const user: User = session.user;
    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)

    if (!foundUser) {
        return NextResponse.json(
            {
                success: false,
                message: "User not found",
            },
            { status: 404 }
        );
    }
    return Response.json(
        {
            success: true,
            message: "User found",
            isAcceptingMessage: foundUser.isAcceptingMessage,
        },
        { status: 200
        }
    )
    } catch (error) {
        console.error("Failed to update user status to accept messages:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error in getting message acceptance status",
            },
            { status: 500 }
        );
    }
}