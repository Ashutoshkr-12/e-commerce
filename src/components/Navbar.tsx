"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { CircleUser, ShoppingCart, Search, Briefcase } from "lucide-react";
import { assets } from "@/assets/assets";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface UserSession {
  id: string;
  role: string;
}

const Navbar: React.FC = () => {
  const router = useRouter();

  const [user, setUser] = useState<UserSession | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user session from API
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser({ id: data.user.id, role: data.user.role });
          setIsAdmin(data.user.role === "admin");
        }
      }
    } catch (error) {
      console.error("Error fetching user session:", error);
    }
  };

  // Run once on mount
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300">
      {/* Logo */}
      <Image
        src={assets.logo}
        alt="logo"
        className="cursor-pointer rounded-3xl w-28 md:w-32"
        onClick={() => router.push("/")}
      />

      {/* Desktop Links */}
      <div className="hidden lg:flex items-center gap-8">
        <Link href="/">Home</Link>
        <Link href="/all-products" onClick={() => router.refresh()}>Shop</Link>
        <Link href="/about-us">About Us</Link>
        <Link href="/contact">Contact</Link>

        {isAdmin && (
          <button
            className="text-xs border px-4 py-1.5 rounded-full"
            onClick={() => router.push("/admin")}
          >
            Seller Dashboard
          </button>
        )}
      </div>

      {/* Right-side Icons */}
      <ul className="hidden md:flex items-center gap-4">
        <Search size={24} />

        {user ? (
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
                  Sign Out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth/login">
            <button className="flex items-center gap-2 hover:text-gray-900 transition">
              <CircleUser /> Account
            </button>
          </Link>
        )}

        <Link href="/cart" onClick={() => router.refresh()}>
          <ShoppingCart />
        </Link>
      </ul>

      {/* Mobile Menu */}
      <div className="flex items-center md:hidden gap-3">
        {isAdmin && (
          <button
            className="text-xs border px-4 py-1.5 rounded-full"
            onClick={() => router.push("/admin")}
          >
            Seller Dashboard
          </button>
        )}

        {user ? (
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
                  Cart
                  <DropdownMenuShortcut>
                    <ShoppingCart size={24} />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>

              <Link href="/my-orders">
                <DropdownMenuItem>
                  My Orders
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
                  Sign Out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth/login">
            <button className="flex items-center gap-2">
              <CircleUser /> Account
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
