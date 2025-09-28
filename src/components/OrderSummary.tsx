'use client'
import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { UserAddress } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = () => {

  const {  getCartCount, getCartAmount, createOrder } = useAppContext()!;
  const router = useRouter();
   const [selectedAddress, setSelectedAddress] = useState< UserAddress | undefined>(undefined);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userAddresses, setUserAddresses] = useState<UserAddress[] >([]);

  const fetchUserAddresses = async () => {
    const res = await fetch("/api/user-addresses",{
      method: "GET",
      credentials: "include"
    })

    //console.log('res from the address serverr',res)

    if(!res.ok){
      console.log("Failed to fetch data:",res.status);
    }

    const data = await res.json();
    //console.log('address data:',data)
    if(data.success && Array.isArray(data.data)){
    setUserAddresses(data.data as UserAddress[]);
    }else{
      setUserAddresses([]);
    }
  }

  const handleAddressSelect = (address:  UserAddress) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const handlePlaceOrder = () => {
    if(!selectedAddress){
      toast.error("Select delivery address")
      return;
    }
    createOrder(selectedAddress);

  }

  useEffect(() => {
    fetchUserAddresses();
  }, [])

  //console.log('user address:',userAddresses)
  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium ">
        Order Summary
      </h2>
      <hr className=" my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase  block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2  focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? (`${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`)
                  : "Select Address"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-zinc-900  border shadow-md mt-1 z-10 py-1.5">
                {userAddresses?.map((address, index) =>(
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )} 
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase  block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 border"
            />
            <button className="bg-orange-600  px-9 py-2 hover:bg-orange-700">
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase ">Items {getCartCount()}</p>
            <p className=""> ₹{getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p className="">Shipping Fee</p>
            <p className="font-medium ">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="">Tax (2%)</p>
            <p className="font-medium "> ₹{Math.floor(getCartAmount() * 0.02)}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p> ₹{getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
          </div>
        </div>
      </div>

      <button onClick={handlePlaceOrder} className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700">
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;