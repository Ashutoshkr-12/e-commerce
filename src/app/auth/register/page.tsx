'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const Registerpage = () => {

  const [name, setName] = useState< string >("");
  const [email, setEmail] = useState < string >("");
  const [password, setPassword] = useState < string >("");
  const router = useRouter();
  const [error, setError] = useState('');


  const handleRegister = async(e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
   
  try {
     const res = await fetch('/api/auth/register',{
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,email,password
        })
      });
      
      const data = await res.json();
      if(data.error){
        setError(error);
      }
      if(res.ok && data.success){
      try {
          const loginRes = await signIn("credentials",{
            email,password,redirect: false
          })
          if(!loginRes?.error){
            router.push('/')
          }else{
            console.error('Error in login from frontend:')
          }
      } catch (error) {
        console.error('Error in user login in from frontend');
        setError(String(error))
      }
      }
  } catch (error) {
    console.error('Error in Creating user from frontend:',error);
    alert(error);
  }
  
  }



  return (
    <div className=" bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
   
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
             
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-9">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter you full Name"
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                      onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required   onChange={(e) => setPassword(e.target.value)}/>
                    
                  </div>
                  {error && <p className="text-red-600 font-semibold text-[18px]">{error}</p>}
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?
                <Link href="/auth/login" className="underline underline-offset-4">
                  Sign In
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    </div>
 
  )
}

export default Registerpage;