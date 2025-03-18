"use client"
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "./ContextProvider";
export default function Hero() {
  const router = useRouter();
  const {user} = useAuth()
  return (
    <section className="container flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32 mx-auto">
      <div className="space-y-4">
        <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
          Todo List App
          <br />
          Xcitydev
        </h1>
        <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Todo List App is a simple and intuitive task management tool that
          helps you stay organized and productive.
        </p>
      </div>
      <div className="flex gap-4">
       
        <Button
        onClick={() => {
            if(user){
                router.push("/dashboard")
            }else{
                router.push("/signup")
            }
        }}
          className="flex items-center gap-2 cursor-pointer text-black px-3 rounded-md bg-white"
        >
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="outline" size="lg">
          Learn More
        </Button>
      </div>
    </section>
  );
}
