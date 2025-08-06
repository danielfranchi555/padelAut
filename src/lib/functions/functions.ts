export function calcularFechaProxima(dayOfWeek: string, from: string): Date {
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const today = new Date();
  const todayDay = today.getDay();
  const targetDay = daysOfWeek.indexOf(dayOfWeek.toLowerCase());
  let daysUntil = (targetDay - todayDay + 7) % 7;
  if (daysUntil === 0 && today.getHours() > parseInt(from.split(":")[0])) {
    daysUntil = 7;
  }
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntil);
  const [hour, minute] = from.split(":").map(Number);
  nextDate.setHours(hour, minute, 0, 0);
  return nextDate;
}

export function elegirJugadores(jugadores: { id: string }[], cantidad: number) {
  return jugadores.sort(() => Math.random() - 0.5).slice(0, cantidad);
}
