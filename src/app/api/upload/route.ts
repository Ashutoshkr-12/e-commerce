import uploadToCloudinary from "@/config/cloudinary";
import connectDB from "@/config/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){

   try {
     
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const offerPrice = Number(formData.get("offerPrice"));
    const category = formData.get("category") as string;
 
   const files = [
    formData.get("photo1") as File,
    formData.get("photo2") as File,
    formData.get("photo3") as File,
    formData.get("photo4") as File,
   ].filter(Boolean);

   if(!name || !description || !price || !offerPrice || !category){
       return NextResponse.json({
           success: false,
           error: "All fields are required"
        }, { status: 400})
   }

    if(!files || files.length === 0){
       return NextResponse.json({
           success: false,
           error: "Images are required"
        }, { status: 400})
    }

    // const uploadedUrls: string[] =[];
      // for( const file of files){
      // try {
      //     const result: any = await uploadToCloudinary(file,"products");
      //     uploadedUrls.push(result.secure_urls)
      //    // console.log(result);
      // } catch (error) {
      //   return NextResponse.json({
      //     success: false,
      //     error: "Error in api products while uploading image"
      //   },{ status: 500})
      // }
      // }
    const uploadPromises = files.map(file => uploadToCloudinary(file,"products"));

    const uploadResults = await Promise.all(uploadPromises);

    const uploadedUrls = uploadResults.map((result: any) => result.secure_url);

    await connectDB();

     const newProduct = await Product.create({
       name,
       description,
       price,
       offerPrice,
       category,
       image: uploadedUrls,
     });
 
     return NextResponse.json({ success: true, data: newProduct });
   } catch (error) {
    console.log("Error in uploading product data from server:",error);
    return NextResponse.json({
        success: false,
        error:"Error in uploading product data"
    },{ status: 500})
   }
    
  }

export async function GET(){

 try {
   await connectDB();
   const productData = await Product.find({}).lean();
   return NextResponse.json({
     success: true,
     message:"Successfully got the product data",
      productData
   }, { status: 201})
 } catch (error) {
  return NextResponse.json({
    success: false,
    error:"Error in fetching product data"
  }, { status: 502})
 }
}