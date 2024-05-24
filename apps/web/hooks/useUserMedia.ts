import { useCallback, useEffect, useMemo, useState } from "react";
import { usePreferencesStore } from "./usePreferencesStore";

type MediaConstraints = {
  audio: string;
  video: string;
};

const streams: MediaStream[] = []

export const useUserMedia = () => {
  const preferences = usePreferencesStore();
  const [muted, setMuted] = useState<boolean>(false);
  const [videoOff, setVideoOff] = useState<boolean>(false);
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

      setActiveStream(_stream);
      setReady(true);
      return _stream
    },
    [],
  );

  const getDevices = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    setDevices(devices || []);
  }, [setDevices]);

  const toggleMute = useCallback(async () => {
    setMuted(_muted => {
        stream?.getAudioTracks().forEach(track => {
          track.enabled = _muted 
        })
        return !_muted
    })
  }, [stream, setMuted])

  const toggleVideo = useCallback(async () => {
    setVideoOff(_videoOff => {
        activeStream?.getVideoTracks().forEach(track => {
          track.enabled = _videoOff 
        })
        return !_videoOff
    })
  }, [activeStream, setVideoOff])

  const switchInput = useCallback(async (deviceId: string, type: 'audio' | 'video') => {
    let newStream: MediaStream;
    const oldVideoTrack = activeStream?.getVideoTracks()[0]!;
    const oldAudioTrack = activeStream?.getAudioTracks()[0]!;

    if(type === 'audio') {
      newStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId } },
        video: { deviceId: { exact: preferences.video } },
      });
      preferences.set(deviceId, 'audio')
    } else {
      newStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: preferences.audio } },
        video: { deviceId: { exact: deviceId }},
      });
      preferences.set(deviceId, 'video')
    }

    if(!newStream) return

    const newVideoTrack = newStream.getVideoTracks()[0]!;
    const newAudioTrack = newStream.getAudioTracks()[0]!;

    newVideoTrack.enabled = !videoOff
    newAudioTrack.enabled = !muted

    stopStreaming(activeStream!)
    setActiveStream(newStream)

    return {
      oldVideoTrack,
      newVideoTrack,
      oldAudioTrack,
      newAudioTrack,
      newStream,
    };
  }, [activeStream, preferences, stopStreaming, muted, videoOff]);


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
  }, [preferences.audio, preferences.video, updateUserMedia, accessGranted, stream, getDevices])

  return {
    stream,
    activeStream,
    audioDevices,
    videoDevices,
    selectedAudioDevice: preferences.audio,
    selectedVideoDevice: preferences.video,
    ready,
    accessGranted,
    switchInput,
    stopStreaming,
    stopAllStreaming,
    toggleMute,
    toggleVideo,
    muted,
    videoOff
  };
};
