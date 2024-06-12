import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { VideoChat } from './components/video-chat'

export default async function Page(): JSX.Element {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/auth')
  }
  return (
    <section className="container flex h-full flex-col content-center items-center justify-center gap-4">
      <VideoChat />
    </section>
  )
}
