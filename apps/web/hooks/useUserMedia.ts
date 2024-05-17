import { useCallback, useEffect, useMemo, useState } from "react";

type MediaConstraints = {
  audio: string;
  video: string;
};

export const useUserMedia = (video: HTMLVideoElement) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState("");
  const [selectedVideoDevice, setSelectedVideoDevice] = useState("");
  const [ready, setReady] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const updateUserMedia = useCallback(
    async (video: HTMLVideoElement, constraints: MediaConstraints) => {
      let _video = false;

      if (constraints.video !== "off") {
        _video = constraints.video
          ? { deviceId: { exact: constraints.video } }
          : true;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: _video,
        audio: constraints.audio
          ? { deviceId: { exact: constraints.audio } }
          : true,
      });

      if (video) {
        video.srcObject = stream;
        video.play();
        setAccessGranted(true);
      }

      setReady(true);
    },
    [setReady],
  );

  const getDevices = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    setDevices(devices || []);
  }, []);

  useEffect(() => {
    console.log("fetchDevices");
    getDevices();
  }, [accessGranted]);

  useEffect(() => {
    const init = async () => {
      updateUserMedia(video, {
        audio: "",
        video: "",
      });
    };

    init();
  }, []);

  useEffect(() => {
    if (!selectedAudioDevice || !selectedAudioDevice) return;
    updateUserMedia(video, {
      audio: selectedAudioDevice,
      video: selectedVideoDevice,
    });
  }, [selectedAudioDevice, selectedVideoDevice]);

  const audioDevices = useMemo(() => {
    return devices.filter(
      (device) => device.kind === "audioinput" && !!device.deviceId,
    );
  }, [devices]);

  const videoDevices = useMemo(() => {
    return [
      {
        kind: "videoinput",
        label: "Desligado",
        deviceId: "off",
      },
    ].concat(
      devices.filter(
        (device) => device.kind === "videoinput" && !!device.deviceId,
      ),
    );
  }, [devices]);

  return {
    audioDevices,
    videoDevices,
    selectedAudioDevice,
    setSelectedAudioDevice,
    selectedVideoDevice,
    setSelectedVideoDevice,
    ready,
    accessGranted,
  };
};
