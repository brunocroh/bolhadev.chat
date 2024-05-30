import { useCallback, useEffect, useMemo, useState } from "react"
import { usePreferencesStore } from "./usePreferencesStore"

type MediaConstraints = {
  audio?: string
  video?: string
}

export const useUserMedia = () => {
  const preferences = usePreferencesStore()
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [ready, setReady] = useState(false)

  const [accessGranted, setAccessGranted] = useState(false)

  const checkPermission = useCallback(async () => {
    const videoPermission = await navigator.permissions.query({
      name: "camera",
    })
    const audioPermission = await navigator.permissions.query({
      name: "microphone",
    })

    const permission = {
      video: videoPermission.state === "granted",
      audio: audioPermission.state === "granted",
    }

    if (permission.video && permission.audio) {
      setAccessGranted(true)
    }

    return permission
  }, [setAccessGranted])

  const stopStreaming = useCallback(async (_stream?: MediaStream) => {
    if (_stream) {
      _stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const requestPermission = useCallback(async () => {
    const _stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    stopStreaming(_stream)
    checkPermission()
  }, [stopStreaming, checkPermission])

  const updateUserMedia = useCallback(
    async (constraints: MediaConstraints) => {
      const _stream = await navigator.mediaDevices.getUserMedia({
        video: constraints.video
          ? { deviceId: { exact: constraints.video } }
          : false,
        audio: constraints.video
          ? { deviceId: { exact: constraints.audio } }
          : false,
      })

      _stream.getVideoTracks().forEach((track) => {
        track.enabled = !preferences.videoOff
      })

      _stream.getAudioTracks().forEach((track) => {
        track.enabled = !preferences.muted
      })

      setActiveStream(_stream)
      setReady(true)
      return _stream
    },
    [preferences.muted, preferences.videoOff]
  )

  const getDevices = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    setDevices(devices || [])
    return devices
  }, [setDevices])

  const toggleMute = useCallback(async () => {
    console.log({ muted: preferences.muted })
    activeStream?.getAudioTracks().forEach((track) => {
      track.enabled = preferences.muted
    })
    preferences.toggleMute()
  }, [preferences, activeStream])

  const toggleVideo = useCallback(async () => {
    activeStream?.getVideoTracks().forEach((track) => {
      track.enabled = preferences.videoOff
    })
    preferences.toggleVideoOff()
  }, [preferences, activeStream])

  const switchInput = useCallback(
    async (deviceId: string, type: "audio" | "video") => {
      let newStream: MediaStream
      const oldVideoTrack = activeStream?.getVideoTracks()[0]!
      const oldAudioTrack = activeStream?.getAudioTracks()[0]!

      if (type === "audio") {
        newStream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: deviceId } },
          video: { deviceId: { exact: preferences.video } },
        })
        preferences.set(deviceId, "audio")
      } else {
        newStream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: preferences.audio } },
          video: { deviceId: { exact: deviceId } },
        })
        preferences.set(deviceId, "video")
      }

      if (!newStream) return

      const newVideoTrack = newStream.getVideoTracks()[0]!
      const newAudioTrack = newStream.getAudioTracks()[0]!

      newVideoTrack.enabled = !preferences.videoOff
      newAudioTrack.enabled = !preferences.muted

      stopStreaming(activeStream!)
      setActiveStream(newStream)

      return {
        oldVideoTrack,
        newVideoTrack,
        oldAudioTrack,
        newAudioTrack,
        newStream,
      }
    },
    [activeStream, preferences, stopStreaming]
  )

  const stopAllStreaming = useCallback(async () => {
    stream?.getTracks().forEach((track) => track.stop())
  }, [stream])

  useEffect(() => {
    if (accessGranted) {
      getDevices()
    }
  }, [getDevices, accessGranted])

  const audioDevices = useMemo(() => {
    return devices.filter(
      (device) => device.kind === "audioinput" && !!device.deviceId
    )
  }, [devices])

  const videoDevices = useMemo(() => {
    return devices.filter(
      (device) => device.kind === "videoinput" && !!device.deviceId
    )
  }, [devices])

  useEffect(() => {
    const init = async () => {
      const permission = await checkPermission()

      if (!permission.audio || !permission.video) {
        requestPermission()
      }
    }

    init()
  }, [checkPermission, getDevices, requestPermission])

  useEffect(() => {
    const init = async () => {
      const _devices = await getDevices()

      let audio = preferences.audio
      let video = preferences.video

      if (!_devices || !devices.length) {
        return
      }

      if (!audio && !video) {
        audio = _devices.find((device) => device.kind === "audioinput")
          ?.deviceId
        video = _devices.find((device) => device.kind === "videoinput")
          ?.deviceId
      }

      if (video) {
        preferences.set(video, "video")
      }

      if (audio) {
        preferences.set(audio, "audio")
      }

      const _stream = await updateUserMedia({
        audio,
        video,
      })

      setStream(_stream)
    }

    if (accessGranted && !stream) {
      init()
    }
  }, [
    preferences.audio,
    preferences.video,
    updateUserMedia,
    accessGranted,
    stream,
    getDevices,
    devices.length,
  ])

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
    muted: preferences.muted,
    videoOff: preferences.videoOff,
    checkPermission,
  }
}
