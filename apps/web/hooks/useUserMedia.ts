import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePreferencesStore } from './usePreferencesStore'

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
    try {
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      setAccessGranted(true)
      return {
        video: true,
        audio: true,
      }
    } catch (error) {
      console.error('Error checking permission:', error)
      setAccessGranted(false)
      return {
        video: false,
        audio: false,
      }
    }
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

  const switchAudioOutput = useCallback(
    async (deviceId: string) => {
      preferences.set(deviceId, 'audioOutput')
    },
    [preferences]
  )

  const switchInput = useCallback(
    async (deviceId: string, type: 'audio' | 'video') => {
      let newStream: MediaStream
      const oldVideoTrack = activeStream?.getVideoTracks()[0]!
      const oldAudioTrack = activeStream?.getAudioTracks()[0]!

      if (type === 'audio') {
        newStream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: deviceId } },
          video: { deviceId: { exact: preferences.video } },
        })
        preferences.set(deviceId, 'audio')
      } else {
        newStream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: preferences.audio } },
          video: { deviceId: { exact: deviceId } },
        })
        preferences.set(deviceId, 'video')
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
      (device) => device.kind === 'audioinput' && !!device.deviceId
    )
  }, [devices])

  const outputDevices = useMemo(() => {
    return devices.filter(
      (device) => device.kind === 'audiooutput' && !!device.deviceId
    )
  }, [devices])

  const videoDevices = useMemo(() => {
    return devices.filter(
      (device) => device.kind === 'videoinput' && !!device.deviceId
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
      let audioOutput = preferences.audioOutput

      if (!_devices || !devices.length) {
        return
      }

      if (!audio && !video && !audioOutput) {
        audio = _devices.find((device) => device.kind === 'audioinput')
          ?.deviceId
        video = _devices.find((device) => device.kind === 'videoinput')
          ?.deviceId
        audioOutput = _devices.find((device) => device.kind === 'audiooutput')
          ?.deviceId
      }

      if (video) {
        preferences.set(video, 'video')
      }

      if (audio) {
        preferences.set(audio, 'audio')
      }

      if (audioOutput) {
        preferences.set(audioOutput, 'audioOutput')
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
    outputDevices,
    selectedAudioDevice: preferences.audio,
    selectedVideoDevice: preferences.video,
    selectedOutputDevice: preferences.audioOutput,
    ready,
    accessGranted,
    switchInput,
    stopStreaming,
    stopAllStreaming,
    toggleMute,
    toggleVideo,
    switchAudioOutput,
    muted: preferences.muted,
    videoOff: preferences.videoOff,
    checkPermission,
  }
}
