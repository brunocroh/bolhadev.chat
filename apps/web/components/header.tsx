import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Header = () => {
  return (
    <nav className="w-full border-b border-b-zinc-800 py-2 md:py-6">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <Image
            src="/full-logo.png"
            className="h-[36px] w-[86px] md:h-[72px] md:w-[173px]"
            width={173}
            height={72}
            alt="BolhaDEV.chat logo featuring a stylized globe and a speech bubble with a language symbol on a dark background."
          ></Image>
        </Link>
        <Link href="room/queue" className="invisible self-center md:visible">
          <Button className="rounded-xl p-6 text-zinc-800">
            <span className="mr-1 text-base leading-6">Get started</span>
            <ArrowRight />
          </Button>
        </Link>
      </div>
    </nav>
  )
}
