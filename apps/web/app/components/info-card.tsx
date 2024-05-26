
import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react';
import React from 'react'

type InfoCard = {
  icon: LucideIcon;
  content: string;
}

export const InfoCard: React.FC<InfoCard> = ({icon, content}) => {
  const Icon = icon
  return (
    <Card className="border-slate-5 bg-slate-6 w-full border border-b-0 md:w-2/5 " style={{background: "linear-gradient(180deg, rgba(80, 80, 80, 0.15) 0%, rgba(0, 0, 0, 0) 70%"}}>
      <CardContent className="flex flex-row items-center gap-4 p-5">
        <div className="border-slate-5 flex items-center justify-center rounded-md border border-b-0 border-r-0  bg-gradient-to-b from-white/[3%] to-violet-500/10 p-4 transition duration-200 ease-in-out">
          <Icon size={26} />
        </div>
        <div className="">
          {content}
        </div>
      </CardContent>
    </Card>
  )
}
