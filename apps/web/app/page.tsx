import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col h-full">
      <div>
        <img
          src="/light-ray.svg"
          className="absolute animate-in fade-in slide-in-from-bottom-1"
          style={{ color: "transparent", animationDuration: "5s" }}
        />
        <div className="flex flex-row w-full">
          <video
            className=""
            style={{
              display: "block",
              width: "920px",
              height: "700px",
            }}
            playsInline
            loop={true}
            autoPlay={true}
            muted={true}
            src="/earth.mp4"
          ></video>
          <div className="content-center">
            <Link href={`room/queue`}>
              <Button className="bg-red-500 min-w-max">Start a chat</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
