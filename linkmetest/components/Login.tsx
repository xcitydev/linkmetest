"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "./ContextProvider";
import { toast } from "sonner";

// Define the validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must not exceed 20 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  async function loginUser(email: string, password: string) {
    try {
    
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Include cookies in the request
      });
      if (!response.ok) {
        toast("Invalid email or password", {
          description: "Please try again",
          duration: 3000,
          position: "bottom-right",
        });
        return;
      }
      toast("Login successful", {
        description: "Please wait while we redirect you ",
        duration: 3000,
        position: "bottom-right",
      });
      const message = await response.json();
      login(message.user?.id);
      router.push("/dashboard");
    } catch (err) {
      console.error("Error during login:", err);
    }
  }

  const onSubmit = (data: any) => {
    loginUser(data.email, data.password);
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left Section */}
      <div className="relative hidden w-1/2 p-8 lg:block">
        <div className="h-full w-full overflow-hidden rounded-[40px] bg-gradient-to-b from-purple-400 via-purple-600 to-black">
          <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold">Xcitydev</h1>
            </div>
            <h2 className="mb-6 text-4xl font-bold">Welcome Back 👋</h2>
            <p className="mb-12 text-lg">Please enter your details to login.</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full items-center justify-center bg-black p-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-[40px] p-12">
          <div className="mx-auto max-w-sm">
            <h2 className="mb-2 text-3xl font-bold text-white">
              Login Account
            </h2>
            <p className="mb-8 text-gray-400">
              Enter your personal data to login.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Input
                  {...register("email")}
                  className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400"
                  placeholder="Enter your email"
                  type="email"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  {...register("password")}
                  className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400"
                  placeholder="Enter your password"
                  type="password"
                />
                <p className="text-sm text-gray-400">
                  Must be at least 8 characters, include uppercase, lowercase,
                  number, and special character.
                </p>
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button className="h-12 w-full bg-white text-black hover:bg-gray-100">
                Log In
              </Button>

              <p className="text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <a href="/signup" className="text-white hover:underline">
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
