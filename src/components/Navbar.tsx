"use client";
import React from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { ShoppingCart } from "lucide-react";
import { CircleUser, Search } from "lucide-react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { Briefcase } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const { admin, router,user } = useAppContext()!;

 

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 ">
      <Image
        className="cursor-pointer rounded-3xl w-28 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" onClick={()=> router.refresh()} className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/about-us" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/contact" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {admin && (
          <button
            onClick={() => router.push("/admin")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <Search size={24} />

        {user ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <CircleUser />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    className="w-full"
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  >
                    signOut
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Link href="/auth/login">
              <button className="flex items-center gap-2 hover:text-gray-900 transition">
                <CircleUser />
                Account
              </button>
            </Link>
          </>
        )}
        <Link href="/cart" onClick={()=> router.refresh()}  >
          <ShoppingCart />
        </Link>
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {admin && (
          <button
            onClick={() => router.push("/admin")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}

        {user ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <CircleUser />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <Link href="/cart">
                  <DropdownMenuItem>
                    cart
                    <DropdownMenuShortcut>
                      <ShoppingCart size={24} />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Link>
                <Link href="/my-orders">
                  <DropdownMenuItem>
                    my-orders
                    <DropdownMenuShortcut>
                      <Briefcase size={24} />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuItem>
                  <Button
                    className="w-full"
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  >
                    signOut
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <button className="flex items-center gap-2 ">
              <CircleUser />
              Account
            </button>
            /
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
