'use client'
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

const Cart = () => {

  const { products, cartItems, addToCart, updateCartQuantity, getCartCount } = useAppContext()!;
  const router = useRouter();

 // console.log('cartItems are: ', cartItems);
  const cartList = Object.keys(cartItems)
  .map((id)=>{
    const product = products.find((p) => p._id === id);
    if(!product) return null;
    return {
      ...product,
      quantity: cartItems[id],
    };
  }).filter(Boolean);
 // console.log('cart item of user',cartList);

 if(cartList.length === 0){
  return(
          <>
        <Navbar />
        <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
          Your cart is empty.
        </div>
      </>

  )
 }

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl ">
              Your <span className="font-medium text-orange-600">Cart</span>
            </p>
            <p className="text-lg md:text-xl ">{getCartCount()} Items</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="text-nowrap pb-6 md:px-4 px-1  font-medium">
                    Product Details
                  </th>
                  <th className="pb-6 md:px-4 px-1  font-medium">
                    Price
                  </th>
                  <th className="pb-6 md:px-4 px-1  font-medium">
                    Quantity
                  </th>
                  <th className="pb-6 md:px-4 px-1 font-medium">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                
                {cartList.map((item) => (
                    <tr key={item?._id}>
                      <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                        <div>
                          <div className="rounded-lg overflow-hidden bg-white p-2">
                            <Image
                              src={item?.image[0] ?? "/placeholder.png"}
                              alt={String(item?.name)}
                              className="w-20 h-16 object-cover mix-blend-multiply"
                              width={1280}
                              height={720}
                            />
                          </div>
                          <button
                            className="md:hidden text-xs text-orange-600 mt-1"
                            onClick={() => updateCartQuantity(String(item?._id), 0)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-sm hidden md:block">
                          <p className="">{item?.name}</p>
                          <button
                            className="text-xs text-orange-600 mt-1"
                            onClick={() => updateCartQuantity(String(item?._id), 0)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                      <td className="py-4 md:px-4 px-1 ">₹{item?.offerPrice}</td>
                      <td className="py-4 md:px-4 px-1">
                        <div className="flex items-center md:gap-2 gap-1">
                          <button onClick={() => updateCartQuantity(String(item?._id), Number(item?.quantity) - 1)}>
                            <Image
                              src={assets.decrease_arrow}
                              alt="decrease_arrow"
                              className="w-4 h-4"
                            />
                          </button>
                          <input onChange={e => updateCartQuantity(String(item?._id), Number(e.target.value))} type="number" value={item?.quantity} className="w-8 border text-center appearance-none"></input>
                          <button onClick={() => addToCart(String(item?._id))}>
                            <Image
                              src={assets.increase_arrow}
                              alt="increase_arrow"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 md:px-4 px-1">₹{(Number(item?.offerPrice) * Number(item?.quantity)).toFixed(2)}</td>
                    </tr>
                  
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={()=> router.push('/all-products')} className="group flex items-center mt-6 gap-2 text-orange-600">
            <Image
              className="group-hover:-translate-x-1 transition"
              src={assets.arrow_right_icon_colored}
              alt="arrow_right_icon_colored"
            />
            Continue Shopping
          </button>
        </div>
        <OrderSummary />
      </div>
    </>
  );
};

export default Cart;
