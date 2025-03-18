"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

// Schema for requesting password reset
const requestResetSchema = z.object({
  email: z.string().email("Invalid email format"),
});



export function PasswordReset() {
    const [loading, setLoading] = useState(false);
  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: requestErrors },
  } = useForm({
    resolver: zodResolver(requestResetSchema),
  });

 

  const onRequestReset = async (data: { email: string }) => {
  console.log(data.email)
  setLoading(true)
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/request-password-reset",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({email: data.email}),
        }
      );
      const result = await response.json();
      if (response.ok) {
        toast("Password reset email sent", {
          description: "Please check your email for the reset link",
          duration: 3000,
          position: "bottom-right",
        });
      } else {
        toast("Password reset email failed", {
          description: "Please try again",
          duration: 3000,
          position: "bottom-right",
        });
      }
      console.log("Password Reset Request Response:", result);
      setLoading(false)
      // Handle success or error response
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setLoading(false)
    }
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Settings/>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Password Reset</DialogTitle>
          <DialogDescription>
            This modal will help you reset your password
          </DialogDescription>
        </DialogHeader>

        {/* Form to request password reset */}
        <form
          onSubmit={handleSubmitRequest(onRequestReset)}
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              {...registerRequest("email")}
              className="col-span-3"
            />
            {requestErrors.email && (
              <p className="text-red-500">{requestErrors.email.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "Sending..." : "Send Reset Email"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
