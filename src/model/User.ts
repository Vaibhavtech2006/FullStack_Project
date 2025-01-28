import mongoose, { Schema, Document } from "mongoose";

// Define the Message interface
export interface Message extends Document {
    content: string;
    createdAt: Date;
}

// Define the Message schema
const MessageSchema: Schema<Message> = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now, // Use function reference
        },
    },
    { _id: false } // Disable `_id` for subdocuments
);

// Define the User interface
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

// Define the User schema
const UserSchema: Schema<User> = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: [/.+\@.+\..+/, "Please use a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is required"], // Corrected from `match`
        },
        verifyCode: {
            type: String,
            required: [true, "Verify code is required"], // Corrected from `match`
        },
        verifyCodeExpiry: {
            type: Date,
            required: [true, "Verify code expiry is required"], // Corrected from `match`
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isAcceptingMessage: {
            type: Boolean,
            default: true,
        },
        messages: [MessageSchema],
    },
    { timestamps: true } // Adds `createdAt` and `updatedAt` automatically
);

// Ensure no duplicate model creation
const UserModel = 
    (mongoose.models.User as mongoose.Model<User>) || 
    mongoose.model<User>("User", UserSchema);

export default UserModel;
