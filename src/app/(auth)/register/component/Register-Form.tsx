"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState } from "react";
import { ActionStateRegister } from "../../types";
import { handleSubmitRegister } from "../actions-register";
import { LoaderCircle } from "lucide-react";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, registerAction, isPending] = useActionState<
    ActionStateRegister,
    FormData
  >(handleSubmitRegister, {
    fieldErrors: {},
    formError: undefined,
    values: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Enter your email below to register to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={registerAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder=""
                  defaultValue={String(state?.values?.name ?? "")}
                  required
                />
                {state?.fieldErrors?.name && (
                  <p className="text-red-500 text-start text-sm">
                    {state?.fieldErrors?.name}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  defaultValue={String(state?.values?.email ?? "")}
                />
                {state?.fieldErrors?.email && (
                  <p className="text-red-500 text-start text-sm">
                    {state?.fieldErrors?.email}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  defaultValue={String(state?.values?.password ?? "")}
                  required
                />
                {state?.fieldErrors?.password && (
                  <p className="text-red-500 text-start text-sm">
                    {state?.fieldErrors?.password}
                  </p>
                )}

                {state?.formError && (
                  <p className="text-red-500 text-center">{state?.formError}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <div className=" flex items-center justify-center gap-2 ">
                  <Button
                    disabled={isPending}
                    type="submit"
                    className="flex items-center gap-2 w-full"
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <p>SignUp in...</p>
                        <LoaderCircle className="animate-spin" />
                      </div>
                    ) : (
                      "SignUp"
                    )}
                  </Button>
                </div>
                <Button variant="outline" className="w-full">
                  SignUp with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
