import { listUsers } from "@/actions/admin";
import { AdminUserList } from "@/components/admin/AdminUserList";

export default async function AdminPage() {
  const users = await listUsers();
  return <AdminUserList users={users} />;
}
