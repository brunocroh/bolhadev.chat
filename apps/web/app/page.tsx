import React from "react";
import Link from "next/link";
import { ChevronRight, Dumbbell, Heart, MessageCircle, PiggyBank } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InfoCard } from "./components/info-card";

const infoCardContent = [
  {
    icon: MessageCircle,
    content: 'The most effective way to improve your English is through speaking.'
  },
  {
    icon: Dumbbell,
    content: 'Enhance your English skills quickly by practicing a little every day.'
  },
  {
    icon: Heart,
    content: 'Show respect, patience, and kindness to everyone.'
  },
  {
    icon: PiggyBank,
    content: "And best of all, it's completely free."
  }
]

export default function Page(): JSX.Element {
  return (
    <main className="container flex h-full flex-col">
      <section className="flex w-full flex-row">
        <div className="flex">
          <video
            className="-z-20 w-full max-w-2xl"
            style={{
              display: "block",
              width: "700px",
              height: "500px",
            }}
            playsInline
            loop={true}
            autoPlay={true}
            muted={true}
            src="/earth.mp4"
          ></video>
        </div>
        <div className="z-10 mt-16 w-full p-10">
          <h2 className="w-full text-center text-[3rem] leading-10 text-gray-300">
            Practice english for free
          </h2>
          <h3 className="my-4 text-center text-[1rem] text-slate-400 antialiased">
            The quickest path to learning English is by speaking it regularly. Just find someone to chat with.
          </h3>
          <div className="flex w-full justify-center">
            <Link href={`room/queue`}>
              <Button className="h-12 min-w-max rounded-full text-base font-semibold text-black">
                Get Started
                <ChevronRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section className="border-slate-6 relative mt-20 flex max-w-5xl flex-col items-center rounded-3xl border-t px-6 py-12 sm:py-24 md:max-w-7xl">
        <div className="flex w-full flex-col flex-wrap items-center justify-center gap-10 md:flex-row">
          {infoCardContent.map((card, i) => <InfoCard icon={card.icon} content={card.content} key={i}/>)}
        </div>
      </section>
    </main>
  );
}
