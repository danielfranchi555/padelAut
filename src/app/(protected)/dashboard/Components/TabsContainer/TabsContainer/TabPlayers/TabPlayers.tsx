// "use client";
// import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getPlayers } from "@/app/(protected)/dashboard/actions";

export const TabPlayers = async () => {
  const players = await getPlayers();

  if (!players) {
    return <span>Error al obtener los jugadores</span>;
  }

  // const [players, setPlayers] = useState<PlayerProfile[]>([]);
  // const [isCreatingPlayer, setIsCreatingPlayer] = useState(false);

  // const [editingPlayer, setEditingPlayer] = useState<PlayerProfile | null>(
  //   null
  // );

  // const handleCreatePlayer = (formData: FormData) => {
  //   const newPlayer: PlayerProfile = {
  //     id: `player-${Date.now()}`,
  //     level: 9,
  //     losses: 0,
  //     ranking: 0,
  //     userId: "user-1",
  //     wins: 0,
  //     created_at: new Date(),
  //     updated_at: new Date(),
  //   };

  //   setPlayers([...players, newPlayer]);
  //   setIsCreatingPlayer(false);
  //   alert("Jugador creado correctamente");
  // };

  return (
    <TabsContent value="players">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Jugadores</CardTitle>
              <CardDescription>Gestiona los jugadores del club</CardDescription>
            </div>
            {/* <Dialog open={isCreatingPlayer} onOpenChange={setIsCreatingPlayer}>
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
                    alert("created player");
                    // handleCreatePlayer(new FormData(e.currentTarget));
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
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
                          <SelectItem key={level} value={level.toString()}>
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
            </Dialog> */}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.email || "-"}</TableCell>
                  <TableCell>
                    {player.number}
                    {/* <Badge variant="outline">Number {player.number}</Badge> */}
                  </TableCell>
                  <TableCell>
                    <Badge variant={player.is_active ? "default" : "secondary"}>
                      {player.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{player.playerProfile?.category}</TableCell>

                  <TableCell>
                    {/* <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingPlayer(player)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
