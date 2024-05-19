import React, { forwardRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Mic } from "lucide-react";

type VideoPlayer = {
  audioDevices: MediaDeviceInfo[]
  videoDevices: MediaDeviceInfo[]
  activeAudioDevice: string,
  activeVideoDevice: string,
  setActiveAudioDevice: (deviceId: string) => void;
  setActiveVideoDevice: (deviceId: string) => void,
  muted: boolean;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayer>(({
  audioDevices,
  videoDevices,
  setActiveAudioDevice,
  activeAudioDevice,
  setActiveVideoDevice,
  activeVideoDevice,
  muted,
}, videoRef) => {
  return (
    <>
      <div className="z-10 h-[300px] w-[410px] overflow-hidden rounded-lg">
        <video
          className="h-[310px] w-[420px] rounded-lg [transform:rotateY(180deg)]"
          ref={videoRef}
          playsInline
          autoPlay={true}
          muted={muted}
        ></video>
      </div>
      <div className="mt-5 flex w-full flex-row gap-6">
        <Select onValueChange={setActiveAudioDevice} value={activeAudioDevice}>
          <SelectTrigger className="z-10 w-[200px]">
            <Mic size={18} /><SelectValue placeholder="Audio" />
          </SelectTrigger>
          <SelectContent>
            {audioDevices.map((audio) => {
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
          <SelectTrigger className="z-10 w-[180px]">
            <SelectValue placeholder="Video" />
          </SelectTrigger>
          <SelectContent>
            {videoDevices.map((video) => {
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

    </>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
