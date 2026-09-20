export const images = {
  teamCollab:
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80",
  teamLaptop:
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
  ctaGlow:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1800&q=80",
} as const;

export const techIconSrc = (slug: string, color: string) =>
  `https://cdn.simpleicons.org/${slug}/${color}`;