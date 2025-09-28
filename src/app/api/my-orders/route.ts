import connectDB from "@/config/db";
import { authOptions } from "@/lib/auth";
import Order from "@/models/my-order.model";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

//placed orders
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const { address } = await req.json();

    const user = await User.findById(session.user.id).populate(
      "cartItems.productId"
    );
    if (!user || user.cartItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart is empty",
        },
        { status: 400 }
      );
    }

    const items = user.cartItems.map((item: any) => ({
      productId: item.productId.id,
      quantity: item.quantity,
    }));

    const totalAmount = user.cartItems.reduce(
      (sum: number, item: any) =>
        sum + item.productId.offerPrice * item.quantity,
      0
    );

    const newOrder = await Order.create({
      userId: session.user.id,
      items,
      totalAmount,
      address,
      status: "Placed",
    });

    user.cartItems = [];
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({
      success: false,
      error: "Error in creating order from server",
    });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    await connectDB();

    const orders = await Order.find({ userId: session.user.id })
      .populate("items.productId")
      // .populate("address")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: "Orders fetched",
      data: orders,
    });
  } catch (error) {
    console.error("Error in fetching user orders:", error);
    return NextResponse.json({
      success: false,
      error: "Error in fetching users order",
    });
  }
}
