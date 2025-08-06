import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import Link from "next/link";
import React from "react";

export const Header = () => {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Panel Administrador
              </h1>
              <p className="text-gray-600">PadelClub Pro</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">Dashboard Jugador</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
