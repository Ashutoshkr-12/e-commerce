"use client";

import { MoveLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function AboutPage() {
    const router = useRouter();
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
        <MoveLeftIcon size={28} className="border rounded-md" onClick={()=>router.back}/>
      {/* Project Title */}
      <h1 className="text-3xl font-bold ">About Our E-Commerce Project</h1>

      {/* Project Description */}
      <p className="leading-relaxed">
        Welcome to zenotech e-commerce project — a full-stack application designed 
        with using Nextjs framework.
      </p>

      {/* Features */}
      <div>
        <h2 className="text-xl font-semibold  mb-3"> Key Features</h2>
        <ul className="list-disc pl-6  space-y-2">
          <li>User authentication with email/password</li>
          <li>Role-based access (Admin pannel + User accounts)</li>
          <li>Product management with image uploads via Cloudinary</li>
          <li>Shopping cart with real-time updates</li>
          <li>Secure payments integration (future ready)</li>
        </ul>
      </div>

      {/* Tech Stack */}
      <div>
        <h2 className="text-xl font-semibold mb-3"> Tech Stack</h2>
        <ul className="list-disc pl-6  space-y-2">
          <li>
            <strong>Frontend:</strong> Next.js, TailwindCSS, ShadCN UI
          </li>
          <li>
            <strong>Backend:</strong> Next.js
          </li>
          <li>
            <strong>Database:</strong> MongoDB
          </li>
          <li>
            <strong>Authentication:</strong> NextAuth 
          </li>
          <li>
            <strong>Image Hosting:</strong> Cloudinary
          </li>
          <li>
            <strong>Deployment:</strong> Vercel
          </li>
        </ul>
      </div>

    </div>
  );
}
