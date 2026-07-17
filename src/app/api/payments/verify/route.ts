import crypto from "crypto";
import connectDB from "@/config/db";
import { authOptions } from "@/lib/auth";
import Order from "@/models/my-order.model";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface CartItemData {
  productId: {
    offerPrice: number;
    id: string;
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
        { status: 401 },
      );
    }

    await connectDB();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      address,
    } = await req.json();

    // Verify Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed",
        },
        { status: 400 },
      );
    }

    // Fetch User Cart
    const user = await User.findById(session.user.id).populate(
      "cartItems.productId",
    );

    if (!user || user.cartItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart is empty",
        },
        { status: 400 },
      );
    }

    const items = user.cartItems.map((item: CartItemData) => ({
      productId: item.productId.id,
      quantity: item.quantity,
    }));

    const totalAmount = user.cartItems.reduce(
      (sum: number, item: CartItemData) =>
        sum + item.productId.offerPrice * item.quantity,
      0,
    );

    const order = await Order.create({
      userId: session.user.id,

      items,

      totalAmount,

      address,

      status: "Placed",

      paymentMethod: "Razorpay",

      paymentStatus: "Paid",

      razorpayOrderId: razorpay_order_id,

      razorpayPaymentId: razorpay_payment_id,

      razorpaySignature: razorpay_signature,
    });

    user.cartItems = [];
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Payment Successful",
      order,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Payment Verification Failed",
      },
      { status: 500 },
    );
  }
}
