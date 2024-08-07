"use client";
import { PhoneIcon } from "@heroicons/react/24/solid";
import { Button } from "../ui/button";

export function CallHotline() {
  return (
    <Button
      size="sm"
      className="!fixed bottom-4 right-4 flex gap-2 items-center rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-105 animate-bounce bg-red-600 hover:bg-red-400 moving-button"
      onClick={() => window.open("tel:09999999999")}
    >
      <PhoneIcon className="h-5 w-5 text-white" />
      <span className="text-white font-bold">Gọi HOTLINE</span>
    </Button>
  );
}

export default CallHotline;
