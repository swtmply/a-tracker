"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "@/lib/auth-client";
import { Loader, Shell } from "lucide-react";

export function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });
      toast({
        title: "Check your email",
        description:
          "We sent you a login link. Be sure to check your spam too.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Your sign in request failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "There was an error signing in with Google.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button disabled={isLoading || isGoogleLoading} type="submit">
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading || isGoogleLoading}
        onClick={handleGoogleSignIn}
      >
        {isGoogleLoading ? (
          <Loader className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Shell className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  );
}
