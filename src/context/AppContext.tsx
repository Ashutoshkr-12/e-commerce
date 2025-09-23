"use client";
import { productsDummyData, userDummyData } from "@/assets/assets";
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
  //userData: IUser;
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
  const [admin, setAdmin] = useState(true);
  const [cartItems, setCartItems] = useState<cartItem>({});
  const router = useRouter();
  const currency = process.env.NEXT_CURRENCY!


  const fetchProducts = async () => {
    const res = await fetch('/api/upload',{
      method: "GET"
    })
    const data = await res.json();
    if(data.success){
      setProducts(data.productData);
    }

  };
  const addToCart = async (itemId: string) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Item added to the cart")
  };

const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

    const updateCartQuantity = async (itemId: string, quantity: number) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)

    }

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0) {
        totalAmount += itemInfo!.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };
  // const fetchUserData = async()=>{
  //     setUserData(userDummyData);
  // }

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
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
