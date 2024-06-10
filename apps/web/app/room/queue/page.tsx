import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import VideoTest from './components/video-test'

export default async function Page(): Promise<JSX.Element> {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/auth')
  }

  return (
    <main className="flex h-auto flex-col">
      <section className="align-center container mb-5 flex h-full flex-col place-content-center content-center justify-center">
        <VideoTest />
      </section>
    </main>
  )
}
