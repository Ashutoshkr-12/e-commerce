import { IOrder } from "@/lib/types";
import { model, models, Schema } from "mongoose";


const myOrderSchema = new Schema<IOrder>({
    userId: { type: Schema.Types.ObjectId, ref: "User",required: true},
    items: [{
        productId: { type: Schema.Types.ObjectId, ref:"product"},
        quantity: { type: Number , required: true}
    }],
    totalAmount: { type: Number, required: true},
    address: {type: Schema.Types.ObjectId, ref: "address", requires: true},
    status: { type: String, enum: ["Placed" , "Delivered" , "Cancelled"],required: true},
    
}, { timestamps: true});

const Order = models.order || model("order",myOrderSchema);

export default Order;