"use client";

import {
  useEffect,
  useRef,
  useState,
  MutableRefObject,
  useCallback,
} from "react";
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
import { Button } from "@/components/ui/button";

export default function Page(): JSX.Element {
  const peerRef: MutableRefObject<Peer.Instance | null> = useRef(null);
  const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const pathname = usePathname();
  const roomId = pathname.split("/room/")[1];

  const [me, setMe] = useState("");
  const [mute, setMute] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const {
    ready,
    accessGranted,
    stream,
    switchVideo,
    switchMic,
    selectedAudioDevice,
    selectedVideoDevice,
    audioDevices,
    videoDevices,
  } = useUserMedia();

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
        let isHost: boolean = false;

        switch (data.type) {
          case "me":
            setMe(data.id);
            break;
          case "hostCall":
            isHost = me !== data.to;
            peerRef.current = new Peer({
              initiator: isHost,
              trickle: false,
              stream: stream!,
            });

            peerRef.current?.on("stream", (remoteStream) => {
              if (remoteRef.current) {
                remoteRef.current.srcObject = remoteStream;
              }
            });

            if (isHost) {
              peerRef.current?.on("signal", (signalData) => {
                if (peerRef.current?.connected) return;

                if (signalData.type === "offer") {
                  sendJsonMessage({
                    type: "sendOffer",
                    to: data.to,
                    signal: signalData,
                    from: me,
                  });
                }
              });
            }

            break;
          case "receiveOffer":
            peerRef.current?.signal(data.signal);
            peerRef.current?.on("signal", (signalData) => {
              if (peerRef.current?.connected) return;
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
    }
  }, [stream]);

  useEffect(() => {
    if (videoReady && me) {
      sendJsonMessage({ type: "roomEnter", roomId, id: me });
    }
  }, [me, videoReady]);

  useEffect(() => {
    console.log({ stream });
  }, [stream]);

  const handleInputChange = async (
    deviceId: string,
    type: "audio" | "video",
  ) => {
    let result;

    if (type === "audio") {
      result = await switchMic(deviceId);
    } else {
      result = await switchVideo(deviceId);
    }

    peerRef.current?.replaceTrack(result.oldTrack, result.newTrack, stream!);

    if (videoRef.current) {
      videoRef.current.srcObject = result.newStream;
    }
  };

  const toggleMute = useCallback(() => {
    setMute((_mute) => !_mute);
  }, [setMute]);

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
          <div className="flex flex-col">
            <video
              className="[transform:rotateY(180deg)]"
              ref={videoRef}
              playsInline
              autoPlay={true}
              muted={true}
            ></video>
          </div>
          <div className="felx flex-col">
            <video
              ref={remoteRef}
              muted={mute}
              playsInline
              autoPlay={true}
            ></video>
            <Button onClick={toggleMute}>{mute ? "Unmute" : "Mute"}</Button>
          </div>
        </div>
        <div className="flex flex-row gap-6 w-full">
          <Select
            onValueChange={(deviceId) => handleInputChange(deviceId, "audio")}
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
            onValueChange={(deviceId) => handleInputChange(deviceId, "video")}
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
