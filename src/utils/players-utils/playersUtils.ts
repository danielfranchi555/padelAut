import { prisma } from "@/lib/db";
import { UserWithAllDetails } from "@/types/types";

export async function fetchPlayersWithAvailabilityAndMatches(): Promise<
  UserWithAllDetails[]
> {
  return prisma.user.findMany({
    where: {
      is_active: true,
      playerProfile: { isNot: null },
    },
    include: {
      playerProfile: {
        include: {
          matchPlayers: {
            include: {
              match: {
                select: {
                  scheduledAt: true,
                  durationMinutes: true,
                  status: true,
                },
              },
            },
          },
        },
      },
      availabilities: true,
    },
  });
}
