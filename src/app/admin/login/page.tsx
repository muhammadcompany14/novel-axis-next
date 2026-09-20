import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAuthed()) redirect("/admin");
  return <AdminLoginForm />;
}