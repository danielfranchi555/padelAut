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
import { handleSubmitLogin } from "../actions-login";
import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import { ActionStateLogin } from "../../types";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, loginAction, isPending] = useActionState<
    ActionStateLogin,
    FormData
  >(handleSubmitLogin, {
    success: false,
    fieldErrors: {},
    formError: undefined,
    values: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  if (state.success) {
    router.push("/admin"); // o la ruta que quieras
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={loginAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  name="email"
                  defaultValue={String(state?.values?.email ?? "")}
                  required
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
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  defaultValue={String(state?.values?.password ?? "")}
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
                        <p>Logging in...</p>
                        <LoaderCircle className="animate-spin" />
                      </div>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
                {/* <SubmitButton /> */}
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4">
                SignUp
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// function SubmitButton() {
//   const { pending } = useFormStatus();

//   return (
//     <div className=" flex items-center justify-center gap-2 ">
//       <Button
//         disabled={pending}
//         type="submit"
//         className="flex items-center gap-2 w-full"
//       >
//         {pending ? (
//           <div className="flex items-center gap-2">
//             <p>Logging in...</p>
//             <LoaderCircle className="animate-spin" />
//           </div>
//         ) : (
//           "Login"
//         )}
//       </Button>
//     </div>
//   );
// }
