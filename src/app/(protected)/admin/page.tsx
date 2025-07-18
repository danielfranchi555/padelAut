import { auth } from "../../../../auth";
import { ButtonLogout } from "@/app/(auth)/button-LogOut/ButtonLogout";

export default async function page() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  if (session.user?.role !== "admin") {
    return <div>You are not Admin</div>;
  }

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <ButtonLogout />
    </div>
  );
}
