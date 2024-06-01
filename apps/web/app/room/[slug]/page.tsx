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
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";

export default function Page(): JSX.Element {
  const peerRef: MutableRefObject<Peer.Instance | null> = useRef(null);
  const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const pathname = usePathname();
  const roomId = pathname.split("/room/")[1];

  const [me, setMe] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [error, setError] = useState('');

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
    'ws://localhost:4000/',
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
          case "createRoomFail":
            setError("Unable to connect to the room. Please check your network connection and try again.")
            setLoading(false)
            break
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
              setConnected(true)
              setLoading(false)
            });

            peerRef.current.on("close", () => {
              if(!error) {
                location.replace(`/room/${roomId}/feedback`);
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
    return () => {
      peerRef.current?.destroy();
    }
  },[])

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

  const handleHangUp = useCallback(async () => {
    stopAllStreaming();
    peerRef.current?.destroy();
    location.replace(`/room/${roomId}/feedback`);
  }, [roomId, stopAllStreaming]);

  const handleBackToQueue = useCallback(async () => {
    stopAllStreaming();
    peerRef.current?.destroy();
    location.replace(`/room/queue`);

  }, [stopAllStreaming])

  return (
    <section className="container flex h-full flex-col content-center items-center justify-center gap-4">
      <Countdown onFinishTime={handleHangUp} startTime={600_000} />
      <div className="flex w-full flex-col items-center ">
        <div className={clsx('flex flex-col gap-4', !error && 'invisible')}>
          <h3 className="text-lg">{error}</h3>
          <Button onClick={handleBackToQueue}>
            Back to queue
          </Button>
        </div>
        <div className={clsx(!loading && 'invisible')}>
          <h2>Loading...</h2>
        </div>
        <div className={clsx('flex gap-2 md:flex-row md:items-center', !connected && 'invisible')}>
          <Card className="border-slate-5 bg-slate-6 w-3/4 border border-b-0 md:w-1/2 ">
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
                onTurnOff={handleHangUp}
              />
            </CardContent>
          </Card>
          <Card className="border-slate-5 bg-slate-6 w-3/4 border border-b-0 md:w-1/2 md:self-start ">
            <CardContent className="h-full p-5">
              <VideoPlayer remote ref={remoteRef} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
