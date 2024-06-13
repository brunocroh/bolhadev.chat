import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { sendFeedback } from './actions'

export default function Page(): JSX.Element {
  return (
    <section className="container z-20 mt-8 flex h-full flex-col items-center px-4 md:mt-24 md:px-8">
      <h2 className="text-slate-6 w-full text-center text-3xl leading-10 md:text-[3rem]">
        How was your experience practicing english?
      </h2>
      <div className="mb-8 mt-4 w-full text-center text-slate-400">
        Share with us any feedback, problems, issues, ideas, or feature request.
      </div>
      <Card className="border-slate-6 bg-slate-5 flex w-full flex-col items-center rounded-3xl border-x-0 border-b-0 border-t p-5 md:w-2/3">
        <CardContent className="w-full">
          <form className="flex w-full flex-col items-start gap-4 ">
            <div className="flex w-full flex-col items-baseline gap-2 sm:flex-row">
              <Label className="w-28 text-xl">Twitter</Label>
              <Input
                id="twitter"
                name="twitter"
                className="h-12 text-xl md:text-base"
                placeholder="@brunocroh"
              />
            </div>
            <div className="flex w-full flex-col items-baseline gap-2 sm:flex-row">
              <Label className="w-28 text-xl">Feedback</Label>
              <Textarea
                id="feedback"
                name="feedback"
                placeholder="Write here your feedback."
                className="text-xl md:text-base"
              />
            </div>
            <div className="mt-4 flex w-full flex-col gap-4 self-end sm:flex-row md:w-2/3">
              <Link href="/room/queue" className="w-full md:w-2/3">
                <Button
                  variant="secondary"
                  className="h-12 w-full md:text-base"
                >
                  Not now, go back to practicing
                </Button>
              </Link>
              <Button
                formAction={sendFeedback}
                className="h-12 w-full text-xl md:w-1/3 md:text-base"
              >
                Send
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
