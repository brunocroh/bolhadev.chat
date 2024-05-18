import { useCallback, useEffect, useMemo, useState } from "react";

type MediaConstraints = {
  audio: string;
  video: string;
};

export const useUserMedia = (video: HTMLVideoElement) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState("");
  const [selectedVideoDevice, setSelectedVideoDevice] = useState("");
  const [ready, setReady] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const updateUserMedia = useCallback(
    async (constraints: MediaConstraints) => {
      let _video: MediaTrackConstraints | boolean = false;

      if (constraints.video !== "off") {
        _video = constraints.video
          ? { deviceId: { exact: constraints.video } }
          : true;
      }

      const _stream = await navigator.mediaDevices.getUserMedia({
        video: _video,
        audio: constraints.audio
          ? { deviceId: { exact: constraints.audio } }
          : true,
      });

      setStream(_stream);
      setAccessGranted(true);
      setReady(true);
    },
    [setReady],
  );

  const getDevices = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    setDevices(devices || []);
  }, []);

  const switchMic = async (deviceId: string) => {
    const oldTrack = stream?.getAudioTracks()[0]!;

    const tempStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: { exact: deviceId } },
      video: false,
    });

    const newTrack = tempStream.getAudioTracks()[0]!;

    const newStream = new MediaStream([
      newTrack,
      ...(stream?.getVideoTracks() || []),
    ]);

    return {
      oldTrack,
      newTrack,
      newStream,
    };
  };

  const switchVideo = async (deviceId: string) => {
    const oldTrack = stream?.getVideoTracks()[0]!;

    const tempStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { deviceId: { exact: deviceId } },
    });

    const newTrack = tempStream.getVideoTracks()[0]!;

    const newStream = new MediaStream([
      newTrack,
      ...(stream?.getAudioTracks() || []),
    ]);

    return {
      oldTrack,
      newTrack,
      newStream,
    };
  };

  useEffect(() => {
    getDevices();
  }, [accessGranted]);

  useEffect(() => {
    const init = async () => {
      updateUserMedia({
        audio: "",
        video: "",
      });
    };

    init();
  }, []);

  useEffect(() => {
    if (!selectedAudioDevice || !selectedAudioDevice) return;
    updateUserMedia({
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
    stream,
    switchVideo,
    switchMic,
  };
};
