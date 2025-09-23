import { v2 as cloudinary } from 'cloudinary';



    // Configuration
 cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:  process.env.CLOUDINARY_API_SECRET
    });
    

 const uploadToCloudinary = async (files: File, folder = "product") => {
try {
    
        const arrayBuffer = await files.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
    
        return new Promise((resolve,reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder },
                (error,result) => {
                    if(error) reject(error)  
                    else resolve(result);
                }
            );
            stream.end(buffer);
        })
} catch (error) {
    console.error("Error in uploading image to cloudinary:", error);
}
}

    export default uploadToCloudinary;
    
 
  