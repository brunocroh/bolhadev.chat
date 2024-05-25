
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
    <Card className="w-full md:w-2/5">
      <CardContent className="flex flex-row items-center gap-4 p-5">
        <div className="border-slate-6 flex items-center justify-center rounded-md border bg-gradient-to-b from-white/[3%] to-violet-500/10 p-4 transition duration-200 ease-in-out">
          <Icon size={26} />
        </div>
        <div className="">
          {content}
        </div>
      </CardContent>
    </Card>
  )
}