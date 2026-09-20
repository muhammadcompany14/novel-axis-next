import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Technology from "@/components/Technology";
import Process from "@/components/Process";
import Why from "@/components/Why";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Contact from "@/components/Contact";
import BrandStatement from "@/components/BrandStatement";
import Footer from "@/components/Footer";
import { getProjects, getSite, getServices, getTeam, getTestimonials } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, site, services, team, testimonials] = await Promise.all([
    getProjects(),
    getSite(),
    getServices(),
    getTeam(),
    getTestimonials(),
  ]);
  return (
    <>
      <Navbar />
      <main>
        <Hero hero={site.hero} />
        <Intro />
        <Services services={services} />
        <Work projects={projects} />
        <Technology />
        <Process />
        <Why projectCount={projects.length} specialistCount={team.length} />
        <Team team={team} />
        <Testimonials testimonials={testimonials} />
        <CTA cta={site.cta} />
        <Contact
          email={site.email}
          infoText={site.contact.infoText}
          socials={site.contact.socials}
        />
        <BrandStatement />
      </main>
      <Footer footer={site.footer} email={site.email} />
    </>
  );
}