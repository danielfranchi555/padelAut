import { Header } from "./Components/Header";
import { TabsContainer } from "./Components/TabsContainer/TabsContainer/TabsContainer";

// interface AdminDashboardProps {
//   players: Player[];
//   matches: Match[];
// }

export default async function AdminDashboard() {
  //   players: initialPlayers,
  //   matches: initialMatches,

  // const [players, setPlayers] = useState(mockPlayers);
  // const [matches, setMatches] = useState(mockMatches);
  // const activePlayersCount = players.filter((p) => p.is_active).length;

  // const todayMatches = matches.filter(
  //   (m) => m.date === new Date().toISOString().split("T")[0]
  // );

  // const avgSkillLevel =
  //   players.length > 0
  //     ? (
  //         players.reduce((sum, p) => sum + p.skill_level, 0) / players.length
  //       ).toFixed(1)
  //     : "0";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
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
