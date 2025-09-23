import connectDB from "@/config/db";
import { IUser } from "@/lib/types";
import User from "@/models/user.model";
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
  try {
      const { name, email, password}:IUser = await req.json();
  
      if(!name || !email || !password){
          return NextResponse.json({
              success: false,
              error: "All fields are required"
          },{ status: 400})
      }
  
      await connectDB();
      const existingUser = await User.findOne({ email });
      
      if(existingUser){
          return NextResponse.json({
              success: false,
              message: 'User with this email already exists'
          })
      }
      const hashedPassword = await bcrypt.hash(password,10);
  
      const user = await User.create({
          name,
          email,
          password:hashedPassword,
          role: 'user'
      })
      console.log('user created',user) //TODO: Remove
  
      return NextResponse.json({
          success: true,
          message:"User created",
          user
      },{status: 200})
  } catch (error) {
    console.log('error in user creation:',error) //TODO: Remove
    return NextResponse.json({
        success: false,
        error:" Failed to create User from server:"
    },{ status: 500})
  }
}