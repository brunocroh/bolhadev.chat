"use client"

import React, { forwardRef, useCallback, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react"
import { Button } from "./ui/button"
import clsx from "clsx"

type VideoPlayer = {
  audioDevices?: MediaDeviceInfo[]
  videoDevices?: MediaDeviceInfo[]
  activeAudioDevice?: string
  activeVideoDevice?: string
  setActiveAudioDevice?: (deviceId: string) => void
  setActiveVideoDevice?: (deviceId: string) => void
  onMute?: () => void
  onVideoOff?: () => void
  onTurnOff?: () => void
  remote?: boolean
  muted?: boolean
  videoOff?: boolean
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayer>(
  (
    {
      audioDevices,
      videoDevices,
      setActiveAudioDevice,
      activeAudioDevice,
      setActiveVideoDevice,
      activeVideoDevice,
      onMute,
      onVideoOff,
      onTurnOff,
      remote = false,
      muted = false,
      videoOff = false,
    },
    videoRef
  ) => {
    return (
      <>
        <div className="size-full m-0 min-w-[400px] max-w-[900px] overflow-hidden">
          <div className="relative flex flex-col items-center">
            <video
              className={clsx("w-full rounded-lg ", {
                "[transform:scaleX(-1)]": !remote,
              })}
              ref={videoRef}
              poster="/thumbnail.png"
              playsInline
              autoPlay={true}
              muted={!remote}
            ></video>
            {!remote && (
              <div className="absolute bottom-2 flex gap-2">
                <Button
                  onClick={onMute}
                  className="size-6 rounded-full p-3 active:scale-95"
                  variant={muted ? "destructive" : "secondary"}
                >
                  {muted ? <MicOff size={18} /> : <Mic size={18} />}
                </Button>
                <Button
                  onClick={onVideoOff}
                  className="size-6 rounded-full p-3 active:scale-95"
                  variant={videoOff ? "destructive" : "secondary"}
                >
                  {videoOff ? (
                    <VideoOff size={18} className="size-3" />
                  ) : (
                    <Video size={18} />
                  )}
                </Button>
                {onTurnOff && (
                  <Button
                    onClick={onTurnOff}
                    className="size-6 rounded-full p-3 active:scale-95"
                    variant={"destructive"}
                  >
                    <PhoneOff size={18} />
                  </Button>
                )}
              </div>
            )}
          </div>
          {!remote && (
            <div className="mt-5 flex justify-center">
              <div className="flex w-fit gap-6">
                <Select
                  onValueChange={setActiveAudioDevice}
                  value={activeAudioDevice}
                >
                  <SelectTrigger className="w-[180px]">
                    <Mic className="flex-shrink-0" size={18} />
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
                  onValueChange={setActiveVideoDevice}
                  value={activeVideoDevice}
                >
                  <SelectTrigger className="w-[180px]">
                    <Video className="flex-shrink-0" size={18} /> <SelectValue placeholder="Video" />
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

VideoPlayer.displayName = "VideoPlayer"
