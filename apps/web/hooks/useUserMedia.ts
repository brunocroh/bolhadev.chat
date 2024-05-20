import { useCallback, useEffect, useMemo, useState } from "react";
import { usePreferencesStore } from "./usePreferencesStore";

type MediaConstraints = {
  audio: string;
  video: string;
};

export const useUserMedia = () => {
  const preferences = usePreferencesStore();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [ready, setReady] = useState(false);

  const [accessGranted, setAccessGranted] = useState(false);


  const updateUserMedia = useCallback(
    async (constraints: MediaConstraints) => {
      const _stream = await navigator.mediaDevices.getUserMedia({
        video: constraints.video
          ? { deviceId: { exact: constraints.video } }
          : true,
        audio: constraints.audio
          ? { deviceId: { exact: constraints.audio } }
          : true,
      });

      setStream(_stream);
      setActiveStream(_stream);
      setReady(true);
    },
    [setReady],
  );

  const getDevices = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    setDevices(devices || []);
  }, []);

  const switchMic = useCallback(
    async (deviceId: string) => {
      const oldTrack = stream?.getAudioTracks()[0]!;

      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId } },
        video: { deviceId: { exact: preferences.video } },
      });

      const newTrack = newStream.getAudioTracks()[0]!;

      preferences.set(deviceId, "audio");
      setActiveStream(newStream);

      return {
        oldTrack,
        newTrack,
        newStream,
      };
    },
    [preferences, stream],
  );

  const switchVideo = useCallback(
    async (deviceId: string) => {
      const oldTrack = stream?.getVideoTracks()[0]!;

      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: preferences.audio } },
        video: { deviceId: { exact: deviceId } },
      });

      const newTrack = newStream.getVideoTracks()[0]!;

      preferences.set(deviceId, "video");
      setActiveStream(newStream);

      return {
        oldTrack,
        newTrack,
        newStream,
      };
    },
    [preferences, stream],
  );


  const stopAllStreaming = useCallback(async () => {
    stream?.getTracks().forEach((track) => track.stop());
    activeStream?.getTracks().forEach((track) => track.stop());
  }, [stream, activeStream]);

  useEffect(() => {
    if(accessGranted) {
      getDevices();
    }
  }, [getDevices, accessGranted]);

  const audioDevices = useMemo(() => {
    return devices.filter(
      (device) => device.kind === "audioinput" && !!device.deviceId,
    );
  }, [devices]);

  const videoDevices = useMemo(() => {
    return devices.filter(
      (device) => device.kind === "videoinput" && !!device.deviceId,
    )
  }, [devices]);

  useEffect(() => {
    const requestAccess = async () => {
      const _stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      _stream.getTracks().forEach(track => track.stop)
      setAccessGranted(true)
    }

    if(!accessGranted && !devices.length) {
      requestAccess()
    }
  }, [devices, accessGranted])

  useEffect(() => {
    if(accessGranted) {
      updateUserMedia({
        audio: preferences.audio || 'default',
        video: preferences.video || 'default',
      });
    }
  }, [updateUserMedia, preferences, accessGranted])

  useEffect(() => {
    const init = async () => {
      // TODO: initialize with true
      // after that identify if have access and if its true, change for default values
    };
    if(!ready) {
      init();
    }
  }, [ready, preferences, updateUserMedia, audioDevices, videoDevices]);

  const stopStreaming = useCallback(async (_stream?: MediaStream) => {
    if (_stream) {
      _stream?.getTracks().forEach((track) => track.stop());
    }
  }, []);

  return {
    stream,
    activeStream,
    audioDevices,
    videoDevices,
    selectedAudioDevice: preferences.audio,
    selectedVideoDevice: preferences.video,
    ready,
    accessGranted,
    switchVideo,
    switchMic,
    stopStreaming,
    stopAllStreaming,
  };
};
