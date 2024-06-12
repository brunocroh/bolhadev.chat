import { VideoChat } from './components/video-chat'

export default function Page(): JSX.Element {
  return (
    <section className="container flex h-full flex-col content-center items-center justify-center gap-4">
      <VideoChat />
    </section>
  )
}
