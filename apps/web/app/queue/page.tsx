"use client";

import { useRef, ReactElement, useEffect, useState, useMemo } from "react";
import { socket } from "../../lib/socket";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

async function getDevices() {
  try {
    return await navigator.mediaDevices.enumerateDevices();
  } catch (error) {
    console.error("Error fetching devices:", error);
    return null;
  }
}

type MediaConstraints = {
  audio: string;
  video: string;
};

const initMedia = async (
  video: HTMLVideoElement,
  stream: MediaStream,
  constraints: MediaConstraints,
) => {
  console.log("MEDIA");
  stream = await navigator.mediaDevices.getUserMedia({
    video: { deviceId: { exact: constraints.video } },
    audio: { deviceId: { exact: constraints.audio } },
  });

  if (video) {
    video.srcObject = stream;
    video.play();
  }
};

export default function Page(): JSX.Element {
  const stream = useRef<MediaStream>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const [selectedAudioDevice, setSelectedAudioDevice] = useState("");
  const [selectedVideoDevice, setSelectedVideoDevice] = useState("");
  const videoRef = useRef<ReactElement<HTMLVideoElement>>(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const devices = await getDevices();
      if (!devices) return;

      setDevices(devices);

      const audioInput = devices.find((device) => device.kind === "audioinput");
      const videoInput = devices.find((device) => device.kind === "videoinput");

      if (!audioInput?.deviceId || !videoInput?.deviceId) return;

      setSelectedAudioDevice(audioInput?.deviceId);
      setSelectedVideoDevice(videoInput?.deviceId);
      initMedia(videoRef.current, stream.current, {
        audio: audioInput,
        video: audioInput,
      });
    };

    socketRef.current = socket();
    init();
  }, []);

  useEffect(() => {
    initMedia(videoRef.current, stream.current, {
      audio: selectedAudioDevice,
      video: selectedVideoDevice,
    });
  }, [selectedAudioDevice, selectedVideoDevice]);

  const audioDevices = useMemo(() => {
    return devices.filter((device) => device.kind === "audioinput");
  }, [devices]);

  const videoDevices = useMemo(() => {
    return devices.filter((device) => device.kind === "videoinput");
  }, [devices]);

  return (
    <main className="flex flex-col h-full">
      <section className="flex p-5 justify-between">
        <h1>Header</h1>
        <h1>Github</h1>
      </section>
      <section className="flex h-full place-content-center justify-center content-center align-center">
        <div>
          <h1>Estamos procurando alguém para praticar inglês contigo</h1>
          <video
            className="[transform:rotateY(180deg)] w-96 h-96"
            ref={videoRef}
            playsInline
            autoPlay={true}
            muted={true}
          ></video>
          <h2>Confira sue microfone e webcam, enquanto aguarda</h2>
          <div className="flex flex-row gap-6 w-full">
            <Select onValueChange={setSelectedAudioDevice}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Audio" />
              </SelectTrigger>
              <SelectContent>
                {audioDevices.map((audio) => {
                  return (
                    <SelectItem value={audio.deviceId}>
                      {audio.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedVideoDevice}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Video" />
              </SelectTrigger>
              <SelectContent>
                {videoDevices.map((video) => {
                  return (
                    <SelectItem value={video.deviceId}>
                      {video.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </main>
  );
}
