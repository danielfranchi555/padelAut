"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export const ButtonLogout = () => {
  const handleLogOut = async () => {
    await signOut({
      redirectTo: "/login",
    });
  };

  return (
    <div>
      <Button onClick={handleLogOut}>Sing Out</Button>
    </div>
  );
};
