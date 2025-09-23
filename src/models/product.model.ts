import { IProduct } from "@/lib/types";
import mongoose, { model, models, Schema } from "mongoose";

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: [{ type: String, required: true }], //from cloudinary
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = models.product || model<IProduct>("product", productSchema);

export default Product;
