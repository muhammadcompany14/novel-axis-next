import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact — Novel Axis Solutions",
  description:
    "Tell Novel Axis Solutions what you're building — Shopify ecosystems, websites, applications, and digital products. We respond within two business days.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const site = await getSite();

  return (
    <>
      <Navbar />
      <main>
        <Contact
          email={site.email}
          phone={site.phone}
          infoText={site.contact.infoText}
          socials={site.contact.socials}
        />
      </main>
      <Footer footer={site.footer} email={site.email} />
    </>
  );
}