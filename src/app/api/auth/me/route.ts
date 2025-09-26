import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await getServerSession(authOptions);
    //console.log(session);

    if(!session){
        return NextResponse.json({
            success: true,
            error: "Not authorized"
        },{ status: 403})
    }

    return NextResponse.json({
        success: true,
        user:{
            id: session.user.id,
            role: session.user.role,
            email: session.user.email,
        }
    },{ status: 200})
}