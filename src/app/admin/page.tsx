import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { getProjects, getSettings, getServices, getTeam, getTestimonials } from "@/lib/content";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthed())) redirect("/admin/login");
  const [projects, settings, services, team, testimonials] = await Promise.all([
    getProjects(),
    getSettings(),
    getServices(),
    getTeam(),
    getTestimonials(),
  ]);
  return (
    <AdminDashboard
      projects={projects}
      services={services}
      team={team}
      testimonials={testimonials}
      settings={settings}
    />
  );
}