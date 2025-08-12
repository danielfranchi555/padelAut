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
  parseISO,
  addDays,
  startOfWeek,
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

function calcularFechaProxima(
  dayOfWeek: string,
  time: string,
  baseDate: Date = new Date()
): Date {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const baseDayIndex = getDay(baseDate);
  const targetDayIndex = days.indexOf(dayOfWeek.toLowerCase());

  let daysUntil = targetDayIndex - baseDayIndex;
  if (daysUntil < 0) daysUntil += 7;

  const [hour, minute] = time.split(":").map(Number);

  let candidateDate = setMilliseconds(
    setSeconds(setMinutes(setHours(baseDate, hour), minute), 0),
    0
  );

  if (daysUntil === 0 && candidateDate < baseDate) daysUntil = 7;

  if (daysUntil > 0) {
    candidateDate = new Date(candidateDate);
    candidateDate.setDate(candidateDate.getDate() + daysUntil);
  }

  // Aquí la diferencia: Si candidateDate está en el pasado respecto a ahora, avanzar una semana
  const now = new Date();
  if (candidateDate <= now) {
    candidateDate.setDate(candidateDate.getDate() + 7);
  }

  return candidateDate;
}

export function generateSlotsWithPlayers(
  dayOfWeek: string, // tuesday
  courtFrom: string, // 08:00
  courtTo: string, // 23:59
  durationMinutes: number, // 90min
  maxCategoryDiff: number, // 1
  allPlayers: UserWithAllDetails[],
  startFromdate: string // 20/08/25
): ProposedMatchSlot[] {
  const slots: ProposedMatchSlot[] = [];

  const startFromDateObj = startFromdate ? parseISO(startFromdate) : new Date();

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
  const now = new Date();

  for (const slot of timeSlots) {
    const startTime = slot.start; // ej. "08:00"
    const endTime = slot.end; // ej. "09:30"

    // Nuevo: calcular fecha a partir de startFromDateObj
    const scheduledAtDate = calcularFechaProxima(
      dayOfWeek,
      startTime,
      startFromDateObj
    );

    if (scheduledAtDate <= now) {
      // Este slot ya pasó, lo ignoro
      continue;
    }
    // const scheduledAtDate = calcularFechaProxima(dayOfWeek, startTime);

    // Filtra los jugadores disponibles para este slot
    const availablePlayers = filterByTimeAndDate(
      dayOfWeek,
      scheduledAtDate,
      allPlayers,
      durationMinutes
    );

    const filteredByCategory = filterPlayersByCategory(
      availablePlayers,
      maxCategoryDiff
    );

    if (filteredByCategory.length >= 4) {
      // {
      //   console.log(
      //     `JUGADORES SUFICIENTES PARA EL SLOT DE ${slot.start} - ${
      //       slot.end
      //     }, jugadore: ${availablePlayers.map((p) => ({
      //       nam: p.name,
      //       avaialabilties: p.availabilities.map((a) => a.dayOfWeek),
      //     }))}`
      //   );
      // }
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
  const startTime = parse(fromTime, "HH:mm", baseDate); // 8/7/2025, 8:00:00 AM
  const endTime = parse(toTime, "HH:mm", baseDate); // 8/7/2025, 23:59:00 PM

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

function filterPlayersByCategory(
  players: UserWithAllDetails[],
  maxCategoryDiff: number
): UserWithAllDetails[] {
  if (players.length === 0) return [];

  const baseCategory = players[0].playerProfile?.category ?? 0;

  const playersFiltered = players.filter((p) => {
    const cat = p.playerProfile?.category ?? 0;
    return Math.abs(cat - baseCategory) <= maxCategoryDiff;
  });

  return playersFiltered;
}
function filterByTimeAndDate(
  dayOfWeek: string,
  scheduledAtDate: Date,
  players: UserWithAllDetails[],
  durationMinutes: number
) {
  // Calcula el inicio de la semana del slot (ejemplo: lunes 0:00)
  const weekStart = startOfWeek(scheduledAtDate, { weekStartsOn: 1 }); // Lunes como inicio de semana

  // Función para convertir "dayOfWeek + time" a Date dentro de la misma semana del slot
  function getDateForDayTime(dayName: string, timeStr: string): Date {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayIndex = days.indexOf(dayName.toLowerCase());

    if (dayIndex === -1) throw new Error("dayOfWeek inválido: " + dayName);

    // Calculamos el offset de lunes (0) a dayIndex según que lunes es el inicio de semana
    // Aquí, lunes es 1, domingo 0, vamos a ajustar el índice para que lunes=0
    const adjustedDayIndex = (dayIndex + 6) % 7; // Corrige para que lunes=0

    // Fecha base + días hasta el día objetivo
    const date = addDays(weekStart, adjustedDayIndex);

    // Parseamos la hora
    const [hour, minute] = timeStr.split(":").map(Number);

    return setSeconds(setMinutes(setHours(date, hour), minute), 0);
  }

  return players.filter((user) => {
    if (!user.playerProfile || !user.is_active) return false;

    // Horario slot: inicio y fin
    const slotStart = scheduledAtDate;
    const slotEnd = addMinutes(scheduledAtDate, durationMinutes);

    return user.availabilities.some((avail) => {
      if (avail.dayOfWeek.toLowerCase() !== dayOfWeek.toLowerCase())
        return false;

      // Disponibilidad: inicio y fin como Date en la misma semana
      const availStart = getDateForDayTime(avail.dayOfWeek, avail.from);
      const availEnd = getDateForDayTime(avail.dayOfWeek, avail.to);

      // Verificamos que la disponibilidad cubre el rango completo del slot:
      // disponibilidad inicio <= slot inicio AND disponibilidad fin >= slot fin
      return !isAfter(availStart, slotStart) && !isBefore(availEnd, slotEnd);
    });
  });
}
