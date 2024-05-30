import React from "react"
import Link from "next/link"

import {
  ChevronRight,
  Dumbbell,
  Heart,
  MessageCircle,
  PiggyBank,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { InfoCard } from "./components/info-card"

const infoCardContent = [
  {
    icon: MessageCircle,
    content:
      "The most effective way to improve your English is through speaking.",
  },
  {
    icon: Dumbbell,
    content:
      "Enhance your English skills quickly by practicing a little every day.",
  },
  {
    icon: Heart,
    content: "Show respect, patience, and kindness to everyone.",
  },
  {
    icon: PiggyBank,
    content: "And best of all, it's completely free.",
  },
]

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col">
      <section className="flex w-full flex-col lg:container lg:flex-row-reverse">
        <div className="z-10 mt-16 flex w-full flex-col justify-center p-10 lg:w-1/2">
          <h2 className="text-slate-6 w-full text-center text-[3rem] leading-10">
            Practice English for free
          </h2>
          <h3 className="my-4 text-center text-[1rem] text-slate-400">
            The quickest path to learning English is to speak it regularly. Just
            find someone to chat with.
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
        <div className="flex w-full justify-center overflow-hidden lg:w-1/2">
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
      </section>
      <section
        style={{boxShadow: "0px -20px 44px -60px rgb(255 255 255)"}}
        className="border-slate-6 relative mt-10 flex flex-col items-center overflow-hidden rounded-3xl border-t px-6 py-12 lg:container sm:mx-5 sm:py-24 md:mx-10 lg:mx-auto">
        <div
          aria-hidden="true"
          className="center pointer-events-none absolute -top-1 left-1/2 -z-20 h-[200px] w-full max-w-[200px] -translate-x-1/2 -translate-y-1/2 md:max-w-[400px]"
          style={{
            background:
              "conic-gradient(from 90deg at 50% 50%, #00000000 50%, #000 50%),radial-gradient(rgba(200,200,200,0.1) 0%, transparent 80%)",
          }}
        />
        <div className="mt-10 flex w-full flex-col flex-wrap items-center justify-center gap-10 md:flex-row">
          {infoCardContent.map((card, i) => (
            <InfoCard icon={card.icon} content={card.content} key={i} />
          ))}
        </div>
      </section>
    </main>
  )
}
