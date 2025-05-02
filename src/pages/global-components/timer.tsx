"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

// Custom hook to manage timer logic
function useTimer(initialTime: number) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return { hours, minutes, seconds };
}

interface TimerProps {
  hours: number; // Hours to initialize the timer
  minutes: number; // Minutes to initialize the timer
  seconds: number; // Seconds to initialize the timer
}

export default function Timer({ hours = 0, minutes = 0, seconds = 0 }: TimerProps) {
  const timeInSeconds = hours * 3600 + minutes * 60 + seconds;
  const { hours: timerHours, minutes: timerMinutes, seconds: timerSeconds } = useTimer(timeInSeconds);
console.log(timerHours, timerMinutes, timerSeconds);
  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <Card className="bg-red-500 text-white rounded-full max-h-fit w-fit p-1">
      <div className="flex text-sm px-2 items-center justify-center gap-1" aria-label="Countdown Timer">
        <TimeUnit value={formatNumber(timerHours)} label="Hours" />
        <TimeSeparator />
        <TimeUnit value={formatNumber(timerMinutes)} label="Minutes" />
        <TimeSeparator />
        <TimeUnit value={formatNumber(timerSeconds)} label="Seconds" />
      </div>
    </Card>
  );
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center px-1" aria-label={label}>
      <div className="text-sm font-bold  text-center ">
        {value}
      </div>
    </div>
  );
}

function TimeSeparator() {
  return <div className="text-sm font-bold  pb-1">:</div>;
}
