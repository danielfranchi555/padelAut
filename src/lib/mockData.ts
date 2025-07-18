import type {
  Player,
  Match,
  MatchParticipant,
  Availability,
} from "../types/types";

export const mockPlayers: Player[] = [
  {
    id: "admin-1",
    email: "admin@padelclub.com",
    name: "Admin Club",
    phone: "+34600000000",
    skill_level: 8,
    is_admin: true,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "player-1",
    email: "juan.perez@email.com",
    name: "Juan Pérez",
    phone: "+34600000001",
    skill_level: 7,
    is_admin: false,
    is_active: true,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "player-2",
    email: "maria.garcia@email.com",
    name: "María García",
    phone: "+34600000002",
    skill_level: 6,
    is_admin: false,
    is_active: true,
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
  },
  {
    id: "player-3",
    email: "carlos.lopez@email.com",
    name: "Carlos López",
    phone: "+34600000003",
    skill_level: 8,
    is_admin: false,
    is_active: true,
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "player-4",
    email: "ana.martinez@email.com",
    name: "Ana Martínez",
    phone: "+34600000004",
    skill_level: 5,
    is_admin: false,
    is_active: true,
    created_at: "2024-02-05T00:00:00Z",
    updated_at: "2024-02-05T00:00:00Z",
  },
  {
    id: "player-5",
    email: "pedro.sanchez@email.com",
    name: "Pedro Sánchez",
    phone: "+34600000005",
    skill_level: 7,
    is_admin: false,
    is_active: true,
    created_at: "2024-02-10T00:00:00Z",
    updated_at: "2024-02-10T00:00:00Z",
  },
  {
    id: "player-6",
    email: "laura.rodriguez@email.com",
    name: "Laura Rodríguez",
    phone: "+34600000006",
    skill_level: 6,
    is_admin: false,
    is_active: true,
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z",
  },
  {
    id: "player-7",
    email: "miguel.fernandez@email.com",
    name: "Miguel Fernández",
    phone: "+34600000007",
    skill_level: 9,
    is_admin: false,
    is_active: true,
    created_at: "2024-02-20T00:00:00Z",
    updated_at: "2024-02-20T00:00:00Z",
  },
  {
    id: "player-8",
    email: "sofia.gonzalez@email.com",
    name: "Sofía González",
    phone: "+34600000008",
    skill_level: 4,
    is_admin: false,
    is_active: true,
    created_at: "2024-02-25T00:00:00Z",
    updated_at: "2024-02-25T00:00:00Z",
  },
];

export const mockAvailability: Availability[] = [
  // Juan Pérez - Lunes a Viernes 18:00-22:00
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `avail-juan-${i + 1}`,
    player_id: "player-1",
    day_of_week: i + 1,
    start_time: "18:00",
    end_time: "22:00",
    is_active: true,
    created_at: "2024-01-15T00:00:00Z",
  })),
  // Juan Pérez - Fines de semana 10:00-14:00
  {
    id: "avail-juan-6",
    player_id: "player-1",
    day_of_week: 6,
    start_time: "10:00",
    end_time: "14:00",
    is_active: true,
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "avail-juan-0",
    player_id: "player-1",
    day_of_week: 0,
    start_time: "10:00",
    end_time: "14:00",
    is_active: true,
    created_at: "2024-01-15T00:00:00Z",
  },
  // Otros jugadores con disponibilidad similar
  ...mockPlayers
    .filter((p) => p.id !== "player-1" && !p.is_admin)
    .flatMap((player) => [
      ...Array.from({ length: 5 }, (_, i) => ({
        id: `avail-${player.id}-${i + 1}`,
        player_id: player.id,
        day_of_week: i + 1,
        start_time: "18:00",
        end_time: "22:00",
        is_active: true,
        created_at: player.created_at,
      })),
      {
        id: `avail-${player.id}-6`,
        player_id: player.id,
        day_of_week: 6,
        start_time: "10:00",
        end_time: "14:00",
        is_active: true,
        created_at: player.created_at,
      },
      {
        id: `avail-${player.id}-0`,
        player_id: player.id,
        day_of_week: 0,
        start_time: "10:00",
        end_time: "14:00",
        is_active: true,
        created_at: player.created_at,
      },
    ]),
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

