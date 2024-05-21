import { useCallback, useEffect, useMemo, useState } from "react";
import { usePreferencesStore } from "./usePreferencesStore";

type MediaConstraints = {
  audio: string;
  video: string;
};

const streams: MediaStream[] = []

export const useUserMedia = () => {
  const preferences = usePreferencesStore();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [ready, setReady] = useState(false);

  const [accessGranted, setAccessGranted] = useState(false);

  const checkPermission = useCallback(async () => {
    const videoPermission = await navigator.permissions.query({ name: 'camera' });
    const audioPermission = await navigator.permissions.query({ name: 'microphone' });

    const permission =  {
      video: videoPermission.state === 'granted',
      audio: audioPermission.state === 'granted'
    }

    console.log({
      permission

    })
    if(permission.video && permission.audio){
      setAccessGranted(true)
    }

    return permission
  }, [setAccessGranted])


  const stopStreaming = useCallback(async (_stream?: MediaStream) => {
    if (_stream) {
      _stream?.getTracks().forEach((track) => track.stop());
    }
  }, []);

  const requestPermission = useCallback(
    async () => {
      const _stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      stopStreaming(_stream)
      checkPermission()
    },
    [stopStreaming, checkPermission],
  );

  const updateUserMedia = useCallback(
    async (constraints: MediaConstraints) => {
      const _stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: constraints.video } },
        audio: { deviceId: { exact: constraints.audio } }
      });

      console.log('UPDATE')
      setActiveStream(_stream);
      setReady(true);
      return _stream
    },
    [],
  );

  const getDevices = useCallback(async () => {
    console.log("GET DEVICES")
    const devices = await navigator.mediaDevices.enumerateDevices();
    setDevices(devices || []);
  }, [setDevices]);

  const switchMic = useCallback(
    async (deviceId: string) => {
      const oldTrack = activeStream?.getAudioTracks()[0]!;

      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId } },
        video: { deviceId: { exact: preferences.video } },
      });

      const newTrack = newStream.getAudioTracks()[0]!;


      stopStreaming(activeStream!)
      preferences.set(deviceId, 'audio')
      setActiveStream(newStream)

      return {
        oldTrack,
        newTrack,
        newStream,
      };
    },
    [preferences, stopStreaming, activeStream],
  );

  const switchVideo = useCallback(async (deviceId: string) => {
    console.log("SWITCH")
    const oldTrack = activeStream?.getVideoTracks()[0]!;

    const newStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { deviceId: { exact: deviceId } },
    });

    const newTrack = newStream.getVideoTracks()[0]!;

    stopStreaming(activeStream!)
    preferences.set(deviceId, 'video')
    setActiveStream(newStream)

    return {
      oldTrack,
      newTrack,
      newStream,
    };
  }, [stopStreaming, activeStream, preferences, stream]);


  const stopAllStreaming = useCallback(async () => {
    stream?.getTracks().forEach((track) => track.stop());
  }, [stream]);

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
    if(stream !== null && !streams.find(s => s.id === stream?.id)) {
      streams.push(stream!)
      console.log({streams})
    }

    if(activeStream !== null && !streams.find(s => s.id === activeStream?.id )) {
      streams.push(activeStream!)
      console.log({streams})
    }

  }, [stream, activeStream])

  useEffect(() => {
    const init = async () => {
      const permission = await checkPermission()

      if(!permission.audio || !permission.video) {
        requestPermission()
      }
    }

    init()
  }, [checkPermission, getDevices, requestPermission])


  useEffect(() => {
    const init = async () => {
      getDevices()
      const _stream = await updateUserMedia({
        audio: preferences.audio,
        video: preferences.video
      })

      setStream(_stream)
    }


    if(accessGranted && !stream) {
      init()
    }
  }, [preferences.audio, preferences.video, updateUserMedia, accessGranted, stream])

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
