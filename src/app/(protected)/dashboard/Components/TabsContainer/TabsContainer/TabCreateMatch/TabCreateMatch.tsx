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
import { autoCreateMatches } from "@/actions";
// import { autoCreateMatches } from "@/actions";

export const TabCreateMatch = () => {
  const [startFromDate, setStartFromDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [matchDuration, setMatchDuration] = useState(90);
  const [minStartTime, setMinStartTime] = useState("08:00");
  const [playerCategoryDifference, setplayerCategoryDifference] = useState(1);
  const [creating, setCreating] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  // const [minPlayersPerMatch, setMinPlayersPerMatch] = useState(4);
  // const [creating, setCreating] = useState(false);
  // const [resultMessage, setResultMessage] = useState<string | null>(null);

  // const handleCreateMatches = async () => {
  //   setCreating(true);
  //   setResultMessage(null);

  //   try {
  //     // Llama tu acción server con parámetros personalizados
  //     const createdMatches = await autoCreateMatches({
  //       date: selectedDate,
  //       durationMinutes: matchDuration,
  //       minStartTime, // puedes usar para filtrar slots antes de esa hora
  //       maxLevelDiff: playerCategoryDifference,
  //       minPlayers: minPlayersPerMatch,
  //     });

  //     setResultMessage(`Se crearon ${createdMatches.length} partidos para la fecha ${selectedDate}.`);
  //   } catch (error) {
  //     setResultMessage(`Error al crear partidos: ${error.message || error}`);
  //   } finally {
  //     setCreating(false);
  //   }
  // };

  const handleCreateMatches = async () => {
    setCreating(true);
    setResultMessage(null);
    try {
      const result = await autoCreateMatches({
        startFromdate: startFromDate,
        maxCategoryDiff: playerCategoryDifference,
        minStartTime: minStartTime,
      });
      setResultMessage(`Se crearon ${result.count} partidos.`);
    } catch (err) {
      console.log({ err });
      setResultMessage("Ocurrió un error al crear los partidos.");
    } finally {
      setCreating(false);
    }
  };

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
            <Label htmlFor="match-date">Generar a partir de</Label>
            <Input
              id="match-date"
              type="date"
              value={startFromDate}
              onChange={(e) => setStartFromDate(e.target.value)}
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
              value={playerCategoryDifference}
              onChange={(e) =>
                setplayerCategoryDifference(parseInt(e.target.value, 10))
              }
            />
          </div>

          <Button
            onClick={handleCreateMatches}
            disabled={creating}
            className="w-full"
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            {creating ? "Creando..." : "Crear Partidos Automáticamente"}
          </Button>
          {resultMessage && <p className="text-center mt-4">{resultMessage}</p>}

          {/* {resultMessage && <p className="text-center mt-4">{resultMessage}</p>} */}
        </CardContent>
      </Card>
    </TabsContent>
  );
};
