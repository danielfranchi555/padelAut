import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  MapPin,
  Target,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Match } from "@prisma/client";
import { MatchWithPlayers } from "@/app/(protected)/dashboard/actions";

type StatusInfo = {
  variant: "default" | "outline" | "destructive" | "secondary";
  label: string;
};

interface DetailMatchProps {
  match: Match;
  matches: MatchWithPlayers[];
  confirmedCount: number;
  totalPlayers: number;
  statusInfo: StatusInfo;
  teamA: MatchWithPlayers["players"][number][];
  teamB: MatchWithPlayers["players"][number][];
}

const DetailMatch = ({
  match,
  confirmedCount,
  totalPlayers,
  statusInfo,
  teamA,
  teamB,
}: DetailMatchProps) => {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalles del Partido</DialogTitle>
          <DialogDescription>
            Información completa del partido programado
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Información General</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {match.scheduledAt.toLocaleDateString("es-ES")}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {match.scheduledAt.toLocaleTimeString("es-ES")} (
                  {formatDuration(match.durationMinutes)})
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {match.courtId}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Estado</h4>
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Confirmaciones</h4>
              <div className="text-sm">
                <span className="font-medium">
                  {confirmedCount}/{totalPlayers}
                </span>{" "}
                jugadores confirmados
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Jugadores</h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Equipo A
                </h5>
                <div className="space-y-3">
                  {teamA.map((matchPlayer) => (
                    <div
                      key={matchPlayer.id}
                      className="flex items-center gap-3 p-2 rounded-lg border"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            matchPlayer.player.user.image ||
                            "/placeholder.svg?height=32&width=32" ||
                            "/placeholder.svg"
                          }
                        />
                        <AvatarFallback className="text-xs">
                          {getInitials(matchPlayer.player.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {matchPlayer.player.user.name}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {matchPlayer.player.category && (
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              Nivel {matchPlayer.player.category}
                            </span>
                          )}
                          {matchPlayer.player.ranking && (
                            <span className="flex items-center gap-1">
                              <Trophy className="h-3 w-3" />#
                              {matchPlayer.player.ranking}
                            </span>
                          )}
                        </div>
                      </div>
                      {matchPlayer.confirmed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Equipo B
                </h5>
                <div className="space-y-3">
                  {teamB.map((matchPlayer) => (
                    <div
                      key={matchPlayer.id}
                      className="flex items-center gap-3 p-2 rounded-lg border"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            matchPlayer.player.user.image ||
                            "/placeholder.svg?height=32&width=32" ||
                            "/placeholder.svg"
                          }
                        />
                        <AvatarFallback className="text-xs">
                          {getInitials(matchPlayer.player.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {matchPlayer.player.user.name}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {matchPlayer.player.category && (
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              Nivel {matchPlayer.player.category}
                            </span>
                          )}
                          {matchPlayer.player.ranking && (
                            <span className="flex items-center gap-1">
                              <Trophy className="h-3 w-3" />#
                              {matchPlayer.player.ranking}
                            </span>
                          )}
                        </div>
                      </div>
                      {matchPlayer.confirmed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailMatch;
