"use client";

import { useEffect, useRef, useState, ReactElement } from "react";
import { socket as Socket } from "@/lib/socket";
import { usePathname } from "next/navigation";
import { useUserMedia } from "@/hooks/useUserMedia";
import { Header } from "@/components/header";
import Peer from "simple-peer";
import type { Socket as SocketClient } from "socket.io-client";

let socket: any;

export default function Page(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const pathname = usePathname();
  const roomId = pathname.split("/room/")[1];

  const [me, setMe] = useState("");

  const { ready } = useUserMedia(videoRef.current!);

  useEffect(() => {
    if (!ready || !videoRef?.current?.srcObject) return;
    let me: string;
    let peer = new Peer({
      initiator: true,
      trickle: false,
      stream: videoRef.current.srcObject as MediaStream,
    });

    if (!socket) {
      socket = Socket();
    }

    socket.on("me", (_me: any) => {
      me = _me;
      setMe(me);

      socket.emit("roomEnter", {
        roomId,
        id: me,
      });
    });

    socket.on("hostCall", ({ to }: any) => {
      peer.on("signal", (data) => {
        if (data.type === "offer") {
          socket.emit("sendOffer", { to, signal: data, from: me });
        }
      });
    });

    socket.on("receiveOffer", ({ from, signal }: any) => {
      peer.signal(signal);
      peer.on("signal", (data) => {
        if (data.type === "answer") {
          socket.emit("sendAnswer", { to: from, signal: data });
        }
      });
    });

    socket.on("receiveAnswer", ({ signal }: any) => {
      console.log({ received: "receiveAnswer", signal });
      peer.signal(signal);
    });

    peer.on("stream", (remoteStream) => {
      if (remoteRef.current) {
        remoteRef.current.srcObject = remoteStream;
      }
    });

    return () => {
      socket.off("me");
      socket.off("hostCall");
      socket.disconnect();
    };
  }, [ready]);

  return (
    <main className="flex flex-col h-full">
      <Header />
      <section
        className={"flex flex-col h-full place-content-center align-center"}
      >
        <div>
          <h1>{me}</h1>
        </div>
        <div className="flex flex-row gap-2">
          <video
            className="[transform:rotateY(180deg)]"
            ref={videoRef}
            playsInline
            autoPlay={true}
            muted={true}
          ></video>
          <video
            ref={remoteRef}
            playsInline
            autoPlay={true}
            muted={true}
          ></video>
        </div>
      </section>
    </main>
  );
}
