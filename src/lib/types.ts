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
    _id?: string;
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
    userId: string;
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

export type IOrder = {
   _id?: string;
    userId: string;
    items?: IOrderItem[];
    amount: number;
    address: UserAddress;
    status?: "Order Placed" | "Order Delivered" | "Order Cancelled"; // Remove question mark
    date: number;

}
