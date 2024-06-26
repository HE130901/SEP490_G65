"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const Loading: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 10 : 100));
    }, 50); // Increment progress every 500ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center h-screen bg-gradient-to-b from-slate-100 to-stone-400 dark:bg-gray-900"
      )}
    >
      <div className="flex flex-col items-center space-y-2">
        <span className="text-lg font-medium text-orange-400 dark:text-gray-100">
          Vui lòng chờ...
        </span>
        <Progress value={progress} className="w-52 h-2 bg-orange-100 " />
      </div>
    </div>
  );
};

export default Loading;
