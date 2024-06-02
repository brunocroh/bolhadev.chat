import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { sendFeedback } from './actions'

export default function Page(): JSX.Element {
  return (
    <section className="container z-20 mt-24 flex h-full flex-col items-center">
      <h2 className="text-slate-6 w-full text-center text-[3rem] leading-10">
        How was your experience practicing english?
      </h2>
      <div className="mb-8 mt-4 w-full text-center text-slate-400">
        Share with us any feedback, problems, issues, ideas, or feature request.
      </div>
      <Card className="border-slate-6 bg-slate-5 flex w-full flex-col items-center rounded-3xl border-x-0 border-b-0 border-t p-5 md:w-2/3">
        <CardContent className="w-full">
          <form className="flex w-full flex-col items-start gap-4 ">
            <div className="flex w-full flex-col items-baseline gap-2 sm:flex-row">
              <Label className="w-16">Twitter</Label>
              <Input
                id="twitter"
                name="twitter"
                className="max-w-xs"
                placeholder="@brunocroh"
              />
            </div>
            <div className="flex w-full flex-col items-baseline gap-2 sm:flex-row">
              <Label className="w-16">Feedback</Label>
              <Textarea
                id="feedback"
                name="feedback"
                placeholder="Write here your feedback."
              />
            </div>
            <div className="flex flex-col gap-4 self-end sm:flex-row">
              <Link href="/room/queue">
                <Button variant="outline">
                  Not now, go back to practicing
                </Button>
              </Link>
              <Button formAction={sendFeedback}>Send</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
