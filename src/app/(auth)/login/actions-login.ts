"use server";
import { ActionStateLogin } from "../types";
import { signIn } from "../../../../auth";
import { loginSchema } from "../schema";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function handleSubmitLogin(
  prevState: ActionStateLogin | undefined,
  formData: FormData
): Promise<ActionStateLogin> {
  const formValues = Object.fromEntries(formData) as Record<string, string>;

  const result = loginSchema.safeParse(formValues);

  // 🧪 Si hay errores de validación
  if (!result.success) {
    return {
      success: false,
      fieldErrors: result.error.flatten().fieldErrors,
      values: {
        email: formValues.email ?? "",
        password: formValues.password ?? "",
      },
    };
  }

  const { email, password } = result.data;

  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: "/admin",
    });
    return {
      success: true,
      fieldErrors: {},
      formError: "",
      values: { email: "", password: "" },
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      return {
        success: false,
        fieldErrors: {},
        formError: error.cause?.err?.message,
        values: result.data,
      };
    }
    return {
      success: false,
      fieldErrors: {},
      formError: `${error}`,
      values: result.data,
    };
  }
}
