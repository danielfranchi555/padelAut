"use server";
import { prisma } from "@/lib/db";

export async function getMatches() {
  try {
    const matches = await prisma.match.findMany({
      include: {
        court: true,
        players: {
          include: {
            player: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return matches;
  } catch (error) {
    console.log(`error al traer los matches: ${error}`);
    return []; // 👈 asegurás que nunca sea undefined
  }
}

export async function getPlayers() {
  try {
    const players = await prisma.user.findMany({
      include: {
        playerProfile: true,
      },
    });

    return players;
  } catch (error) {
    console.log(`error al traer los players: ${error}`);
    return []; // 👈 asegurás que nunca sea undefined
  }
}

export type MatchWithPlayers = Awaited<ReturnType<typeof getMatches>>[number];
export type players = Awaited<ReturnType<typeof getPlayers>>[number];
