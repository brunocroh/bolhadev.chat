import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Page(): JSX.Element {
  return (
    <main className="flex h-full flex-col">
      <div>
        <div className="flex w-full flex-row">
          <div className="flex">
            <video
              className="-z-20 w-full max-w-5xl"
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
        </div>
      </div>
    </main>
  );
}
