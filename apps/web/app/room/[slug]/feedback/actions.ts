'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function sendFeedback(formData: FormData) {
  const supabase = createClient()

  const data = {
    twitter: formData.get('twitter') as string,
    content: formData.get('feedback') as string,
  }

  if(data.twitter || data.content) {
    const { error } = await supabase.from('feedbacks').insert(data)
    console.log({error})
  }


  redirect('/room/queue')
}
