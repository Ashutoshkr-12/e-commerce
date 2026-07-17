import connectDB from "@/config/db";
import { authOptions } from "@/lib/auth";
import razorpay  from "@/config/razorpay";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface CartItemData {
  productId: {
    offerPrice: number;
  };
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

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

    // Calculate total amount from DB
    const totalAmount = user.cartItems.reduce(
      (sum: number, item: CartItemData) =>
        sum + item.productId.offerPrice * item.quantity,
      0
    );

    // Razorpay expects amount in paise
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create payment order",
      },
      { status: 500 }
    );
  }
}