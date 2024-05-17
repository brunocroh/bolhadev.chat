"use client";

import {
  useEffect,
  useRef,
  useState,
  ReactElement,
  MutableRefObject,
} from "react";
import { socket as Socket } from "@/lib/socket";
import { usePathname } from "next/navigation";
import { useUserMedia } from "@/hooks/useUserMedia";
import { Header } from "@/components/header";
import Peer from "simple-peer";
import useWebSocket from "react-use-websocket";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic } from "lucide-react";

let socket: any;

export default function Page(): JSX.Element {
  const peerRef: MutableRefObject<Peer.Instance | null> = useRef(null);
  const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const pathname = usePathname();
  const roomId = pathname.split("/room/")[1];

  const [me, setMe] = useState("");
  const [videoReady, setVideoReady] = useState(false);

  const {
    ready,
    accessGranted,
    stream,
    setSelectedAudioDevice,
    setSelectedVideoDevice,
    selectedAudioDevice,
    selectedVideoDevice,
    audioDevices,
    videoDevices,
  } = useUserMedia(videoRef.current!);

  const { sendJsonMessage } = useWebSocket(
    process.env.NEXT_PUBLIC_SOCKET_URL!,
    {
      onOpen: () => {
        sendJsonMessage({
          type: "me",
        });
      },
      onMessage: (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "me":
            setMe(data.id);
            break;
          case "hostCall":
            peerRef.current = new Peer({
              initiator: true,
              trickle: false,
              stream: videoRef.current?.srcObject as MediaStream,
            });

            peerRef.current?.on("signal", (signalData) => {
              if (signalData.type === "offer") {
                sendJsonMessage({
                  type: "sendOffer",
                  to: data.to,
                  signal: signalData,
                  from: me,
                });
              }
            });
            break;
          case "receiveOffer":
            console.log("receiveOffer");
            peerRef.current?.signal(data.signal);
            peerRef.current?.on("signal", (signalData) => {
              if (signalData.type === "answer") {
                sendJsonMessage({
                  type: "sendAnswer",
                  to: data.from,
                  signal: signalData,
                });
              }
            });
            break;
          case "receiveAnswer":
            console.log("receiveAnswer");
            peerRef.current?.signal(data.signal);
            break;
          default:
            break;
        }
      },
    },
  );

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      setVideoReady(true);

      peerRef.current = new Peer({
        initiator: false,
        trickle: false,
        stream: videoRef.current.srcObject as MediaStream,
      });

      peerRef.current?.on("stream", (remoteStream) => {
        if (remoteRef.current) {
          remoteRef.current.srcObject = remoteStream;
        }
      });
    }
  }, [stream]);

  useEffect(() => {
    if (videoReady && me) {
      sendJsonMessage({ type: "roomEnter", roomId, id: me });
    }
  }, [me, videoReady]);

  return (
    <main className="flex flex-col h-full">
      <Header />
      <section
        className={"flex flex-col h-full place-content-center align-center"}
      >
        <div>
          <h1>{me}</h1>
          <h1>READY: {ready ? "ready" : "not Ready"}</h1>
          <h1>ACCESS: {accessGranted ? "false" : "true"}</h1>
        </div>
        <div className="flex flex-row gap-2">
          <video
            className="[transform:rotateY(180deg)]"
            ref={videoRef}
            playsInline
            autoPlay={true}
            muted={true}
          ></video>
          <video ref={remoteRef} playsInline autoPlay={true}></video>
        </div>
        <div className="flex flex-row gap-6 w-full">
          <Select
            onValueChange={setSelectedAudioDevice}
            value={selectedAudioDevice}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Audio" />
            </SelectTrigger>
            <SelectContent>
              {audioDevices.map((audio) => {
                return (
                  <SelectItem
                    key={audio.deviceId}
                    value={audio.deviceId || audio.label}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <Mic size={12} /> {audio.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Select
            onValueChange={setSelectedVideoDevice}
            value={selectedVideoDevice}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Video" />
            </SelectTrigger>
            <SelectContent>
              {videoDevices.map((video) => {
                return (
                  <SelectItem
                    key={video.deviceId}
                    value={video.deviceId || video.label}
                  >
                    {video.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </section>
    </main>
  );
}
