import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types/types";
import { Trophy } from "lucide-react";
import React from "react";

interface AverageLevelProps {
  avgSkillLevel: string;
  players: Player[];
}

export const AverageLevel = ({ avgSkillLevel, players }: AverageLevelProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Nivel Promedio</CardTitle>
        <Trophy className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{avgSkillLevel}</div>
        <p className="text-xs text-muted-foreground">
          Rango: {Math.min(...players.map((p) => p.skill_level))} -{" "}
          {Math.max(...players.map((p) => p.skill_level))}
        </p>
      </CardContent>
    </Card>
  );
};
