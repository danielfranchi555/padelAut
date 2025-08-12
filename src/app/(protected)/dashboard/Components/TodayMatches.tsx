import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchUi } from "@/types/types";
import { Calendar } from "lucide-react";
import React from "react";

interface TodayMatchesProps {
  todayMatches: MatchUi[];
  matches: MatchUi[];
}

export const TodayMatches = ({ matches, todayMatches }: TodayMatchesProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Partidos Hoy</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{todayMatches.length}</div>
        <p className="text-xs text-muted-foreground">
          {matches.filter((m) => m.status === "confirmed").length} confirmados
        </p>
      </CardContent>
    </Card>
  );
};
