'use client'
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import {  useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const AddAddress = () => {
    const {data: session, status} = useSession();

    const [ userId, setUserId] = useState< string | undefined>('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [pincode, setPincode] = useState('');
    const [area, setArea] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');

    const onSubmitHandler = async (e: any) => {
        e.preventDefault();
        
      if(status === "authenticated"){
setUserId(session?.user?.id)
    }
        try {
            const res = await fetch("/api/user-addresses",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    fullName,
                    phoneNumber,
                    pincode,
                    area,
                    city,
                    state
                }),
            });
            const data = await res.json();
            console.log(data)
            if(res.ok){
                toast('Address saved');
            }else{
                toast("Error in saving address")
            }
        } catch (error) {
            console.error("Error in sending address from frontend:",error);
        }

    }

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
                <form onSubmit={onSubmitHandler} className="w-full">
                    <p className="text-2xl md:text-3xl ">
                        Add Shipping <span className="font-semibold text-orange-600">Address</span>
                    </p>
                    <div className="space-y-3 max-w-sm mt-10">
                        <input
                            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            name="fullName"
                            placeholder="Full name"
                            onChange={(e) => setFullName(e.target.value)}
                           
                        />
                        <input
                            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone number"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          
                        />
                        <input
                            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            name="pincode"
                            placeholder="Pin code"
                            onChange={(e) => setPincode(e.target.value)}
                        
                        />
                        <textarea
                            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500 resize-none"
                            type= "text"
                            rows={4}
                            name="area"
                            placeholder="Address (Area and Street)"
                            onChange={(e) => setArea(e.target.value)}
                     
                        ></textarea>
                        <div className="flex space-x-3">
                            <input
                                className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                                type="text"
                                name="city"
                                placeholder="City/District/Town"
                                onChange={(e) => setCity(e.target.value)}
                             
                            />
                            <input
                                className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                                type="text"
                                name="state"
                                placeholder="State"
                                onChange={(e) => setState(e.target.value)}
                    
                            />
                        </div>
                    </div>
                    <button type="submit" className="max-w-sm w-full mt-6 bg-orange-600 text-white py-3 hover:bg-orange-700 uppercase">
                        Save address
                    </button>
                </form>
                <Image
                    className="md:mr-16 mt-16 md:mt-0"
                    src={assets.my_location_image}
                    alt="my_location_image"
                />
            </div>
            <Footer />
        </>
    );
};

export default AddAddress;