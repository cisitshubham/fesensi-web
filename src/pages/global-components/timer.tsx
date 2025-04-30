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
  initialTime: number; // Time in hours and minutes (e.g., 1.5 for 1 hour and 30 minutes)
}

export default function Timer({ initialTime }: TimerProps) {
  const timeInSeconds = Math.floor(initialTime) * 3600 + Math.round((initialTime % 1) * 60) * 60;
  const { hours, minutes, seconds } = useTimer(timeInSeconds);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <Card className="max-h-fit p-1">
      <div className="flex text-sm items-center justify-center gap-1" aria-label="Countdown Timer">
        <TimeUnit value={formatNumber(hours)} label="Hours" />
        <TimeSeparator />
        <TimeUnit value={formatNumber(minutes)} label="Minutes" />
        <TimeSeparator />
        <TimeUnit value={formatNumber(seconds)} label="Seconds" />
      </div>
    </Card>
  );
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center" aria-label={label}>
      <div className="text-sm font-bold bg-slate-200 dark:bg-slate-700 rounded-lg p-1 w-fit text-center text-gray-600 dark:text-gray-500">
        {value}
      </div>
    </div>
  );
}

function TimeSeparator() {
  return <div className="text-sm font-bold text-slate-400 dark:text-slate-500 pb-1">:</div>;
}
