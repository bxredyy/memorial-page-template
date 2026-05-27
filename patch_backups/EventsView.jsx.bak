"use client";

import Reveal from "./Reveal";

export default function EventsView() {
  return (
    <div className="pt-10 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-14 gap-x-16">
        <Reveal><BearersColumn /></Reveal>
        <Reveal delay={110}><OrderOfServiceColumn /></Reveal>
      </div>

      <Reveal className="divider-line my-14" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 items-center">
        <Reveal><ServiceInfo /></Reveal>
        <Reveal delay={100}><ServiceVideo /></Reveal>
      </div>
    </div>
  );
}

/* BookIllustration width reduced on small screens */
function BookIllustration({ portraits }) {
  return (
    <div className="relative w-[220px] md:w-[280px] h-[144px] mx-auto">
      <svg width="210" height="108" viewBox="0 0 210 108" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden>
        {/* SVG content unchanged */}
      </svg>

      <img src={portraits[0]} alt="" className="absolute w-9 h-9 md:w-11 md:h-11 rounded-full object-cover border-[2.5px] border-white shadow-md" style={{ top: "2px", left: "18px" }} />
      <img src={portraits[1]} alt="" className="absolute w-9 h-9 md:w-11 md:h-11 rounded-full object-cover border-[2.5px] border-white shadow-md" style={{ top: "2px", right: "18px" }} />
      <img src={portraits[2]} alt="" className="absolute w-9 h-9 md:w-11 md:h-11 rounded-full object-cover border-[2.5px] border-white shadow-md" style={{ bottom: "2px", left: "36px" }} />
      <img src={portraits[3]} alt="" className="absolute w-9 h-9 md:w-11 md:h-11 rounded-full object-cover border-[2.5px] border-white shadow-md" style={{ bottom: "2px", right: "36px" }} />
    </div>
  );
}
