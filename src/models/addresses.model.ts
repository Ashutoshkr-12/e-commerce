import { UserAddress } from "@/lib/types";
import { model, models, Schema } from "mongoose";


const addresseSchema = new Schema<UserAddress>({
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    fullName: { type: String, required: true},
    phoneNumber: { type: Number, required: true},
    pincode: { type: String, required: true},
    area: { type: String, required: true},
    city: { type: String, required: true},
    state: { type: String, required: true},
})

const Addresses = models.address || model<UserAddress>("address",addresseSchema);

export default Addresses;