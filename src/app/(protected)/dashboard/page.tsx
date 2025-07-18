"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Calendar,
  Users,
  Trophy,
  Mail,
  Plus,
  Edit,
  CalendarPlus,
} from "lucide-react";
import type { Player, Match } from "../../../types/types";
import { mockAvailability, mockMatches, mockPlayers } from "@/lib/mockData";
import Link from "next/link";

// interface AdminDashboardProps {
//   players: Player[];
//   matches: Match[];
// }

export default function AdminDashboard() {
  //   players: initialPlayers,
  //   matches: initialMatches,

  const [players, setPlayers] = useState(mockPlayers);
  const [matches, setMatches] = useState(mockMatches);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isCreatingPlayer, setIsCreatingPlayer] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const activePlayersCount = players.filter((p) => p.is_active).length;
  const todayMatches = matches.filter(
    (m) => m.date === new Date().toISOString().split("T")[0]
  );
  const avgSkillLevel =
    players.length > 0
      ? (
          players.reduce((sum, p) => sum + p.skill_level, 0) / players.length
        ).toFixed(1)
      : "0";

  const handleCreatePlayer = (formData: FormData) => {
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      skill_level: Number.parseInt(formData.get("skill_level") as string),
      is_admin: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setPlayers([...players, newPlayer]);
    setIsCreatingPlayer(false);
    alert("Jugador creado correctamente");
  };

  const handleUpdatePlayer = (id: string, formData: FormData) => {
    const updatedPlayers = players.map((player) =>
      player.id === id
        ? {
            ...player,
            name: formData.get("name") as string,
            phone: formData.get("phone") as string,
            skill_level: Number.parseInt(formData.get("skill_level") as string),
            is_active: formData.get("is_active") === "on",
            updated_at: new Date().toISOString(),
          }
        : player
    );

    setPlayers(updatedPlayers);
    setEditingPlayer(null);
    alert("Jugador actualizado correctamente");
  };

  const handleCreateMatches = () => {
    const dayOfWeek = new Date(selectedDate).getDay();

    // Get available players for the selected day
    const availablePlayers = players.filter((player) => {
      if (!player.is_active || player.is_admin) return false;
      return mockAvailability.some(
        (avail) =>
          avail.player_id === player.id && avail.day_of_week === dayOfWeek
      );
    });

    // Simple matching algorithm
    const newMatches = [];
    const usedPlayers = new Set();

    // Sort players by skill level
    const sortedPlayers = availablePlayers.sort(
      (a, b) => a.skill_level - b.skill_level
    );

    for (let i = 0; i < sortedPlayers.length - 3; i++) {
      if (usedPlayers.has(sortedPlayers[i].id)) continue;

      const player1 = sortedPlayers[i];
      const compatiblePlayers = sortedPlayers.filter(
        (p) =>
          !usedPlayers.has(p.id) &&
          p.id !== player1.id &&
          Math.abs(p.skill_level - player1.skill_level) <= 1
      );

      if (compatiblePlayers.length >= 3) {
        const matchPlayers = [player1, ...compatiblePlayers.slice(0, 3)];
        const matchId = `match-${Date.now()}-${newMatches.length}`;

        const newMatch: Match = {
          id: matchId,
          date: selectedDate,
          time: "19:00",
          court_number: newMatches.length + 1,
          status: "scheduled",
          created_by: "admin-1",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          participants: matchPlayers.map((player, index) => ({
            id: `part-${matchId}-${index}`,
            match_id: matchId,
            player_id: player.id,
            team: (index < 2 ? 1 : 2) as 1 | 2,
            confirmed: false,
            created_at: new Date().toISOString(),
            player,
          })),
        };

        matchPlayers.forEach((p) => usedPlayers.add(p.id));
        newMatches.push(newMatch);
      }
    }

    setMatches([...matches, ...newMatches]);
    alert(`Se crearon ${newMatches.length} partidos para el ${selectedDate}`);
  };

  const handleSendNotifications = (matchId: string) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    // Simulate email notification
    const emailContent = {
      subject: `Nuevo partido de pádel - ${match.date}`,
      body: `
        ¡Hola!
        
        Se ha programado un nuevo partido de pádel:
        
        Fecha: ${match.date}
        Hora: ${match.time}
        Pista: ${match.court_number}
        
        Jugadores:
        ${match.participants
          ?.map((p) => `- ${p.player?.name} (Equipo ${p.team})`)
          .join("\n")}
        
        Por favor, confirma tu participación.
        
        ¡Nos vemos en la pista!
      `,
    };

    console.log("Email notifications would be sent:", emailContent);
    alert("Notificaciones enviadas correctamente");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      scheduled: "outline",
      confirmed: "default",
      cancelled: "destructive",
      completed: "secondary",
    };
    const labels: Record<string, string> = {
      scheduled: "Programado",
      confirmed: "Confirmado",
      cancelled: "Cancelado",
      completed: "Completado",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Jugadores Activos
              </CardTitle>
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Partidos Hoy
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayMatches.length}</div>
              <p className="text-xs text-muted-foreground">
                {matches.filter((m) => m.status === "confirmed").length}{" "}
                confirmados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Nivel Promedio
              </CardTitle>
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Partidos
              </CardTitle>
              <CalendarPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{matches.length}</div>
              <p className="text-xs text-muted-foreground">
                {matches.filter((m) => m.status === "completed").length}{" "}
                completados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="matches" className="space-y-6">
          <TabsList>
            <TabsTrigger value="matches">Partidos</TabsTrigger>
            <TabsTrigger value="players">Jugadores</TabsTrigger>
            <TabsTrigger value="create-matches">Crear Partidos</TabsTrigger>
          </TabsList>

          <TabsContent value="matches">
            <Card>
              <CardHeader>
                <CardTitle>Partidos Programados</CardTitle>
                <CardDescription>
                  Gestiona los partidos del club
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Pista</TableHead>
                      <TableHead>Jugadores</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matches.map((match) => (
                      <TableRow key={match.id}>
                        <TableCell>{match.date}</TableCell>
                        <TableCell>{match.time}</TableCell>
                        <TableCell>Pista {match.court_number}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {match.participants?.map((p) => (
                              <div key={p.id}>
                                {p.player?.name} (Equipo {p.team})
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(match.status)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendNotifications(match.id)}
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Notificar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="players">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Jugadores</CardTitle>
                    <CardDescription>
                      Gestiona los jugadores del club
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isCreatingPlayer}
                    onOpenChange={setIsCreatingPlayer}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Jugador
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Crear Nuevo Jugador</DialogTitle>
                        <DialogDescription>
                          Añade un nuevo jugador al club
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleCreatePlayer(new FormData(e.currentTarget));
                        }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre</Label>
                          <Input id="name" name="name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono</Label>
                          <Input id="phone" name="phone" type="tel" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="skill_level">Nivel (1-10)</Label>
                          <Select name="skill_level" defaultValue="5">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                                <SelectItem
                                  key={level}
                                  value={level.toString()}
                                >
                                  Nivel {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full">
                          Crear Jugador
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Nivel</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell className="font-medium">
                          {player.name}
                        </TableCell>
                        <TableCell>{player.email}</TableCell>
                        <TableCell>{player.phone || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            Nivel {player.skill_level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={player.is_active ? "default" : "secondary"}
                          >
                            {player.is_active ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingPlayer(player)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create-matches">
            <Card>
              <CardHeader>
                <CardTitle>Crear Partidos Automáticamente</CardTitle>
                <CardDescription>
                  El sistema emparejará jugadores automáticamente basándose en
                  nivel y disponibilidad
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
                <Button onClick={handleCreateMatches} className="w-full">
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Crear Partidos Automáticamente
                </Button>
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Algoritmo de emparejamiento:</strong>
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Agrupa jugadores por nivel similar (±1 nivel)</li>
                    <li>Verifica disponibilidad para el día seleccionado</li>
                    <li>Crea equipos equilibrados de 4 jugadores</li>
                    <li>Asigna pistas automáticamente</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Player Dialog */}
        {editingPlayer && (
          <Dialog
            open={!!editingPlayer}
            onOpenChange={() => setEditingPlayer(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Jugador</DialogTitle>
                <DialogDescription>
                  Modifica la información del jugador
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdatePlayer(
                    editingPlayer.id,
                    new FormData(e.currentTarget)
                  );
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nombre</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingPlayer.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Teléfono</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    type="tel"
                    defaultValue={editingPlayer.phone || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-skill_level">Nivel (1-10)</Label>
                  <Select
                    name="skill_level"
                    defaultValue={editingPlayer.skill_level.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                        <SelectItem key={level} value={level.toString()}>
                          Nivel {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-is_active"
                    name="is_active"
                    defaultChecked={editingPlayer.is_active}
                  />
                  <Label htmlFor="edit-is_active">Jugador activo</Label>
                </div>
                <Button type="submit" className="w-full">
                  Actualizar Jugador
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
