"use client";

import { useEffect, useRef, useState, ReactElement } from "react";
import { socket as Socket } from "../../../lib/socket";
import { usePathname, useSearchParams } from "next/navigation";
import { useUserMedia } from "@/hooks/useUserMedia";
import { Header } from "@/components/header";
import Peer from "simple-peer";
import type { Socket as SocketClient } from "socket.io-client";

let socket: SocketClient;

export default function Page(): JSX.Element {
  const videoRef = useRef<ReactElement<HTMLVideoElement>>(null);
  const remoteRef = useRef<ReactElement<HTMLVideoElement>>(null);

  const connectionRef = useRef();

  const pathname = usePathname();
  const roomId = pathname.split("/room/")[1];

  const searchParams = useSearchParams();
  const host = searchParams.get("host");

  const [me, setMe] = useState();
  const [stream, setStream] = useState();

  const { ready } = useUserMedia(videoRef.current);

  useEffect(() => {
    if (!ready) return;
    let me: string;
    let peer = new Peer({
      initiator: true,
      trickle: false,
      stream: videoRef.current.srcObject,
    });

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

    socket.on("hostCall", ({ to }) => {
      peer.on("signal", (data) => {
        if (data.type === "offer") {
          socket.emit("sendOffer", { to, signal: data, from: me });
        }
      });
    });

    socket.on("receiveOffer", ({ to, from, signal }) => {
      peer.signal(signal);
      peer.on("signal", (data) => {
        if (data.type === "answer") {
          socket.emit("sendAnswer", { to: from, signal: data });
        }
      });
    });

    socket.on("receiveAnswer", ({ signal }) => {
      console.log({ received: "receiveAnswer", signal });
      peer.signal(signal);
    });

    peer.on("stream", (remoteStream) => {
      remoteRef.current.srcObject = remoteStream;
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
