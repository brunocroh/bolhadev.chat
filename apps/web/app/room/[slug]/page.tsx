'use client'

import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import useWebSocket from 'react-use-websocket'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import Peer from 'simple-peer'
import { Chat, Message } from '@/app/room/[slug]/components/chat'
import Countdown from '@/components/countdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { VideoPlayer } from '@/components/video-player'
import { useUserMedia } from '@/hooks/useUserMedia'
import { env } from '@repo/env-config'

export default function Page(): JSX.Element {
  const peerRef: MutableRefObject<Peer.Instance | null> = useRef(null)
  const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null)
  const remoteRef = useRef<HTMLVideoElement | null>(null)

  const pathname = usePathname()
  const roomId = pathname.split('/room/')[1]

  const [me, setMe] = useState('')
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [videoReady, setVideoReady] = useState(false)
  const [error, setError] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const {
    muted,
    toggleMute,
    toggleVideo,
    videoOff,
    stream,
    activeStream,
    selectedAudioDevice,
    selectedVideoDevice,
    selectedOutputDevice,
    outputDevices,
    audioDevices,
    videoDevices,
    switchInput,
    switchAudioOutput,
    stopAllStreaming,
  } = useUserMedia()

  const { sendJsonMessage, getWebSocket } = useWebSocket(
    env.NEXT_PUBLIC_SOCKET_URL!,
    {
      onOpen: () => {
        sendJsonMessage({
          type: 'me',
        })
      },
      onClose: () => {
        console.log('websocket disconnected')
      },
      onMessage: (event) => {
        const data = JSON.parse(event.data)
        let isHost: boolean = false

        switch (data.type) {
          case 'me':
            setMe(data.id)
            break
          case 'createRoomFail':
            setError(
              'Unable to connect to the room. Please check your network connection and try again.'
            )
            setLoading(false)
            break
          case 'hostCall':
            isHost = me !== data.to
            peerRef.current = new Peer({
              initiator: isHost,
              trickle: false,
              stream: stream!,
            })

            peerRef.current?.on('stream', (remoteStream) => {
              if (remoteRef.current) {
                remoteRef.current.srcObject = remoteStream
              }
            })

            peerRef.current.on('connect', () => {
              const ws = getWebSocket()
              if (ws) {
                ws.close()
              }
              setConnected(true)
              setLoading(false)
            })

            peerRef.current.on('close', () => {
              if (!error) {
                location.replace(`/room/${roomId}/feedback`)
              }
            })

            peerRef.current?.on('data', (message) => {
              setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'other', content: message.toString() },
              ])
            })

            if (isHost) {
              peerRef.current?.on('signal', (signalData) => {
                if (peerRef.current?.connected) return

                if (signalData.type === 'offer') {
                  sendJsonMessage({
                    type: 'sendOffer',
                    to: data.to,
                    signal: signalData,
                    from: me,
                  })
                }
              })
            }

            break
          case 'receiveOffer':
            peerRef.current?.signal(data.signal)
            peerRef.current?.on('signal', (signalData) => {
              if (peerRef.current?.connected) return
              if (signalData.type === 'answer') {
                sendJsonMessage({
                  type: 'sendAnswer',
                  to: data.from,
                  signal: signalData,
                })
              }
            })
            break
          case 'receiveAnswer':
            peerRef.current?.signal(data.signal)
            break
          default:
            break
        }
      },
    }
  )

  useEffect(() => {
    return () => {
      peerRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (videoRef.current && activeStream) {
      videoRef.current.srcObject = activeStream
      videoRef.current.play()

      setVideoReady(true)
    }
  }, [activeStream, videoReady])

  useEffect(() => {
    if (videoReady && me) {
      sendJsonMessage({ type: 'roomEnter', roomId, id: me })
    }
  }, [me, videoReady, roomId, sendJsonMessage])

  const handleInputChange = async (
    deviceId: string,
    type: 'audio' | 'video'
  ) => {
    const result = await switchInput(deviceId, type)
    peerRef.current?.replaceTrack(
      result?.oldVideoTrack!,
      result?.newVideoTrack!,
      stream!
    )
    peerRef.current?.replaceTrack(
      result?.oldAudioTrack!,
      result?.newAudioTrack!,
      stream!
    )
  }

  const handleHangUp = useCallback(async () => {
    stopAllStreaming()
    peerRef.current?.destroy()
    location.replace(`/room/${roomId}/feedback`)
  }, [roomId, stopAllStreaming])

  const handleBackToQueue = useCallback(async () => {
    stopAllStreaming()
    peerRef.current?.destroy()
    location.replace(`/room/queue`)
  }, [stopAllStreaming])

  const handleSendMessage = useCallback((newMessage: string) => {
    if (peerRef.current && peerRef.current.connected) {
      peerRef.current.send(newMessage)
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'me', content: newMessage },
    ])
  }, [])

  return (
    <section className="container flex flex-col content-center items-center justify-center px-4 md:px-8">
      <Countdown onFinishTime={handleHangUp} startTime={600_000} />
      <div className="flex w-full flex-col items-center">
        {error && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg">{error}</h3>
            <Button onClick={handleBackToQueue}>Back to queue</Button>
          </div>
        )}
        {loading && (
          <div>
            <h2>Loading...</h2>
          </div>
        )}
        <div
          className={clsx(
            'flex w-full flex-col justify-center gap-2 p-1 md:flex-row',
            !connected && 'invisible'
          )}
        >
          <div className="flex flex-col-reverse justify-center gap-2">
            <Card className="border-slate-5 bg-slate-6 border border-b-0 md:size-4/6 md:self-center">
              <CardContent className="p-3">
                <VideoPlayer
                  ref={videoRef}
                  activeAudioDevice={selectedAudioDevice}
                  setActiveAudioDevice={(deviceId) =>
                    handleInputChange(deviceId, 'audio')
                  }
                  activeVideoDevice={selectedVideoDevice}
                  setActiveVideoDevice={(deviceId) =>
                    handleInputChange(deviceId, 'video')
                  }
                  audioDevices={audioDevices}
                  videoDevices={videoDevices}
                  outputDevices={outputDevices}
                  activeOutputDevice={selectedOutputDevice}
                  setActiveOutputDevice={(deviceId) =>
                    switchAudioOutput(deviceId)
                  }
                  muted={muted}
                  videoOff={videoOff}
                  onMute={toggleMute}
                  onVideoOff={toggleVideo}
                  onTurnOff={handleHangUp}
                />
              </CardContent>
            </Card>
            <Card className="border-slate-5 bg-slate-6 border border-b-0 md:self-start">
              <CardContent className="p-3">
                <VideoPlayer
                  remote
                  ref={remoteRef}
                  activeOutputDevice={selectedOutputDevice}
                />
              </CardContent>
            </Card>
          </div>
          <div>
            {connected && (
              <Chat onSend={handleSendMessage} messages={messages} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
