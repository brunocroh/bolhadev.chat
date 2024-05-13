"use client";

import { useEffect, useRef, useState, ReactElement, forwardRef } from "react";
import { socket } from "../../../lib/socket";
import { usePathname } from "next/navigation";
import { useUserMedia } from "@/hooks/useUserMedia";

type UserProps = {
  id: string;
  muted?: boolean;
  isHost: boolean;
};

let stream: MediaStream;

const createPeerConnection = () => {
  return new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.stunprotocol.org",
      },
    ],
  });
};

export default function Page(): JSX.Element {
  const videoRef = useRef<ReactElement<HTMLVideoElement>>(null);

  const pathname = usePathname();
  const room = pathname.split("/room/")[1];

  const result = useUserMedia(videoRef.current);

  useEffect(() => {}, []);

  return (
    <main className="flex flex-col h-full">
      <section className="flex p-5 justify-between">
        <h1>Header</h1>
        <h1>Github</h1>
      </section>
      <section className={"flex h-full place-content-center align-center"}>
        <div>
          <video
            className="[transform:rotateY(180deg)]"
            ref={videoRef}
            playsInline
            autoPlay={true}
            muted={true}
          ></video>
        </div>
      </section>
    </main>
  );
}
