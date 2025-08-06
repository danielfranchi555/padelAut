"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
// import { autoCreateMatches } from "@/actions";

export const TabCreateMatch = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [matchDuration, setMatchDuration] = useState(90);
  const [minStartTime, setMinStartTime] = useState("16:00");
  const [playerLevelDifference, setPlayerLevelDifference] = useState(1);
  const [minPlayersPerMatch, setMinPlayersPerMatch] = useState(4);
  const [creating, setCreating] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  // const handleCreateMatches = async () => {
  //   setCreating(true);
  //   setResultMessage(null);

  //   try {
  //     // Llama tu acción server con parámetros personalizados
  //     const createdMatches = await autoCreateMatches({
  //       date: selectedDate,
  //       durationMinutes: matchDuration,
  //       minStartTime, // puedes usar para filtrar slots antes de esa hora
  //       maxLevelDiff: playerLevelDifference,
  //       minPlayers: minPlayersPerMatch,
  //     });

  //     setResultMessage(`Se crearon ${createdMatches.length} partidos para la fecha ${selectedDate}.`);
  //   } catch (error) {
  //     setResultMessage(`Error al crear partidos: ${error.message || error}`);
  //   } finally {
  //     setCreating(false);
  //   }
  // };

  return (
    <TabsContent value="create-matches">
      <Card>
        <CardHeader>
          <CardTitle>Crear Partidos Automáticamente</CardTitle>
          <CardDescription>
            El sistema emparejará jugadores automáticamente basándose en nivel y
            disponibilidad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="match-date">Fecha del partido</Label>
            <Input
              id="match-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="match-duration">
              Duración del partido (minutos)
            </Label>
            <Input
              id="match-duration"
              type="number"
              min={30}
              max={180}
              step={15}
              value={matchDuration}
              onChange={(e) => setMatchDuration(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-start-time">Hora mínima para crear slots</Label>
            <Input
              id="min-start-time"
              type="time"
              value={minStartTime}
              onChange={(e) => setMinStartTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="player-level-diff">
              Diferencia máxima de nivel entre jugadores
            </Label>
            <Input
              id="player-level-diff"
              type="number"
              min={0}
              max={5}
              value={playerLevelDifference}
              onChange={(e) =>
                setPlayerLevelDifference(parseInt(e.target.value, 10))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-players">
              Número mínimo de jugadores por partido
            </Label>
            <Input
              id="min-players"
              type="number"
              min={2}
              max={10}
              value={minPlayersPerMatch}
              onChange={(e) =>
                setMinPlayersPerMatch(parseInt(e.target.value, 10))
              }
            />
          </div>

          <Button disabled={creating} className="w-full">
            <CalendarPlus className="h-4 w-4 mr-2" />
            {creating
              ? "Creando partidos..."
              : "Crear Partidos Automáticamente"}
          </Button>

          {resultMessage && <p className="text-center mt-4">{resultMessage}</p>}
        </CardContent>
      </Card>
    </TabsContent>
  );
};
