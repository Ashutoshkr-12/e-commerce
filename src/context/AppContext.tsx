"use client";

import { IProduct, UserAddress } from "@/lib/types";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import toast from "react-hot-toast";


interface AppContextType {
  router: ReturnType<typeof useRouter>;
  products: IProduct[];
  currency: string;
  getCartAmount: () => number;
  getCartCount: () => number;
  addToCart:( itemId:string) => void;
  cartItems: cartItem;
  updateCartQuantity: (itemId: string, quantity:number) => void;
  createOrder: (selectedAddress: UserAddress) => void;
}

interface cartItem {
  [key: string]: number;
}


declare global {
  interface Window {
    Razorpay: new (options: any) => {
      open(): void;
      on(event: string, callback: (...args: any[]) => void): void;
    };
  }
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [cartItems, setCartItems] = useState<cartItem>({});
  const router = useRouter();
  const currency = process.env.NEXT_CURRENCY!

//fetch all products
useEffect(()=>{
const fetchProducts = async () => {
    const res = await fetch('/api/upload',{
      method: "GET"
    })
    const data = await res.json();
    if(data.success){
      setProducts(data.productData);
    }
   
  };
  fetchProducts();
},[])

//add product to the cart and fetched also
const addToCart = async (itemId: string) => {
  try {
    const res = await fetch("/api/user-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        productId: itemId,
      }),
    });

    const data = await res.json();

    // Show backend error message
    if (!res.ok || !data.success) {
      toast.error(data.message || "Failed to add item to cart");
      return;
    }

    toast.success(data.message || "Item added to cart");

    // Convert array returned from backend to object
    const updatedCart: cartItem = {};

    data.data.forEach(
      (item: { productId: string; quantity: number }) => {
        updatedCart[item.productId] = item.quantity;
      }
    );

    setCartItems(updatedCart);

  } catch (error) {
    console.error("Add to cart error:", error);

    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

//fetch users cart items by get request
  // useEffect(()=>{
  //   if(!user) return;
  //    const fetchUserCart = async()=>{
  //    try {
  //      const result = await fetch("/api/user-cart",{
  //       method: "GET",
  //      });

  //      const data = await result.json();
  //          if (data.success) {
  //       //console.log("Cart API response:", data.data);

  //       // transform into { productId: quantity }
       
  //     } else {
  //       console.log("Cart API error:", data.error || "unknown");
  //     }
  //    } catch (error) {
  //     console.log('Error in fetching user cart:',error);
  //    }
  //   }

  //   fetchUserCart();
  // },[user])

//count the items from the cart

const getCartCount =  () => {

  //const data = result.json();
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
       // console.log(cartItems)
      }
    }
    return totalCount;
  };

  //add quantity to the product
 const updateCartQuantity = async (itemId: string, quantity: number) => {

  try {
    const cartData = structuredClone(cartItems);
    if (quantity === 0) {
        delete cartData[itemId];
    } else {
        cartData[itemId] = quantity;
    }
    setCartItems(cartData)

    const res = await fetch("/api/user-cart",{
      method:"PATCH",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ productId: itemId, quantity}),
    })

    const data = await res.json();
    if(!res.ok || !data.success){
      console.error("cart Update failed:",data.error)
    }
    
  } catch (error) {
    console.error("Error in updating cart from frontend:",error)
  }

    }

    //calculate price
const getCartAmount = () => {
  let totalAmount = 0;
  for (const items in cartItems) {
    const itemInfo = products.find((product) => product._id === items);
    totalAmount += (itemInfo?.offerPrice || 0) * cartItems[items];
  }
  return Math.floor(totalAmount * 100) / 100;
};
  
const createOrder = async (selectedAddress: UserAddress) => {
  try {
    const createOrderRes = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: selectedAddress,
      }),
    });

    const orderData = await createOrderRes.json();

    if (!orderData.success) {
      toast.error(orderData.message);
      return;
    }

    const options = {
      key: orderData.key,

      amount: orderData.amount,

      currency: orderData.currency,

      name: "Your Store",

      description: "Order Payment",

      order_id: orderData.orderId,

      handler: async (response: any) => {

        const verifyRes = await fetch("/api/payments/verify", {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            address: selectedAddress,

            razorpay_order_id:
              response.razorpay_order_id,

            razorpay_payment_id:
              response.razorpay_payment_id,

            razorpay_signature:
              response.razorpay_signature,

          }),

        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {

          toast.success("Payment Successful");

          router.push("/my-orders");

        } else {

          toast.error("Payment Verification Failed");

        }

      },

      prefill: {
        name: "",
        email: "",
      },

      theme: {
        color: "#F97316",
      },
    };

    const razor = new window.Razorpay(options);

    razor.on("payment.failed", function () {
      toast.error("Payment Failed");
    });

    razor.open();

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};



  const value = {
    createOrder,

    router,
    products,
    updateCartQuantity,
    currency,
    cartItems,
    getCartAmount,
    getCartCount,
    addToCart,
  };

  return ( 
  <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>);
};
