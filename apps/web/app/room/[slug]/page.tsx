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
    return () => {
      peerRef.current?.destroy();
      peerRef.current = null;
      stopAllStreaming();
    };
  }, [stopAllStreaming]);

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
  }, [me, videoReady, roomId, sendJsonMessage]);

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

  const handleFinishCall = useCallback(async () => {
    stopAllStreaming();
    peerRef.current?.destroy();
    location.replace(`${roomId}/feedback`);
  }, [stopAllStreaming, roomId]);

  const toggleMute = useCallback(() => {
    setMute((_mute) => !_mute);
  }, [setMute]);

  return (
    <main className="flex h-full flex-col">
      <section
        className={"align-center flex h-full flex-col place-content-center"}
      >
        <div>
          <h1>{me}</h1>
          <h1>READY: {ready ? "ready" : "not Ready"}</h1>
          <h1>ACCESS: {accessGranted ? "false" : "true"}</h1>
        </div>
        <div className="flex flex-row gap-2">
          <Card>
            <CardContent className="p-5">
              <VideoPlayer
                ref={videoRef}
                activeAudioDevice={selectedAudioDevice}
                setActiveAudioDevice={(deviceId) => handleInputChange(deviceId, 'audio') }
                activeVideoDevice={selectedVideoDevice}
                setActiveVideoDevice={(deviceId) => handleInputChange(deviceId, 'video') }
                muted={true}
                audioDevices={audioDevices}
                videoDevices={videoDevices}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <VideoPlayer
                ref={remoteRef}
                activeAudioDevice={selectedAudioDevice}
                setActiveAudioDevice={(deviceId) => handleInputChange(deviceId, 'audio') }
                activeVideoDevice={selectedVideoDevice}
                setActiveVideoDevice={(deviceId) => handleInputChange(deviceId, 'video') }
                muted={true}
                audioDevices={audioDevices}
                videoDevices={videoDevices}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
