import { Badge } from "@/components/ui/badge";
import { auth } from "../../../../auth";
import { Header } from "./Components/Header";
import { TabsContainer } from "./Components/TabsContainer/TabsContainer/TabsContainer";
import { BadgeCheckIcon } from "lucide-react";

// interface AdminDashboardProps {
//   players: Player[];
//   matches: Match[];
// }

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  if (session.user?.role !== "admin") {
    return <div>You are not Admin</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <p>Session User:</p>
            <Badge variant="outline" className="">
              {session.user.name}
            </Badge>{" "}
          </div>
          <div className="flex items-center gap-2">
            <p>Session Role:</p>
            <Badge
              variant="secondary"
              className="bg-blue-500 text-white dark:bg-blue-600"
            >
              <BadgeCheckIcon />
              {session.user.role}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* <ActivesPlayers
            players={players}
            activePlayersCount={activePlayersCount}
          /> */}
          {/* <TodayMatches matches={matches} todayMatches={todayMatches} /> */}
          {/* <AverageLevel avgSkillLevel={avgSkillLevel} players={players} /> */}
          {/* <TotalMatches matches={matches} /> */}
        </div>

        {/* Main Content */}
        <TabsContainer />
        {/* {editingPlayer && (
          <Dialog
            open={!!editingPlayer}
            onOpenChange={() => setEditingPlayer(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Jugador</DialogTitle>
                <DialogDescription>
                  Modifica la información del jugador
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdatePlayer(
                    editingPlayer.id,
                    new FormData(e.currentTarget)
                  );
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nombre</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingPlayer.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Teléfono</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    type="tel"
                    defaultValue={editingPlayer.phone || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-skill_level">Nivel (1-10)</Label>
                  <Select
                    name="skill_level"
                    defaultValue={editingPlayer.skill_level.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                        <SelectItem key={level} value={level.toString()}>
                          Nivel {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-is_active"
                    name="is_active"
                    defaultChecked={editingPlayer.is_active}
                  />
                  <Label htmlFor="edit-is_active">Jugador activo</Label>
                </div>
                <Button type="submit" className="w-full">
                  Actualizar Jugador
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )} */}
      </div>
    </div>
  );
}
