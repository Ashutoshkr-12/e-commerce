import { IOrder } from "@/lib/types";
import { model, models, Schema } from "mongoose";


const myOrderSchema = new Schema<IOrder>({
    userId: { type: Schema.Types.ObjectId, ref: "User",required: true},
    items: [{type: Schema.Types.ObjectId, ref: "Product", required: true}],
    amount: { type: Number, required: true},
    address: {type: Schema.Types.ObjectId, ref: "Addresses", requires: true},
    status: { type: String, enum: ["Order Placed" , "Order Delivered" , "Order Cancelled"],required: true},
    date: {type: Number, required: true}
})

const Order = models.order || model("order",myOrderSchema);

export default Order;