export const mockMatches: Match[] = [
  {
    id: "match-1",
    date: tomorrow.toISOString().split("T")[0],
    time: "19:00",
    court_number: 1,
    status: "scheduled",
    created_by: "admin-1",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "match-2",
    date: tomorrow.toISOString().split("T")[0],
    time: "20:00",
    court_number: 2,
    status: "confirmed",
    created_by: "admin-1",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "match-3",
    date: dayAfterTomorrow.toISOString().split("T")[0],
    time: "19:00",
    court_number: 1,
    status: "scheduled",
    created_by: "admin-1",
    created_at: "2024-03-02T00:00:00Z",
    updated_at: "2024-03-02T00:00:00Z",
  },
  {
    id: "match-4",
    date: "2024-02-28",
    time: "19:00",
    court_number: 1,
    status: "completed",
    created_by: "admin-1",
    created_at: "2024-02-28T00:00:00Z",
    updated_at: "2024-02-28T00:00:00Z",
  },
];

export const mockMatchParticipants: MatchParticipant[] = [
  // Match 1 participants
  {
    id: "part-1-1",
    match_id: "match-1",
    player_id: "player-1",
    team: 1,
    confirmed: false,
    created_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "part-1-2",
    match_id: "match-1",
    player_id: "player-2",
    team: 1,
    confirmed: true,
    created_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "part-1-3",
    match_id: "match-1",
    player_id: "player-3",
    team: 2,
    confirmed: true,
    created_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "part-1-4",
    match_id: "match-1",
    player_id: "player-4",
    team: 2,
    confirmed: false,
    created_at: "2024-03-01T00:00:00Z",
  },
  // Match 2 participants
  {
    id: "part-2-1",
    match_id: "match-2",
    player_id: "player-5",
    team: 1,
    confirmed: true,
    created_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "part-2-2",
    match_id: "match-2",
    player_id: "player-6",
    team: 1,
    confirmed: true,
    created_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "part-2-3",
    match_id: "match-2",
    player_id: "player-7",
    team: 2,
    confirmed: true,
    created_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "part-2-4",
    match_id: "match-2",
    player_id: "player-8",
    team: 2,
    confirmed: true,
    created_at: "2024-03-01T00:00:00Z",
  },
  // Match 3 participants
  {
    id: "part-3-1",
    match_id: "match-3",
    player_id: "player-1",
    team: 1,
    confirmed: false,
    created_at: "2024-03-02T00:00:00Z",
  },
  {
    id: "part-3-2",
    match_id: "match-3",
    player_id: "player-5",
    team: 1,
    confirmed: true,
    created_at: "2024-03-02T00:00:00Z",
  },
  {
    id: "part-3-3",
    match_id: "match-3",
    player_id: "player-2",
    team: 2,
    confirmed: true,
    created_at: "2024-03-02T00:00:00Z",
  },
  {
    id: "part-3-4",
    match_id: "match-3",
    player_id: "player-6",
    team: 2,
    confirmed: true,
    created_at: "2024-03-02T00:00:00Z",
  },
  // Match 4 participants (completed)
  {
    id: "part-4-1",
    match_id: "match-4",
    player_id: "player-1",
    team: 1,
    confirmed: true,
    created_at: "2024-02-28T00:00:00Z",
  },
  {
    id: "part-4-2",
    match_id: "match-4",
    player_id: "player-3",
    team: 1,
    confirmed: true,
    created_at: "2024-02-28T00:00:00Z",
  },
  {
    id: "part-4-3",
    match_id: "match-4",
    player_id: "player-5",
    team: 2,
    confirmed: true,
    created_at: "2024-02-28T00:00:00Z",
  },
  {
    id: "part-4-4",
    match_id: "match-4",
    player_id: "player-7",
    team: 2,
    confirmed: true,
    created_at: "2024-02-28T00:00:00Z",
  },
];

// Helper function to get matches with participants populated
export function getMatchesWithParticipants(): Match[] {
  return mockMatches.map((match) => ({
    ...match,
    participants: mockMatchParticipants
      .filter((p) => p.match_id === match.id)
      .map((participant) => ({
        ...participant,
        player: mockPlayers.find(
          (player) => player.id === participant.player_id
        ),
      })),
  }));
}

// Helper function to get player matches
export function getPlayerMatches(playerId: string): Match[] {
  const playerMatchIds = mockMatchParticipants
    .filter((p) => p.player_id === playerId)
    .map((p) => p.match_id);

  return mockMatches
    .filter((match) => playerMatchIds.includes(match.id))
    .map((match) => ({
      ...match,
      participants: mockMatchParticipants
        .filter((p) => p.match_id === match.id)
        .map((participant) => ({
          ...participant,
          player: mockPlayers.find(
            (player) => player.id === participant.player_id
          ),
        })),
    }));
}
