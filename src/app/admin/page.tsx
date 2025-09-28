'use client'
import React, { useState } from "react";
import Image from "next/image";
import { ImagePlus } from 'lucide-react';
import { useRouter } from "next/navigation";

const AddProduct = () => {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Earphone');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [ files, setFiles] = useState<(File | null)[]>([null,null,null,null]);
  const [loading , setLoading] = useState(false);
  const router = useRouter();


 const handleFileChange = (index: number, file: File | null) =>{
  const updatedFiles = [...files];
  updatedFiles[index] = file;
  setFiles(updatedFiles);
 }

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);

   try {
     const formData = new FormData();
 
     files.forEach((file,i)=>{
       if(file){
         formData.append(`photo${i + 1}`,file);
       }
     });
 
    formData.append("name",name)
    formData.append("description",description)
    formData.append("category", category)
    formData.append("price", price)
    formData.append("offerPrice", offerPrice)
    
    const res = await fetch("/api/upload",{
     method:"POST",
     body: formData,
    })

    if(res.ok){
      router.push('/');
    }

    //const data = await res.json();
   // console.log("Uploaded:",data);
   
   } catch (error) {
    console.log("Error in sending data to the api from frontend:",error)
   } finally{
    setLoading(false);
   }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
     
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
{[0, 1, 2, 3].map((index) => (
  <label key={index} htmlFor={`image${index}`} className="cursor-pointer">
    <input
      accept="image/*"
      type="file"
      id={`image${index}`}
      hidden
      onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
    />
    {files[index] ? (
      <Image
        className="max-w-24 cursor-pointer"
        src={URL.createObjectURL(files[index]!)}
        alt={`photo${index + 1}`}
        width={100}
        height={100}
      />
    ) : (
      <div className="w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
        <ImagePlus size={28} />
      </div>
    )}
  </label>
))}

</div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border bg-black"
              onChange={(e) => setCategory(e.target.value)}
              defaultValue={category}
            >
              <option value="Earphone">Earphone</option>
              <option value="Headphone">Headphone</option>
              <option value="Watch">Watch</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop">Laptop</option>
              <option value="Camera">Camera</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>
        {loading ?( <button type="submit" className="px-8 py-2.5 bg-orange-300 text-white font-medium rounded">
          Adding product...
        </button> ): (<button type="submit" className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded">
          Add
        </button>) }
        
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;
