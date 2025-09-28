"use client";

import { IProduct } from "@/lib/types";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import toast from "react-hot-toast";

interface AppContextType {
  admin: boolean;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  router: ReturnType<typeof useRouter>;
  products: IProduct[];
  currency: string;
  user: {id:string , role: string} | null ;
  getCartAmount: () => number;
  getCartCount: () => number;
  addToCart:( itemId:string) => void;
  cartItems: cartItem;
  updateCartQuantity: (itemId: string, quantity:number) => void;
  createOrder: (selectedAddress: string) => void;
}

interface cartItem {
  [key: string]: number;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [admin, setAdmin] = useState(false);
  const [cartItems, setCartItems] = useState<cartItem>({});
  const [user, setUser] = useState< {id:string; role:string }| null>(null);
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
    let cartData = structuredClone(cartItems);
    cartData[itemId] = (cartData[itemId] || 0) + 1;

    const res = await fetch("/api/user-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ productId: itemId })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      toast.success("Item added to the cart");

      // Update cartItems state
      const updatedCart: cartItem = {};
      data.data.forEach((item: any) => {
        updatedCart[item.productId] = item.quantity; // <-- use productId, not _id
      });

      setCartItems(updatedCart);
    } else {
      toast.error("Failed to update cart");
    }

  } catch (error) {
    console.error("Add to cart error:", error);
    toast.error("Something went wrong");
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
    let cartData = structuredClone(cartItems);
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
  
const createOrder = async (selectedAddress: string) =>{

  try {
    const res = await fetch("/api/my-orders", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({address: selectedAddress}),
    });
    
    const data = await res.json();
    if(data.success){
      toast.success("Order placed successfully!");
      router.push("/my-orders")
    }else {
      toast.error(data.message || "Failed to place order");
    }
    } catch (error) {
      console.error("Checkout error:",error);
      toast.error("Something went wrong");
    }
  };



//fetching current user
useEffect(()=>{
  const fetchUser = async() =>{
    try {
      const res = await fetch("/api/auth/me");
      if(res.ok){
        const data = await res.json();

        setUser((prev)=>{
          if(!prev || prev.id !== data.user.id || prev.role !== data.user.role){
            return {id: data.user.id, role: data.user.role};
          }
          return prev;
        })
       // setUser({ id: data.user.id, role: data.user.role});
        
       setAdmin((prev) => (prev !== (data.user.role === 'admin') ? data.user.role === 'admin' : prev));
        //setAdmin(data.user.role === "admin");
      }
    } catch (error) {
      console.error("Error in fetching user session:",error)
    }
  }
  fetchUser();

},[]);


  const value = {
    createOrder,
    user,
    admin,
    setAdmin,
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
