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
callbacks:{
    async jwt({ token, user }: { token: any; user?: any }) {
        if(user){
            token.id = user.id,
            token.role = user.role;
        }
        return token;
    },
    async session({session, token}: {session: any; token?: any}){
        if(session.user){
            session.user.id = token.id as string;
            session.role = token.role;
        }
        return session
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