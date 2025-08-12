"use server";
import { generateSlotsWithPlayers } from "./utils/date-utils.ts/dateUtils";
import { fetchPlayersWithAvailabilityAndMatches } from "./utils/players-utils/playersUtils";
import { format } from "date-fns";
import {
  createMatchFromSlot,
  FetchExistingMatches,
} from "./utils/matchUtils/matchUtils";
import { fetchCourts } from "./utils/court-utils/courtUtils";

type AutoCreateMatchesParams = {
  startFromdate: string;
  minStartTime: string;
  maxCategoryDiff: number;
};

const MATCH_DURATION_MINUTES = 90;

export async function autoCreateMatches({
  startFromdate,
  minStartTime,
  maxCategoryDiff,
}: AutoCreateMatchesParams) {
  const courts = await fetchCourts();
  const allPlayers = await fetchPlayersWithAvailabilityAndMatches();

  // Traer partidos ya creados desde startFromdate
  const existingMatches = await FetchExistingMatches(startFromdate);

  // Mapa jugadorId -> fechas ya ocupadas
  const playerAssignedDates = new Map<string, Set<string>>();
  // Set de slots ocupados: "courtId|YYYY-MM-DD|HH:mm"
  const takenSlots = new Set<string>();

  for (const match of existingMatches) {
    const matchDateStr = format(match.scheduledAt, "yyyy-MM-dd");
    const matchTimeStr = format(match.scheduledAt, "HH:mm");
    takenSlots.add(`${match.courtId}|${matchDateStr}|${matchTimeStr}`);

    for (const matchPlayer of match.players) {
      const pid = matchPlayer.playerId;
      if (!playerAssignedDates.has(pid)) {
        playerAssignedDates.set(pid, new Set());
      }
      playerAssignedDates.get(pid)!.add(matchDateStr);
    }
  }

  const createdMatches = [];

  for (const court of courts) {
    for (const availability of court.availabilities) {
      const slotStartFrom =
        availability.from > minStartTime ? availability.from : minStartTime;

      const slots = generateSlotsWithPlayers(
        availability.dayOfWeek.toLowerCase(),
        slotStartFrom,
        availability.to,
        MATCH_DURATION_MINUTES,
        maxCategoryDiff,
        allPlayers,
        startFromdate
      );

      for (const slot of slots) {
        const slotDateStr = format(slot.scheduledAtDate, "yyyy-MM-dd");
        const slotTimeStr = slot.startTime;

        // Evitar crear partido si el slot ya está ocupado
        if (takenSlots.has(`${court.id}|${slotDateStr}|${slotTimeStr}`)) {
          continue;
        }

        // Filtrar jugadores que ya tienen partido ese día
        const availablePlayers = slot.potentialPlayers.filter((player) => {
          const hasMatchThatDay = playerAssignedDates
            .get(player.id)
            ?.has(slotDateStr);
          if (hasMatchThatDay) {
            console.log(
              `Jugador ${player.name} (${player.id}) ya tiene partido el día ${slotDateStr}, no se asigna.`
            );
          }
          return !hasMatchThatDay;
        });

        if (availablePlayers.length >= 4) {
          const selectedPlayers = availablePlayers.slice(0, 4);

          try {
            const matchCreated = await createMatchFromSlot(
              slot,
              court,
              selectedPlayers,
              MATCH_DURATION_MINUTES
            );
            createdMatches.push(matchCreated);

            takenSlots.add(`${court.id}|${slotDateStr}|${slotTimeStr}`);
            for (const p of selectedPlayers) {
              if (!playerAssignedDates.has(p.id)) {
                playerAssignedDates.set(p.id, new Set());
              }
              playerAssignedDates.get(p.id)!.add(slotDateStr);
            }
          } catch (error) {
            console.log(`Error al crear el match ${error}`);
          }
        }
      }
    }
  }

  return {
    count: createdMatches.length,
    matches: createdMatches,
  };
}
