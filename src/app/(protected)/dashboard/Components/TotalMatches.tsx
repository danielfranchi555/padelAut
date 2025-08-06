import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Match } from "@/types/types";
import { CalendarPlus } from "lucide-react";
import React from "react";

interface TotalMatchesProps {
  matches: Match[];
}

export const TotalMatches = ({ matches }: TotalMatchesProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Partidos</CardTitle>
        <CalendarPlus className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{matches.length}</div>
        <p className="text-xs text-muted-foreground">
          {matches.filter((m) => m.status === "completed").length} completados
        </p>
      </CardContent>
    </Card>
  );
};
