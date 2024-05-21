"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUserMedia } from "@/hooks/useUserMedia";
import { Card, CardContent } from "@/components/ui/card";
import { VideoPlayer } from "@/components/video-player";

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
  }, [stream]);

  return (
    <main className="flex h-full flex-col">
      <section className="align-center flex h-full place-content-center content-center justify-center">
        <div>
          <h1 className="text-[2em]">Before you start practicing, make sure to check your microphone and camera.</h1>
          <div>
            <span className="absolute inline-flex size-full rounded-full bg-green-500 px-2 py-1 opacity-90">
              Users Online: {usersOnline}
            </span>
          </div>
          <div className="flex flex-col justify-center">
            <div className="m-5 flex w-full flex-col items-center">
              <Card className="w-[500px] p-5">
                <CardContent>
                  <VideoPlayer
                    ref={videoRef}
                    audioDevices={audioDevices}
                    videoDevices={videoDevices}
                    setActiveAudioDevice={switchMic}
                    activeAudioDevice={selectedAudioDevice}
                    setActiveVideoDevice={switchVideo}
                    activeVideoDevice={selectedVideoDevice}
                  />

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
