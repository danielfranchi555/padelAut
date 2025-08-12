import {
  Match,
  MatchPlayer,
  PlayerProfile,
  Prisma,
  User,
} from "@prisma/client";

export interface Player {
  id: string;
  name: string;
  email: string;
  email_verified?: string;
  image?: string;
  role: "admin" | "user";
  number: string;
  level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Availability {
  id: string;
  player_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
}

export interface MatchUi {
  id: string;
  date: string;
  time: string;
  court_number: number;
  status: "scheduledAt" | "confirmed" | "cancelled" | "completed";
  created_by: string;
  created_at: string;
  updated_at: string;
  participants?: MatchParticipant[];
}

export interface MatchParticipant {
  id: string;
  match_id: string;
  player_id: string;
  team: 1 | 2;
  confirmed: boolean;
  created_at: string;
  player?: Player;
}

export type MatchPlayerWithMatch = MatchPlayer & {
  match: Pick<Match, "scheduledAt" | "durationMinutes" | "status"> | null;
};

export type PlayerProfileWithMatchPlayers = PlayerProfile & {
  matchPlayers: MatchPlayerWithMatch[];
};

export type UserWithAllDetails = Prisma.UserGetPayload<{
  include: {
    playerProfile: {
      include: {
        matchPlayers: {
          include: {
            match: {
              select: {
                scheduledAt: true;
                durationMinutes: true;
                status: true;
              };
            };
          };
        };
      };
    };
    availabilities: true;
  };
}>;

export type MatchWithAvailabilities = Prisma.CourtGetPayload<{
  include: {
    availabilities: true;
  };
}>;

export type MatchWithPlayers = Prisma.MatchGetPayload<{
  include: {
    players: true;
  };
}>;

export type PlayerWithProfileAndAvailability = User & {
  playerProfile: PlayerProfile | null;
  availabilities: Availability[];
};
