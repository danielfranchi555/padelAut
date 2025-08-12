import { prisma } from "@/lib/db";
import { MatchWithPlayers } from "@/types/types";
import { Match, MatchPlayer, PlayerProfile } from "@prisma/client";

interface ProposedMatchSlot {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  scheduledAtDate: Date;
  potentialPlayers: PlayerProfileWithName[];
}

type PlayerProfileWithName = PlayerProfileWithMatchPlayers & {
  name: string;
};
type PlayerProfileWithMatchPlayers = PlayerProfile & {
  matchPlayers: MatchPlayerWithMatch[];
};

type MatchPlayerWithMatch = MatchPlayer & {
  match: Pick<Match, "scheduledAt" | "durationMinutes" | "status"> | null;
};

export async function createMatchFromSlot(
  slot: ProposedMatchSlot,
  court: { id: string; name: string },
  selectedPlayers: PlayerProfileWithName[],
  durationMinutes: number
) {
  if (selectedPlayers.length < 4) {
    throw new Error("No hay suficientes jugadores para crear el partido");
  }

  // Crear partido en BD (puedes adaptar a modelo real)
  const matchCreated = await prisma.match.create({
    data: {
      courtId: court.id,
      scheduledAt: slot.scheduledAtDate,
      durationMinutes,
      status: "pending",
      players: {
        create: selectedPlayers.map((p, idx) => ({
          playerId: p.id,
          team: idx < 2 ? 1 : 2,
          confirmed: false,
          confirmationToken: "123", // implementa función si es necesaria
        })),
      },
    },
    include: { players: true },
  });

  return matchCreated;
}

// Traer partidos ya creados desde startFromdate
export async function FetchExistingMatches(
  startFromdate: string
): Promise<MatchWithPlayers[]> {
  try {
    return await prisma.match.findMany({
      where: {
        scheduledAt: {
          gte: new Date(startFromdate),
        },
      },
      include: { players: true, court: true }, // players es la relación matchPlayers
    });
  } catch (error) {
    console.log({ error });
    return [];
  }
}
