"use client"

import React, { useEffect, useState } from "react"
import { Badge } from "./ui/badge"
import clsx from "clsx"

const toMinutesAndSeconds = (time: number) => {
  const seconds = Math.floor((time / 1000) % 60)
  const minutes = Math.floor((time / 1000 / 60) % 60)

  return {
    minutes,
    seconds,
  }
}

const getDeadLine = (time: number) => {
  const deadLine = new Date()

  const duration = toMinutesAndSeconds(time)

  deadLine.setMinutes(deadLine.getMinutes() + duration.minutes)
  deadLine.setSeconds(deadLine.getSeconds() + duration.seconds)

  return deadLine
}

type Countdown = {
  startTime: number
  onFinishTime: () => void
}

const Countdown: React.FC<Countdown> = ({
  startTime = 600_000,
  onFinishTime,
}) => {
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null)
  const [time, setTimer] = useState("")

  useEffect(() => {
    const deadLine = getDeadLine(startTime)
    const interval = setInterval(() => {
      const timeRemaning = deadLine.getTime() - new Date().getTime()
      if (timeRemaning < 0) {
        onFinishTime()
      }
      const formatedTime = toMinutesAndSeconds(timeRemaning)

      setMinutesLeft(formatedTime.minutes)
      setTimer(
        `${formatedTime.minutes
          .toString()
          .padStart(2, "0")}:${formatedTime.seconds
          .toString()
          .padStart(2, "0")}`
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [onFinishTime, startTime])

  return (
    <Badge
      variant="destructive"
      className={clsx(
        "invisible",
        minutesLeft !== null && minutesLeft <= 1 && "visible"
      )}
    >
      Ends in: {time}
    </Badge>
  )
}

export default Countdown
