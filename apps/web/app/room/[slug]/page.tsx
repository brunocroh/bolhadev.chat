"use client";

import { useEffect, useRef, useState, ReactElement, forwardRef } from "react";
import { socket } from "../../../lib/socket";
import { usePathname } from "next/navigation";

type UserProps = {
  id: string;
  muted?: boolean;
  isHost: boolean;
};

let stream: MediaStream;
const RemoteUser = forwardRef(
  ({ id, isHost, muted = true }: UserProps, ref) => {
    const _socket = ref;
    const remoteRef = useRef(null);
    const [isInit, setIsInit] = useState(false);

    useEffect(() => {
      let peer;
      const initStream = async () => {
        if (isInit) return;
        if (typeof window !== "undefined") {
          peer = createPeerConnection();
          stream.getTracks().forEach((track) => peer.addTrack(track, stream));

          peer.addEventListener("track", gotRemoteStream);
          peer.onicecandidate = onIceCandidateEvent;
        }

        const localPeerOffer = await peer.createOffer();
        await peer.setLocalDescription(
          new RTCSessionDescription(localPeerOffer),
        );

        _socket.emit("mediaOffer", {
          offer: localPeerOffer,
          from: _socket.id,
          to: id,
        });

        setIsInit(true);

        _socket.on("mediaOffer", onMediaOffer);
        _socket.on("mediaAnswer", onMediaAnswer);
        _socket.on("remotePeerIceCandidate", onRemotePeerIceCandidate);
      };

      const onMediaOffer = async (data) => {
        if (data.from === id) {
          await peer.setRemoteDescription(
            new RTCSessionDescription(data.offer),
          );
          const peerAnswer = await peer.createAnswer();
          await peer.setLocalDescription(new RTCSessionDescription(peerAnswer));

          _socket.emit("mediaAnswer", {
            answer: peerAnswer,
            from: _socket.id,
            to: data.from,
          });
        }
      };

      const onMediaAnswer = async (data) => {
        if (data.from === id) {
          await peer.setRemoteDescription(
            new RTCSessionDescription(data.answer),
          );
        }
      };

      const onIceCandidateEvent = (event) => {
        if (event.candidate) {
          _socket.emit("iceCandidate", {
            to: id,
            candidate: event.candidate,
          });
        }
      };

      const gotRemoteStream = (event) => {
        console.log("gotRemoteStream + ", id);
        const [remoteStream] = event.streams;
        if (remoteRef.current) {
          remoteRef.current.srcObject = remoteStream;
        }
      };

      const onRemotePeerIceCandidate = async (data) => {
        if (data.from === id) {
          const candidate = new RTCIceCandidate(data.candidate);
          await peer.addIceCandidate(candidate);
        }
      };

      initStream();

      return () => {
        _socket.off("mediaOffer", onMediaOffer);
        _socket.off("mediaAnswer", onMediaAnswer);
        _socket.off("remotePeerIceCandidate", onRemotePeerIceCandidate);
      };
    }, []);

    return (
      <div key={id}>
        <video
          ref={remoteRef}
          playsInline
          autoPlay={true}
          muted={muted}
        ></video>
      </div>
    );
  },
);

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
  const socketRef = useRef(null);
  const pathname = usePathname();
  const room = pathname.split("/room/")[1];
  const videoRef = useRef<ReactElement<HTMLVideoElement>>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [isHost, setIsHost] = useState<boolean>(true);

  useEffect(() => {
    socketRef.current = socket();
    const initMedia = async () => {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsConnected(true);
    };

    async function onConnect() {
      setIsConnected(true);
      await initMedia();
      socketRef.current.emit("enterRoom", { room });
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    async function onRoomDetails(payload) {
      const users = payload.room.users.filter(
        (id) => id !== socketRef.current.id,
      );

      if (payload.room.host !== socketRef.current.id) {
        setIsHost(false);
      }

      if (users.length > 0) {
        setConnectedUsers([...users]);
        return;
      }
    }

    socketRef.current.on("connect", onConnect);
    socketRef.current.on("disconnect", onDisconnect);
    socketRef.current.on("roomDetails", onRoomDetails);

    return () => {
      socketRef.current.off("connect", onConnect);
      socketRef.current.off("disconnect", onDisconnect);
      socketRef.current.off("roomDetails", onRoomDetails);
      socketRef.current.disconnect();
      setIsConnected(false);
    };
  }, []);

  if (!isConnected) return null;

  console.log({ isHost, connectedUsers });

  return (
    <main className="flex flex-col h-full">
      <section className="flex p-5 justify-between">
        <h1>Header</h1>
        <h1>Github</h1>
      </section>
      <section
        className={`flex h-full place-content-center align-center ${
          isConnected ? "bg-green-500" : "bg-red-500"
        }`}
      >
        <div>
          <video
            className="[transform:rotateY(180deg)]"
            ref={videoRef}
            playsInline
            autoPlay={true}
            muted={true}
          ></video>

          {connectedUsers.map((id) => (
            <RemoteUser
              ref={socketRef.current}
              isHost={isHost}
              key={id}
              id={id}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
