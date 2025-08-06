import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TabMatches } from "./TabMatches/TabMatches";
import { TabPlayers } from "./TabPlayers/TabPlayers";
import { TabCreateMatch } from "./TabCreateMatch/TabCreateMatch";

export const TabsContainer = () => {
  return (
    <Tabs defaultValue="matches" className="space-y-6">
      <TabsList>
        <TabsTrigger value="matches">Partidos</TabsTrigger>
        <TabsTrigger value="players">Jugadores</TabsTrigger>
        <TabsTrigger value="create-matches">Crear Partidos asd</TabsTrigger>
      </TabsList>
      <TabMatches />
      <TabPlayers />
      <TabCreateMatch />
    </Tabs>
  );
};
