"use client"

import React, { forwardRef, useCallback, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Mic, Video } from "lucide-react";
import { Button } from "./ui/button";
import clsx from "clsx";

type VideoPlayer = {
  audioDevices?: MediaDeviceInfo[]
  videoDevices?: MediaDeviceInfo[]
  activeAudioDevice?: string,
  activeVideoDevice?: string,
  setActiveAudioDevice?: (deviceId: string) => void;
  setActiveVideoDevice?: (deviceId: string) => void,
  remote?: boolean
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayer>(({
  audioDevices,
  videoDevices,
  setActiveAudioDevice,
  activeAudioDevice,
  setActiveVideoDevice,
  activeVideoDevice,
  remote = false,
}, videoRef) => {
    return (
      <>
        <div className="m-0 size-full min-w-[400px] max-w-[900px] overflow-hidden">
          <video
            className={clsx("rounded-lg w-full ", { '[transform:scaleX(-1)]': !remote})}
            ref={videoRef}
            poster="/thumbnail.png"
            playsInline
            autoPlay={true}
            muted={!remote}
          ></video>
        {!remote && (
            <div className="mt-5 flex justify-center">
              <div className="flex w-fit gap-6">
                <Select onValueChange={setActiveAudioDevice} value={activeAudioDevice}>
                  <SelectTrigger className="w-[200px]">
                    <Mic size={18} /><SelectValue placeholder="Audio" />
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
                      );
                    })}
                  </SelectContent>
                </Select>
                <Select onValueChange={setActiveVideoDevice} value={activeVideoDevice}>
                  <SelectTrigger className="w-[180px]">
                    <Video size={18} /> <SelectValue placeholder="Video" />
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
                      );
                    })}
                  </SelectContent>
                </Select>

              </div>
            </div>
          )}
        </div>
      </>
    );
  });

VideoPlayer.displayName = 'VideoPlayer';
