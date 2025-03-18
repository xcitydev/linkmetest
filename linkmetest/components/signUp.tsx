"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Define the validation schema
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
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

export default function SignUpPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  async function signupUser(email: string, password: string) {
    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Signup successful:", data);
        toast("Signup successful", {
          description: "Please login to continue",
          duration: 3000,
          position: "bottom-right",
        });
        router.push("/login");
      } else {
        console.error("Signup failed:", data);
        toast("Signup failed", {
          description: `${data.error}`,
          duration: 3000,
          position: "bottom-right",
        });
      }
    } catch (err) {
      console.error("Error during signup:", err);
    }
  }

  const onSubmit = (data: any) => {
    console.log(data);
    signupUser(data.email, data.password);
    // Handle successful sign-up (e.g., API call)
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
            <h2 className="mb-6 text-4xl font-bold">Get Started with Us</h2>
            <p className="mb-12 text-lg">
              Complete these easy steps to register your account.
            </p>

            <div className="w-full max-w-sm space-y-4">
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                    1
                  </span>
                  <span className="text-lg">Sign up your account</span>
                </div>
              </div>
              <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                    2
                  </span>
                  <span className="text-lg">Add a new task</span>
                </div>
              </div>
              <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                    3
                  </span>
                  <span className="text-lg">Complete your task</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full items-center justify-center bg-black p-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-[40px] p-12">
          <div className="mx-auto max-w-sm">
            <h2 className="mb-2 text-3xl font-bold text-white">
              Sign Up Account
            </h2>
            <p className="mb-8 text-gray-400">
              Enter your personal data to create your account.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Input
                    {...register("firstName")}
                    className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400"
                    placeholder="First Name"
                    type="text"
                  />
                  {errors.firstName && (
                    <p className="text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    {...register("lastName")}
                    className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400"
                    placeholder="Last Name"
                    type="text"
                  />
                  {errors.lastName && (
                    <p className="text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  {...register("email")}
                  className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400"
                  placeholder="EXAMPLE@FLOWERSANDSAINTS.COM.AU"
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
                  placeholder="YourBestPassword"
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
                Sign Up
              </Button>

              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <a href="/login" className="text-white hover:underline">
                  Log in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
