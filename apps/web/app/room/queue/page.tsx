"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUserMedia } from "@/hooks/useUserMedia";
import { Mic } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Page(): JSX.Element {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    audioDevices,
    videoDevices,
    selectedAudioDevice,
    switchVideo,
    selectedVideoDevice,
    switchMic,
    activeStream: stream,
    stopStreaming,
  } = useUserMedia();

  const [me, setMe] = useState(null);
  const [usersOnline, setUsersOnline] = useState(null);
  const [inQueue, setInQueue] = useState(false);

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
          case "usersOnline":
            setUsersOnline(data.size);
            break;
          case "roomFound":
            router.push(`/room/${data.roomId}`);
            break;
          default:
            break;
        }
      },
    },
  );

  const onConnect = useCallback(() => {
    setInQueue(!inQueue); // TODO: Replace to update the state when receive it from backend
    sendJsonMessage({ type: inQueue ? "queueExit" : "queueJoin", userId: me });
  }, [inQueue, me, sendJsonMessage]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }

    return () => {
      stopStreaming(stream!);
    };
  }, [stream, stopStreaming]);

  return (
    <main className="flex h-full flex-col">
      <section className="align-center flex h-full place-content-center content-center justify-center">
        <div>
          <h1 className="text-[2em]">Before you start practicing, make sure to check your microphone and camera.</h1>
          <h2>users online now: {usersOnline}</h2>
          <div className="flex flex-col justify-center">
            <div className="m-5 flex w-full flex-col items-center">
              <Card className="w-[500px] p-5">
                <CardContent>
                  <div className="z-10 h-[300px] w-[410px] overflow-hidden rounded-lg">
                    <video
                      className="h-[310px] w-[420px] rounded-lg [transform:rotateY(180deg)]"
                      ref={videoRef}
                      playsInline
                      autoPlay={true}
                      muted={true}
                    ></video>
                  </div>
                  <div className="mt-5 flex w-full flex-row gap-6">
                    <Select onValueChange={switchMic} value={selectedAudioDevice}>
                      <SelectTrigger className="z-10 w-[200px]">
                        <Mic size={18} /><SelectValue placeholder="Audio" />
                      </SelectTrigger>
                      <SelectContent>
                        {audioDevices.map((audio) => {
                          return (
                            <SelectItem
                              key={audio.deviceId}
                              value={audio.deviceId || audio.label}
                              className="flex flex-row items-center gap-2"
                            >
                             {audio.label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <Select onValueChange={switchVideo} value={selectedVideoDevice}>
                      <SelectTrigger className="z-10 w-[180px]">
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

                  <div className="mt-6 flex h-12 w-full items-center justify-between gap-6">
                    <h2>
                      {inQueue
                        ? "Finding a practice buddy"
                        : "Hit the 'Ready' button when you feel ready to start practicing with someone."}
                    </h2>
                    <Button onClick={onConnect} className="z-10 rounded-xl">
                      {inQueue ? "Cancel" : "I'm Ready"}
                    </Button>
                  </div>
                </CardContent>

              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
