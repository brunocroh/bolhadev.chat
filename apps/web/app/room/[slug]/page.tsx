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
import Peer from "simple-peer";
import useWebSocket from "react-use-websocket";
import { Card, CardContent } from "@/components/ui/card";
import { VideoPlayer } from "@/components/video-player";
import Countdown from "@/components/countdown";

export default function Page(): JSX.Element {
  const peerRef: MutableRefObject<Peer.Instance | null> = useRef(null);
  const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const pathname = usePathname();
  const roomId = pathname.split("/room/")[1];

  const [me, setMe] = useState("");
  const [videoReady, setVideoReady] = useState(false);

  const {
    muted,
    toggleMute,
    toggleVideo,
    videoOff,
    stream,
    activeStream,
    selectedAudioDevice,
    selectedVideoDevice,
    audioDevices,
    videoDevices,
    switchInput,
    stopAllStreaming,
  } = useUserMedia();

  const { sendJsonMessage, getWebSocket } = useWebSocket(
    process.env.NEXT_PUBLIC_SOCKET_URL!,
    {
      onOpen: () => {
        sendJsonMessage({
          type: "me",
        });
      },
      onClose: () => {
        console.log("websocket disconnected");
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

            peerRef.current.on("connect", () => {
              const ws = getWebSocket();
              if (ws) {
                ws.close();
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
    if (videoRef.current && activeStream) {
      videoRef.current.srcObject = activeStream;
      videoRef.current.play();

      setVideoReady(true);
    }
  }, [activeStream, videoReady]);

  useEffect(() => {
    if (videoReady && me) {
      sendJsonMessage({ type: "roomEnter", roomId, id: me });
    }
  }, [me, videoReady, roomId, sendJsonMessage]);

 const handleInputChange = async (
    deviceId: string,
    type: "audio" | "video",
  ) => {

    const result = await switchInput(deviceId, type)
    peerRef.current?.replaceTrack(result?.oldVideoTrack!, result?.newVideoTrack!, stream!);
    peerRef.current?.replaceTrack(result?.oldAudioTrack!, result?.newAudioTrack!, stream!);
  };

  const handleFinishCall = useCallback(async () => {
    stopAllStreaming();
    peerRef.current?.destroy();
    location.replace(`${roomId}/feedback`);
  }, [stopAllStreaming, roomId]);

  return (
    <section className="container flex h-full flex-col content-center items-center justify-center gap-4">
      <Countdown onFinishTime={handleFinishCall} startTime={600_000} />
      <div className="flex w-full items-center ">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Card className="md:w-1/2 ">
            <CardContent className="p-5">
              <VideoPlayer
                ref={videoRef}
                activeAudioDevice={selectedAudioDevice}
                setActiveAudioDevice={(deviceId) => handleInputChange(deviceId, 'audio') }
                activeVideoDevice={selectedVideoDevice}
                setActiveVideoDevice={(deviceId) => handleInputChange(deviceId, 'video') }
                audioDevices={audioDevices}
                videoDevices={videoDevices}
                muted={muted}
                videoOff={videoOff}
                onMute={toggleMute}
                onVideoOff={toggleVideo}
                onTurnOff={handleFinishCall}
              />
            </CardContent>
          </Card>
          <Card className="md:w-1/2 md:self-start">
            <CardContent className="h-full p-5">
              <VideoPlayer remote ref={remoteRef} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
