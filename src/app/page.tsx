import { HeaderNav } from "@/components/HeaderNav";
import { PortfolioSection } from "@/components/PortfolioSection";
import { ContactSection } from "@/components/ContactSection";
import { InstagramSection } from "@/components/InstagramSection";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";

export default function Home() {
  return (
    <>
      <HeaderNav />
      <main>
        <PortfolioSection />
        <ContactSection />
        <InstagramSection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
