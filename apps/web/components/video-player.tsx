'use client'

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import clsx from 'clsx'
import {
  Headphones,
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
} from 'lucide-react'
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface HTMLVideoElementWithSetSinkId extends HTMLVideoElement {
  setSinkId: (sinkId: string) => Promise<void>
}

type VideoPlayer = {
  audioDevices?: MediaDeviceInfo[]
  videoDevices?: MediaDeviceInfo[]
  outputDevices?: MediaDeviceInfo[]
  activeAudioDevice?: string
  activeVideoDevice?: string
  activeOutputDevice?: string
  setActiveAudioDevice?: (deviceId: string) => void
  setActiveVideoDevice?: (deviceId: string) => void
  setActiveOutputDevice?: (deviceId: string) => void
  onMute?: () => void
  onVideoOff?: () => void
  onTurnOff?: () => void
  remote?: boolean
  muted?: boolean
  videoOff?: boolean
}

export const VideoPlayer = forwardRef<
  HTMLVideoElementWithSetSinkId,
  VideoPlayer
>(
  (
    {
      audioDevices,
      videoDevices,
      outputDevices,
      setActiveAudioDevice,
      activeAudioDevice,
      setActiveVideoDevice,
      activeVideoDevice,
      setActiveOutputDevice,
      activeOutputDevice,
      onMute,
      onVideoOff,
      onTurnOff,
      remote = false,
      muted = false,
      videoOff = false,
    },
    videoRef
  ) => {
    const localVideoRef = useRef<HTMLVideoElementWithSetSinkId | null>(null)
    useImperativeHandle(
      videoRef,
      () => localVideoRef.current as HTMLVideoElement
    )

    useEffect(() => {
      if (!remote) return

      const videoElement = localVideoRef?.current

      if (
        videoElement &&
        videoElement?.setSinkId !== undefined &&
        activeOutputDevice
      ) {
        videoElement
          .setSinkId(activeOutputDevice)
          .then(() => {
            console.log(
              `Success, audio output device attached: ${activeOutputDevice}`
            )
          })
          .catch((error: any) => {
            console.error(`Error: ${error.name}`)
          })
      }
    }, [activeOutputDevice, remote])

    return (
      <>
        <div className="m-0 size-full w-full max-w-[900px] overflow-hidden">
          <div className="relative flex flex-col items-center">
            <video
              className={clsx('w-full rounded-lg ', {
                '[transform:scaleX(-1)]': !remote,
              })}
              ref={localVideoRef}
              poster="/thumbnail.png"
              playsInline
              autoPlay={true}
              muted={!remote}
              id={remote ? 'remote' : 'local'}
            ></video>
            {!remote && (
              <div className="absolute bottom-2 flex gap-2">
                <Button
                  onClick={onMute}
                  className="size-10 rounded-full p-1 active:scale-95"
                  variant={muted ? 'destructive' : 'secondary'}
                >
                  {muted ? <MicOff size={18} /> : <Mic size={18} />}
                </Button>
                <Button
                  onClick={onVideoOff}
                  className="size-10 rounded-full p-1 active:scale-95"
                  variant={videoOff ? 'destructive' : 'secondary'}
                >
                  {videoOff ? <VideoOff size={18} /> : <Video size={18} />}
                </Button>
                {onTurnOff && (
                  <Button
                    onClick={onTurnOff}
                    className="size-10 rounded-full p-1 active:scale-95"
                    variant={'destructive'}
                  >
                    <PhoneOff size={18} />
                  </Button>
                )}
              </div>
            )}
          </div>
          {!remote && (
            <div className="mt-5 flex justify-center">
              <div className="flex w-full flex-col gap-2 sm:flex-row md:w-fit md:gap-6">
                <Select
                  onValueChange={setActiveAudioDevice}
                  value={activeAudioDevice}
                >
                  <SelectTrigger className="w-full sm:max-w-48">
                    <Mic className="shrink-0" size={18} />
                    <SelectValue placeholder="Audio" />
                  </SelectTrigger>
                  <SelectContent>
                    {audioDevices?.map((audio) => {
                      return (
                        <SelectItem
                          key={audio.deviceId}
                          value={audio.deviceId || audio.label}
                          className="flex flex-row items-center gap-2"
                        >
                          {audio.label}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={setActiveOutputDevice}
                  value={activeOutputDevice}
                >
                  <SelectTrigger className="w-full sm:max-w-48">
                    <Headphones className="shrink-0" size={18} />{' '}
                    <SelectValue placeholder="Output Device" />
                  </SelectTrigger>
                  <SelectContent>
                    {outputDevices?.map((outputDevice) => {
                      return (
                        <SelectItem
                          key={outputDevice.deviceId}
                          value={outputDevice.deviceId || outputDevice.label}
                        >
                          {outputDevice.label}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={setActiveVideoDevice}
                  value={activeVideoDevice}
                >
                  <SelectTrigger className="w-full sm:max-w-48">
                    <Video className="shrink-0" size={18} />{' '}
                    <SelectValue placeholder="Video" />
                  </SelectTrigger>
                  <SelectContent>
                    {videoDevices?.map((video) => {
                      return (
                        <SelectItem
                          key={video.deviceId}
                          value={video.deviceId || video.label}
                        >
                          {video.label}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </>
    )
  }
)

VideoPlayer.displayName = 'VideoPlayer'
