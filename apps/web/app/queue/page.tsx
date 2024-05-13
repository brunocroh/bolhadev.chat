"use client";

import {
  useRef,
  ReactElement,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { socket } from "../../lib/socket";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Socket } from "socket.io-client";

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
  constraints: MediaConstraints,
) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { deviceId: { exact: constraints.video } },
    audio: {
      deviceId: {
        exact:
          "0f481a2672954ca783c56482d03893d1f41a1ead034ed3be1523bb8ecf14d2db",
      },
    },
  });

  if (video) {
    video.srcObject = stream;
    video.play();
  }
};

let _socket: Socket = null;

export default function Page(): JSX.Element {
  const videoRef = useRef<ReactElement<HTMLVideoElement>>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState("");
  const [selectedVideoDevice, setSelectedVideoDevice] = useState("");
  const [usersOnline, setUsersOnline] = useState(null);
  const [inQueue, setInQueue] = useState(false);

  useEffect(() => {
    if (_socket == null) {
      _socket = socket();
    }

    const init = async () => {
      const devices = await getDevices();
      if (!devices) return;

      setDevices(devices);

      const audioInput = devices.find((device) => device.kind === "audioinput");
      const videoInput = devices.find((device) => device.kind === "videoinput");

      if (!audioInput?.deviceId || !videoInput?.deviceId) return;

      setSelectedAudioDevice(audioInput?.deviceId);
      setSelectedVideoDevice(videoInput?.deviceId);
      initMedia(videoRef.current, {
        audio: audioInput,
        video: audioInput,
      });
    };

    init();

    _socket.on("connect", () => {
      _socket.emit("userConnect", {
        id: _socket.id,
      });
    });

    _socket.on("newUserConnect", ({ size }) => {
      setUsersOnline(size);
    });

    _socket.on("roomFound", ({ room, roomId }) => {
      console.log({ room, roomId });
    });

    return () => {
      _socket.off("queueUpdated");
      _socket.close();
    };
  }, []);

  useEffect(() => {
    initMedia(videoRef.current, {
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

  const onConnect = useCallback(() => {
    setInQueue(!inQueue);
    _socket.emit(inQueue ? "queueExit" : "queueJoin", { id: _socket.id });
  }, [inQueue]);

  return (
    <main className="flex flex-col h-full">
      <section className="flex p-5 justify-between">
        <h1>Header</h1>
        <h1>Github</h1>
      </section>
      <section className="flex h-full place-content-center justify-center content-center align-center">
        <div>
          <h1>Estamos procurando alguém para praticar inglês contigo</h1>
          <h1>QueueSize: {usersOnline}</h1>
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
          <h2>
            {inQueue
              ? "Procurando outro usuário"
              : "Quando você estiver pronto entre em uma sala"}
          </h2>
          <Button onClick={onConnect}>
            {inQueue ? "Cancelar" : "Entrar em uma sala"}
          </Button>
        </div>
      </section>
    </main>
  );
}
