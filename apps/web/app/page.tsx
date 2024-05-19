import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col h-full">
      <div>
        <Image
          src="/light-ray.svg"
          alt="Purple light ray"
          width="1024"
          height="800"
          className="absolute animate-in fade-in slide-in-from-bottom-1"
          style={{ color: "transparent", animationDuration: "10s" }}
        />
        <div className="flex flex-row w-full">
          <div className="flex">
            <video
              className="w-full max-w-2xl rounded-lg animation-scale-in-fade"
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
          </div>
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
