"use server";

import { prisma } from "@/lib/db";
import { MatchWithAvailabilities } from "@/types/types";

export async function fetchCourts(): Promise<MatchWithAvailabilities[]> {
  try {
    return await prisma.court.findMany({
      include: { availabilities: true },
    });
  } catch (error) {
    console.log({ error });
    return [];
  }
}
