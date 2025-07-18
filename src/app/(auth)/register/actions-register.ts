"use server";
import { ActionStateRegister } from "../types";
import { signIn } from "../../../../auth";
import { registerSchema } from "../schema";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function handleSubmitRegister(
  prevState: ActionStateRegister | undefined,
  formData: FormData
): Promise<ActionStateRegister> {
  const formValues = Object.fromEntries(formData) as Record<string, string>;

  const result = registerSchema.safeParse(formValues);
  console.log({ result });

  // 🧪 Si hay errores de validación
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors,
      values: {
        name: formValues.name ?? "",
        email: formValues.email ?? "",
        password: formValues.password ?? "",
      },
    };
  }

  const { email, password, name } = result.data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    return {
      fieldErrors: {},
      formError: "User already exist",
      values: result.data,
    };
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: "/admin",
    });
    return {
      fieldErrors: {},
      formError: "",
      values: { name: "", email: "", password: "" },
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      return {
        fieldErrors: {},
        formError: error.cause?.err?.message,
        values: result.data,
      };
    }
    return {
      fieldErrors: {},
      formError: "error 500",
      values: result.data,
    };
  }
}
