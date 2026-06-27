import { MemorialProvider } from "./MemorialContext";
import TopBar from "./TopBar";
import Hero from "./Hero";
import Livestream from "./Livestream";
import Gallery from "./Gallery";
import LifeTimeline from "./LifeTimeline";
import Obituary from "./Obituary";
import RememberBook from "./RememberBook";
import Remembrance from "./Remembrance";
import FloatingActionButton from "./FloatingActionButton";

/** Renders a complete memorial page from a hydrated memorial record. */
export default function MemorialView({ memorial }) {
  return (
    <MemorialProvider memorial={memorial}>
      <main className="overflow-x-clip">
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
    </MemorialProvider>
  );
}
