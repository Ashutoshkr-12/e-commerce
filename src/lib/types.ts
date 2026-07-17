import { Connection } from "mongoose";

declare global{
    var mongoose:{
        conn: Connection | null;
        promise: Promise<Connection> | null;
    }
}

export type ICart = {
    productId: string;
    quantity: number;
}

export type IUser = {
    id?: string;
    name: string;
    email: string;
    password?: string;
    role: "admin" | "user";
    cartItems: ICart[];
}

export type IProduct = {
    _id?: string ;
    name: string;
    description: string;
    price: number;
    offerPrice: number;
    image: string[];
    category: string;
    date?: Date | number;  
    createdAt?: Date;
    updatedAt?: Date;
}

export type UserAddress = {
    _id?: string;
    userId?: string | null;
    fullName: string;
    phoneNumber: number;
    pincode: string;
    area: string;
    city: string;
    state: string;
}

export type IOrderItem = {
    product: IProduct;
    quantity: number;
}



export interface IOrder {
  _id?: string;

  userId?: string;

  items: {
    productId: string;
    quantity: number;
  }[];

  totalAmount: number;

  address?: string;

  status:
    | "Placed"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled";

  paymentMethod?: "Razorpay" | "COD";

  paymentStatus?: "Pending" | "Paid" | "Failed" | "Refunded";

  razorpayOrderId?: string;

  razorpayPaymentId?: string;

  razorpaySignature?: string;

  createdAt?: Date;

  updatedAt?: Date;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
