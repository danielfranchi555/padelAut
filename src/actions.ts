"use server";
import { prisma } from "@/lib/db";
import { generateMatch } from "./utils/date-utils.ts/dateUtils";
import { fetchPlayersWithAvailabilityAndMatches } from "./utils/players-utils/playersUtils";

export async function autoCreateMatches() {
  const courts = await prisma.court.findMany({
    include: { availabilities: true },
  });

  const allPlayers = await fetchPlayersWithAvailabilityAndMatches();
  const MATCH_DURATION_MINUTES = 90;

  // Mapa jugadorId -> fecha asignada (para mantener control un partido por día)
  // const playerAssignedDates = new Map<string, string>(); //{ key: playerId, value: YYYY-MM-DD}

  // const createdMatches = [];

  for (const court of courts) {
    for (const availability of court.availabilities) {
      console.log(
        `creando slots par el dia ${availability.dayOfWeek} en la cancha ${court.name} desde las ${availability.from} hasta las ${availability.to}`
      );

      const slots = generateMatch(
        availability.dayOfWeek.toLowerCase(),
        availability.from,
        availability.to,
        MATCH_DURATION_MINUTES,
        allPlayers
      );

      console.dir({ slots });
      // console.log(JSON.stringify({ slots }, null, 2));

      // const slots = generateMatchSlots(
      //   availability.dayOfWeek.toLowerCase(),
      //   availability.from,
      //   availability.to,
      //   MATCH_DURATION_MINUTES,
      //   allPlayers
      // );

      // if (slots.length === 0) {
      //   console.log(
      //     `⚠️ No slots disponibles para cancha ${court.name} el ${availability.dayOfWeek}`
      //   );
      //   continue;
      // }

      // for (const slot of slots) {
      //   // Filtra jugadores no asignados aún ese día
      //   const availablePlayers = slot.potentialPlayers.filter((player) => {
      //     const assignedDate = playerAssignedDates.get(player.id); //1ra iteracion -> undefined
      //     const slotDateStr = format(slot.scheduledAtDate, "yyyy-MM-dd"); // obtenemos la fecha en este formato: YYYY-MM-DD

      //     // Solo incluyo al jugador si NO está asignado a un partido en la misma fecha
      //     return assignedDate !== slotDateStr; // 1ra iteracion = true
      //   });

      //   if (availablePlayers.length >= 4) {
      //     // Selecciona primeros 4 jugadores libres
      //     const selectedPlayers = availablePlayers.slice(0, 4);

      //     // Crear partido en BD (puedes adaptar a modelo real)
      //     const matchCreated = await prisma.match.create({
      //       data: {
      //         courtId: court.id,
      //         scheduledAt: slot.scheduledAtDate,
      //         durationMinutes: MATCH_DURATION_MINUTES,
      //         status: "pending",
      //         players: {
      //           create: selectedPlayers.map((p, idx) => ({
      //             playerId: p.id,
      //             team: idx < 2 ? 1 : 2,
      //             confirmed: false,
      //             confirmationToken: "123", // implementa función si es necesaria
      //           })),
      //         },
      //       },
      //       include: { players: true },
      //     });

      //     console.log(
      //       `✅ Partido creado en cancha ${court.name} para ${slot.dayOfWeek} ${
      //         slot.startTime
      //       }-${slot.endTime} con jugadores: ${selectedPlayers
      //         .map((p) => p.name)
      //         .join(", ")}`
      //     );

      //     createdMatches.push(matchCreated);

      //     // Marca jugadores como asignados ese día
      //     const slotDateStr = format(slot.scheduledAtDate, "yyyy-MM-dd"); // obtenemos la fecha en este formato: YYYY-MM-DD
      //     // const slotDateStr = slot.scheduledAtDate.toISOString().slice(0, 10);
      //     for (const p of selectedPlayers) {
      //       playerAssignedDates.set(p.id, slotDateStr);
      //     }
      //   } else {
      //     console.log(
      //       `❌ No suficientes jugadores libres para cancha ${court.name} el ${slot.dayOfWeek} ${slot.startTime}-${slot.endTime}`
      //     );
      //   }
      // }
    }
  }

  // return createdMatches;
}
