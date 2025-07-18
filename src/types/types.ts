export interface Player {
  id: string;
  email: string;
  name: string;
  phone?: string;
  skill_level: number;
  is_admin: boolean;
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

export interface Match {
  id: string;
  date: string;
  time: string;
  court_number: number;
  status: "scheduled" | "confirmed" | "cancelled" | "completed";
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
