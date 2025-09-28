import connectDB from "@/config/db"
import User from "@/models/user.model";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'



export const authOptions = {
  providers: [
     CredentialsProvider({

    name: 'Credentials',
   
    credentials: {
      email: { label: "email", type: "email", placeholder: "jsmith@gmail.com" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {

    if(!credentials?.email || !credentials.password){
        throw new Error("Email and password are required")
    }

    try {
        await connectDB();
        const user = await User.findOne({ email: credentials.email})

        if(!user){
            throw new Error("No user found with these credentials")
        };

     const isValid = await bcrypt.compare(credentials.password,user.password)
     if(!isValid){
        throw new Error("Invalid password")
     }

        return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        }
    
    } catch (error) {
        console.error("Authentication Error")
        throw error;
    };
    }
  })
],
 callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.id = (user as any).id;
        token.email = (user as any).email;
        token.role = (user as any).role || "user";
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).email = token.email;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
pages:{
    signIn: '/login',
    error: "/login",
},
 session:{
    strategy: "jwt" as const ,
    maxAge: 30 * 24 *60 *60
 },
 secret: process.env.NEXTAUTH_SECRET,
};