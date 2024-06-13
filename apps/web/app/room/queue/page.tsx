'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { VideoPlayer } from '@/components/video-player'
import { useUserMedia } from '@/hooks/useUserMedia'
import { env } from '@repo/env-config'

export default function Page(): JSX.Element {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)

  const {
    audioDevices,
    videoDevices,
    outputDevices,
    selectedAudioDevice,
    selectedVideoDevice,
    selectedOutputDevice,
    switchInput,
    activeStream: stream,
    stopAllStreaming,
    videoOff,
    muted,
    toggleMute,
    toggleVideo,
    accessGranted,
    switchAudioOutput,
  } = useUserMedia()

  const [me, setMe] = useState(null)
  const [usersOnline, setUsersOnline] = useState(null)
  const [inQueue, setInQueue] = useState(false)

  const { sendJsonMessage } = useWebSocket(env.NEXT_PUBLIC_SOCKET_URL!, {
    onOpen: () => {
      sendJsonMessage({
        type: 'me',
      })
    },
    onMessage: (event) => {
      const data = JSON.parse(event.data)

      switch (data.type) {
        case 'me':
          setMe(data.id)
          break
        case 'usersOnline':
          setUsersOnline(data.size)
          break
        case 'roomFound':
          router.push(`/room/${data.roomId}`)
          break
        default:
          break
      }
    },
  })

  const onConnect = useCallback(() => {
    setInQueue(!inQueue) // TODO: Replace to update the state when receive it from backend
    sendJsonMessage({ type: inQueue ? 'queueExit' : 'queueJoin', userId: me })
  }, [inQueue, me, sendJsonMessage])

  const onInputChange = useCallback(
    (deviceId: string, type: 'audio' | 'video') => {
      switchInput(deviceId, type)
    },
    [switchInput]
  )

  const onAudioOutputChange = useCallback(
    (deviceId: string) => {
      switchAudioOutput(deviceId)
    },
    [switchAudioOutput]
  )

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      videoRef.current.play()
    }
  }, [stream])

  useEffect(() => {
    return () => {
      stopAllStreaming()
    }
  }, [stopAllStreaming])

  const handleRefresh = useCallback(() => {
    location.replace(`/room/queue`)
  }, [])

  return (
    <main className="flex h-auto flex-col">
      <section className="align-center container mb-5 flex h-full place-content-center content-center justify-center px-4 md:px-8">
        <div className="flex w-full flex-col items-center">
          <h1 className="mt-6 text-center text-xl sm:text-[2em] md:w-2/3">
            Before you start practicing, make sure to check your microphone and
            camera first.
          </h1>
          <Badge className="md:text-md mt-4 text-sm">
            Users Online: {usersOnline}
          </Badge>
          <div className="mt-4 flex w-full flex-col items-center md:p-5">
            <Card className="border-slate-5 bg-slate-6 w-full border border-b-0 md:w-3/5">
              <CardContent className="p-4 md:p-6">
                {accessGranted ? (
                  <>
                    <VideoPlayer
                      ref={videoRef}
                      audioDevices={audioDevices}
                      videoDevices={videoDevices}
                      outputDevices={outputDevices}
                      setActiveAudioDevice={(deviceId) =>
                        onInputChange(deviceId, 'audio')
                      }
                      activeAudioDevice={selectedAudioDevice}
                      setActiveVideoDevice={(deviceId) =>
                        onInputChange(deviceId, 'video')
                      }
                      activeVideoDevice={selectedVideoDevice}
                      activeOutputDevice={selectedOutputDevice}
                      setActiveOutputDevice={(deviceId) =>
                        onAudioOutputChange(deviceId)
                      }
                      muted={muted}
                      onMute={toggleMute}
                      videoOff={videoOff}
                      onVideoOff={toggleVideo}
                    />
                    <div className="mt-2 flex w-full items-center justify-between">
                      <h2 className="text-md md:text-md mt-2 text-slate-500 sm:mt-0">
                        {
                          "Each conversation room lasts for 10 minutes. When there are less than 2 minutes remaining, a timer will appear above the users' videos to indicate the time left."
                        }
                      </h2>
                    </div>
                    <div className="mt-2 flex w-full flex-col items-center justify-between gap-6 sm:flex-row">
                      <h2 className="text-sm sm:text-base">
                        {inQueue
                          ? 'Finding a practice buddy'
                          : "Hit the 'I'm Ready' button when you feel ready to start practicing with someone."}
                      </h2>
                      <Button
                        onClick={onConnect}
                        className="z-10 h-12 w-full rounded-xl text-lg font-semibold sm:w-auto"
                      >
                        {inQueue ? 'Cancel' : "I'm Ready"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-5 p-5">
                    <h2 className="text-lg">
                      We need access to your microphone and camera. Please
                      enable permissions to continue.
                    </h2>
                    <Button className="h-12" onClick={handleRefresh}>
                      Refresh
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
