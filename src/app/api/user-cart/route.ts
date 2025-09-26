import connectDB from "@/config/db";
import { authOptions } from "@/lib/auth";
import Product from "@/models/product.model";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest){

    try {
        const session = await getServerSession(authOptions);

        if(!session?.user?.id){
            return NextResponse.json({
                success: false,
                error: "Unauthorized"
            }, { status: 402})
        }

        await connectDB();
        const { productId } = await req.json();
        //console.log(productId);
        const user = await User.findById(session.user.id);
//console.log("user session:",user)
        if(!user){
            return NextResponse.json({
                success: false,
                error: "User not found"
            }, { status: 402})
        }

        const existingItem = user.cartItems.find((item: any)=>item.productId.toString() === productId);

        //console.log("Existing item",existingItem)
        if(existingItem){
            existingItem.quantity += 1;
        }else{
            user.cartItems.push({ productId, quantity: 1});
        }

      user.markModified('cartItems');

        await user.save();

       // console.log(user.cartItems);
        return NextResponse.json({ success: true, message: "Cart updated" }, { status: 201})
   
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "unable to add items to the cart from the server"
        }, { status: 500})
    }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    await connectDB();

    
    const user = await User.findById(session.user.id).populate({
      path: "cartItems.productId", 
      model: "product",
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    
    const cartWithProducts = user.cartItems.map((item: any) => ({
      _id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      offerPrice: item.productId.offerPrice,
      image: item.productId.image,
      quantity: item.quantity, 
    }));

    return NextResponse.json(
      { success: true, message: "Cart data successfully fetched", cart: cartWithProducts },
      { status: 200 }
    );
  } catch (error) {
    console.error("error in fetching cart data:", error);
    return NextResponse.json(
      { success: false, error: "error in fetching cart products" },
      { status: 500 }
    );
  }
}
