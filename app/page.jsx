import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import Livestream from "@/components/Livestream";
import Gallery from "@/components/Gallery";
import LifeTimeline from "@/components/LifeTimeline";
import Obituary from "@/components/Obituary";
import RememberBook from "@/components/RememberBook";
import Remembrance from "@/components/Remembrance";
import FloatingActionButton from "@/components/FloatingActionButton";

export default function Page() {
  return (
    <main className="overflow-x-hidden">
      <TopBar />
      <Hero />
      <Livestream />
      <Gallery />
      <LifeTimeline />
      <Obituary />
      <RememberBook />
      <Remembrance />
      <FloatingActionButton />
    </main>
  );
}
