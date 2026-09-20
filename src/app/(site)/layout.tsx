import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SmoothScroll>
        {children}
        <Cursor />
      </SmoothScroll>
    </>
  );
}