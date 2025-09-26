"use client";
import { productsDummyData, userDummyData } from "@/assets/assets";
import { IProduct } from "@/lib/types";
import { CloudFog } from "lucide-react";
import { getServerSession } from "next-auth";
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
  

//add product to the cart
 const addToCart = async (itemId: string) => {

  try {
      let cartData = structuredClone(cartItems);
       cartData[itemId] = (cartData[itemId] || 0) + 1;

      const res = await fetch("/api/user-cart",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId: itemId})
      });

      const data = await res.json();
    console.log("add to cart response:",data);
      if(res.ok && data.success){
        toast.success("Item added to the cart")
    // setCartItems(prev => ({
    //   ...prev,
    //   [itemId]: (prev[itemId] || 0) +1
    //  }))
      }else{
        toast.error("Failed to update cart");
      }
      
  } catch (error) {
    console.error("Add to cart error:",error);
      toast.error("Something went wrong");
  }
  };

  //fetch users cart items
  useEffect(()=>{
    if(!user) return;
     const fetchUserCart = async()=>{

     try {
       const result = await fetch("/api/user-cart",{
        method: "GET",
       });
       const data = await result.json();
   console.log("Cart API response:", data);
       if(data.success){
        const cartData: cartItem = {};
        //console.log('rawdata:', data.cart);
       data.cart.forEach((item: any)=>{
          cartData[item.productId] = item.quantity;
          console.log('Cart data:',cartData
          )});
        setCartItems( cartData );
       }
     } catch (error) {
      console.log('Error in fetching user cart:',error);
     }
    }

    fetchUserCart();
  },[user])

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

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)

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



  console.log('cart item user',cartItems)
  const value = {
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
