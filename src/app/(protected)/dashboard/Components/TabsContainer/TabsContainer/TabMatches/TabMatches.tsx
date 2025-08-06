import { TabsContent } from "@/components/ui/tabs";
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

import {
  getMatches,
  MatchWithPlayers,
} from "@/app/(protected)/dashboard/actions";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Send,
  Users,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DetailMatch from "./DetailMatch/DetailMatch";

export const TabMatches = async () => {
  const matches = (await getMatches()) as MatchWithPlayers[];

  if (!matches || matches?.length === 0) {
    return <p>No hay matches</p>;
  }

  const statusConfig = {
    pending: {
      variant: "outline" as const,
      label: "Pendiente",
      icon: AlertCircle,
    },
    confirmed: {
      variant: "default" as const,
      label: "Confirmado",
      icon: CheckCircle,
    },
    cancelled: {
      variant: "destructive" as const,
      label: "Cancelado",
      icon: XCircle,
    },
  };

  const getConfirmedCount = (players: (typeof matches)[0]["players"]) => {
    return players.filter((p) => p.confirmed).length;
  };

  const formatDateTime = (date: Date) => {
    return {
      date: date.toLocaleDateString("es-ES", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      time: date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Simulamos equipos: primeros 2 jugadores = Equipo A, siguientes 2 = Equipo B
  const getTeamPlayers = (
    players: (typeof matches)[0]["players"],
    team: "A" | "B"
  ) => {
    if (team === "A") {
      return players.slice(0, 2);
    }
    return players.slice(2, 4);
  };

  return (
    <TabsContent value="matches">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Partidos Programados
          </CardTitle>
          <CardDescription>Gestiona los partidos del club</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Fecha y Hora</TableHead>
                  <TableHead>Cancha</TableHead>
                  <TableHead>Jugadores</TableHead>
                  <TableHead className="w-[120px]">Estado</TableHead>
                  <TableHead className="w-[80px]">Duración</TableHead>
                  <TableHead className="w-[100px] text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => {
                  const { date, time } = formatDateTime(match.scheduledAt);
                  const statusInfo =
                    statusConfig[match.status as keyof typeof statusConfig];
                  const StatusIcon = statusInfo.icon;
                  const confirmedCount = getConfirmedCount(match.players);
                  const teamA = getTeamPlayers(match.players, "A");
                  const teamB = getTeamPlayers(match.players, "B");

                  const totalPlayers = match.players.length;

                  return (
                    <TableRow key={match.id} className="hover:bg-muted/50">
                      {/* FECHA Y HORA */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{date}</span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {time}
                          </span>
                        </div>
                      </TableCell>

                      {/* INFO COURT */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {match.court.name}
                          </span>
                          {match.court.location && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {match.court.location}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>
                              {confirmedCount}/{totalPlayers} confirmados
                            </span>
                          </div>

                          <div className="space-y-4">
                            {/* Equipo A */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-muted-foreground w-8">
                                A:
                              </span>
                              <div className="flex gap-3 ">
                                {teamA.map((matchPlayer) => (
                                  <div
                                    key={matchPlayer.id}
                                    className="relative group"
                                  >
                                    <Avatar className="h-6 w-6 border-2 border-background">
                                      <AvatarImage
                                        src={
                                          matchPlayer.player.user.image ||
                                          "/placeholder.svg?height=24&width=24" ||
                                          "/placeholder.svg"
                                        }
                                      />
                                      <AvatarFallback className="text-xs">
                                        {getInitials(
                                          matchPlayer.player.user.name
                                        )}
                                      </AvatarFallback>
                                    </Avatar>
                                    {matchPlayer.confirmed ? (
                                      <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-600 bg-background rounded-full" />
                                    ) : (
                                      <AlertCircle className="absolute -top-1 -right-1 h-3 w-3 text-blue-500 bg-background rounded-full" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Equipo B */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-muted-foreground w-8">
                                B:
                              </span>
                              <div className="flex gap-3">
                                {teamB.map((matchPlayer) => (
                                  <div
                                    key={matchPlayer.id}
                                    className="relative group"
                                  >
                                    <Avatar className="h-6 w-6 border-2 border-background">
                                      <AvatarImage
                                        src={
                                          matchPlayer.player.user.image ||
                                          "/placeholder.svg?height=24&width=24" ||
                                          "/placeholder.svg"
                                        }
                                      />
                                      <AvatarFallback className="text-xs">
                                        {getInitials(
                                          matchPlayer.player.user.name
                                        )}
                                      </AvatarFallback>
                                    </Avatar>
                                    {matchPlayer.confirmed ? (
                                      <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-600 bg-background rounded-full" />
                                    ) : (
                                      <AlertCircle className="absolute -top-1 -right-1 h-3 w-3 text-blue-500 bg-background rounded-full" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* STATE MATCH */}
                      <TableCell>
                        <Badge
                          variant={statusInfo.variant}
                          className="flex items-center gap-1 w-fit"
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDuration(match.durationMinutes)}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Botón de notificación rápida */}
                          {match.players.some((p) => !p.confirmed) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="Enviar recordatorio"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}

                          <DetailMatch
                            matches={matches}
                            match={match}
                            confirmedCount={confirmedCount}
                            totalPlayers={totalPlayers}
                            statusInfo={statusInfo}
                            teamA={teamA}
                            teamB={teamB}
                          />

                          {/* Menú de más acciones */}
                          {/* <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  Enviar notificaciones
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
