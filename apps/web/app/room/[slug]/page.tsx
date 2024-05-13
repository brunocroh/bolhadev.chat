"use client";

import { useEffect, useRef, useState, ReactElement, forwardRef } from "react";
import { socket as Socket } from "../../../lib/socket";
import { usePathname, useSearchParams } from "next/navigation";
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

let socket: Socket;

export default function Page(): JSX.Element {
  const pathname = usePathname();
  const roomId = pathname.split("/room/")[1];

  const searchParams = useSearchParams();
  const host = searchParams.get("host");
  const videoRef = useRef<ReactElement<HTMLVideoElement>>(null);

  const [stream, setStream] = useState();
  const [me, setMe] = useState();

  useUserMedia(videoRef.current);

  useEffect(() => {
    let me;
    if (!socket) {
      socket = Socket();
    }

    socket.on("me", (_me) => {
      me = _me;
      setMe(me);

      socket.emit("roomEnter", {
        roomId,
        id: me,
      });
    });

    return () => {
      socket.off("me");
    };
  }, []);

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
