"use client";

import React from "react";
import { cn } from "@/lib/utils";

const Loading: React.FC = () => {
  return (
    <div className={cn("flex flex-col justify-center items-center h-screen bg-gray-100 dark:bg-gray-900")}>
      <div className="flex items-center space-x-2">
        <svg
          className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span className="text-lg font-medium text-gray-900 dark:text-gray-100">Đang tải...</span>
      </div>
    </div>
  );
};

export default Loading;
