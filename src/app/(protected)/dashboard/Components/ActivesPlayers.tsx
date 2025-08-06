import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types/types";
import { Users } from "lucide-react";
import React from "react";

interface ActivesPlayersProps {
  players: Player[];
  activePlayersCount: number;
}

export const ActivesPlayers = ({
  activePlayersCount,
  players,
}: ActivesPlayersProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Jugadores Activos</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{activePlayersCount}</div>
        <p className="text-xs text-muted-foreground">
          +
          {
            players.filter(
              (p) =>
                new Date(p.created_at) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length
          }{" "}
          esta semana
        </p>
      </CardContent>
    </Card>
  );
};
