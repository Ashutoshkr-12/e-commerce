import connectDB from "@/config/db";
import { authOptions } from "@/lib/auth";
import Addresses from "@/models/addresses.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){

    try {
        
        const {  userId, fullName, phoneNumber, pincode, area, city, state} = await req.json();
        
    
        if(!userId || !fullName || !phoneNumber || !pincode || !area || !city || !state){
            return NextResponse.json({
                success: false,
                error: "All fields are required"
            }, { status: 402})
        }
    
        await connectDB();
    
        const address = Addresses.create({
            userId, fullName, phoneNumber, pincode, area, city, state
        })
    
        return NextResponse.json({
            success: true,
            message: "address added",
            address
        },{ status: 200})
    } catch (error) {
        console.error("error in saving address from server:",error);
       return NextResponse.json({
            success: false,
            error: "Error in adding user address from server"
        },{ status: 500});
    }
}

export async function GET(){

    try {
        const { data: session} = await getServerSession(authOptions);

        if(!session || !session.user.id){
            return NextResponse.json({
                success: false,
                error: "Please login before placing order"
            }, { status: 404})
        };

        await connectDB();
        const address = await Addresses.find({userId: session.user.id}).lean()
    
        return NextResponse.json({
            success: true,
            message:"Data fetched",
            address
        },{ status: 200})
    
    } catch (error) {
        console.error("Error in fetching addresses:",error)
         return NextResponse.json({
            success: false,
            error:"Data fetched",
            
        },{ status: 500})
    }
}