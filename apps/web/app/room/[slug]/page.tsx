"use client";

import { useEffect, useRef, useState, ReactElement, forwardRef } from "react";
import { socket } from "../../../lib/socket";
import { usePathname } from "next/navigation";
import { useUserMedia } from "@/hooks/useUserMedia";
import { Header } from "@/components/header";

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
        urls: [
          "stun:stun.stunprotocol.org",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
  });
};

export default function Page(): JSX.Element {
  const videoRef = useRef<ReactElement<HTMLVideoElement>>(null);

  const pathname = usePathname();
  const room = pathname.split("/room/")[1];

  useUserMedia(videoRef.current);

  useEffect(() => {}, []);

  return (
    <main className="flex flex-col h-full">
      <Header />
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
