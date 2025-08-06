import {
  addMinutes,
  format,
  parse,
  isBefore,
  isAfter,
  setHours,
  setMinutes,
  getDay,
  setMilliseconds,
  setSeconds,
} from "date-fns";
import type { PlayerProfile, MatchPlayer, Match } from "@prisma/client";
import { UserWithAllDetails } from "@/types/types";

type MatchPlayerWithMatch = MatchPlayer & {
  match: Pick<Match, "scheduledAt" | "durationMinutes" | "status"> | null;
};

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

/**
 * Calcula una fecha que representa la próxima ocurrencia del día de la semana `dayOfWeek`
 * a la hora indicada por `time` ("HH:mm").
 */
function calcularFechaProxima(dayOfWeek: string, time: string): Date {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const today = new Date();
  const todayIdx = getDay(today); // lunes = 1, martes = 2
  const targetIdx = days.indexOf(dayOfWeek.toLowerCase()); // 1 -> lunes

  let daysUntil = targetIdx - todayIdx;
  if (daysUntil < 0) daysUntil += 7; // próximo ciclo semanal

  const [hour, minute] = time.split(":").map(Number);

  // Fecha base con la hora correcta pero aun hoy
  const proposedToday = setMinutes(setHours(today, hour), minute);

  // Si es hoy pero ya pasó la hora, salto al próximo ciclo semanal
  if (daysUntil === 0 && isBefore(proposedToday, today)) daysUntil = 7;

  const next = new Date(today);
  next.setDate(today.getDate() + daysUntil);

  return setMilliseconds(
    setSeconds(setMinutes(setHours(next, hour), minute), 0),
    0
  );
}

export function generateMatch(
  dayOfWeek: string, // monday
  courtFrom: string, // 08:00
  courtTo: string, // 23:59
  durationMinutes: number, // 90min
  allPlayers: UserWithAllDetails[]
): ProposedMatchSlot[] {
  const slots: ProposedMatchSlot[] = [];

  // Primero generas todos los intervalos horarios posibles
  const timeSlots = generateTimeSlots(courtFrom, courtTo, durationMinutes);
  //    EJEMPLO SLOTS DIA MONDAY: [
  //   { start: '08:00', end: '09:30' },
  //   { start: '09:30', end: '11:00' },
  //   { start: '11:00', end: '12:30' },
  //   { start: '12:30', end: '14:00' },
  //   { start: '14:00', end: '15:30' },
  //   { start: '15:30', end: '17:00' },
  //   { start: '17:00', end: '18:30' },
  //   { start: '18:30', end: '20:00' },
  //   { start: '20:00', end: '21:30' },
  //   { start: '21:30', end: '23:00' }
  // ]

  for (const slot of timeSlots) {
    const startTime = slot.start; // ej. "08:00"
    const endTime = slot.end; // ej. "09:30"

    // Calcula la fecha completa para el slot (día + hora de inicio)
    const scheduledAtDate = calcularFechaProxima(dayOfWeek, startTime);

    // Filtra los jugadores disponibles para este slot
    const availablePlayers = allPlayers.filter((user) => {
      if (!user.playerProfile || !user.is_active) return false;

      return user.availabilities.some((avail) => {
        // [
        //   { "id": "av-11a", "userId": "user-11", "dayOfWeek": "monday", "from": "08:00", "to": "13:00" },
        //   { "id": "av-12a", "userId": "user-12", "dayOfWeek": "monday", "from": "08:00", "to": "13:00" },
        //   { "id": "av-1a", "userId": "user-1", "dayOfWeek": "monday", "from": "08:00", "to": "13:00" },
        //   { "id": "av-3a", "userId": "user-3", "dayOfWeek": "monday", "from": "08:00", "to": "13:00" },
        //   { "id": "av-5a", "userId": "user-5", "dayOfWeek": "monday", "from": "08:00", "to": "13:00" },
        //   { "id": "av-6a", "userId": "user-6", "dayOfWeek": "monday", "from": "17:00", "to": "22:00" },
        //   { "id": "av-9a", "userId": "user-9", "dayOfWeek": "monday", "from": "17:00", "to": "22:00" }
        // ]

        if (avail.dayOfWeek.toLowerCase() !== dayOfWeek.toLowerCase())
          return false;

        const userAvailStartDateInicio = calcularFechaProxima(
          avail.dayOfWeek,
          avail.from
        );

        const userAvailEndDateFinal = calcularFechaProxima(
          avail.dayOfWeek,
          avail.to
        );

        return (
          !isAfter(userAvailStartDateInicio, scheduledAtDate) &&
          !isBefore(
            userAvailEndDateFinal,
            addMinutes(scheduledAtDate, durationMinutes)
          )
        );
      });
    });

    if (availablePlayers.length >= 4) {
      {
        console.log(
          `JUGADORES SUFICIENTES PARA EL SLOT DE ${slot.start} - ${
            slot.end
          }, jugadore: ${availablePlayers.map((p) => ({
            nam: p.name,
            avaialabilties: p.availabilities.map((a) => a.dayOfWeek),
          }))}`
        );
      }
      slots.push({
        dayOfWeek,
        startTime,
        endTime,
        scheduledAtDate,
        potentialPlayers: availablePlayers
          .filter(
            (
              p
            ): p is UserWithAllDetails & {
              playerProfile: PlayerProfileWithMatchPlayers;
            } => !!p.playerProfile
          )
          .map((p) => ({
            ...p.playerProfile,
            name: p.name ?? "Sin nombre",
          })) as PlayerProfileWithName[],
      });
    } else {
      console.log(
        `❌ No hay jugadores suficientes para el slot del dia ${dayOfWeek} de ${startTime} hasta ${endTime}`
      );
    }
  }

  return slots;
}

export function generateTimeSlots(
  fromTime: string,
  toTime: string,
  durationMinutes: number
): Array<{ start: string; end: string }> {
  const baseDate = new Date();
  const startTime = parse(fromTime, "HH:mm", baseDate); // 8/5/2025, 8:00:00 AM
  const endTime = parse(toTime, "HH:mm", baseDate); // 8/5/2025, 23:59:00 PM

  const slots = [];
  let currentTime = startTime;

  while (addMinutes(currentTime, durationMinutes) <= endTime) {
    const slotStart = format(currentTime, "HH:mm"); // 08:00
    const slotEnd = format(addMinutes(currentTime, durationMinutes), "HH:mm"); // 09:30

    slots.push({
      start: slotStart,
      end: slotEnd,
    });

    currentTime = addMinutes(currentTime, durationMinutes);
  }

  return slots;
}
