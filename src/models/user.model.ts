import { IUser } from "@/lib/types";
import mongoose, { model, models, Schema } from "mongoose";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  cartItems: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "product", // link to Product schema
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
    },
  ],
});

const User = models.user || model<IUser>("user",userSchema);

export default User;