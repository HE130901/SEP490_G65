"use client";
import { Button } from "@material-tailwind/react";
import { PhoneIcon } from "@heroicons/react/24/solid";

export function CallHotline() {
  return (
    <Button
      color="red"
      size="sm"
      className="!fixed bottom-4 right-4 flex gap-2 items-center rounded-full shadow-md hover:shadow-lg transition-transform  transform hover:scale-105 animate-bounce" // Add rounded corners, shadow, and hover effect
      placeholder=""
      onPointerEnterCapture=""
      onPointerLeaveCapture=""
      onClick={() => window.open("tel:1900 1234")}
    >
      <PhoneIcon className="h-5 w-5 text-white" />
      <span className="text-white font-bold">Gọi HOTLINE ngay</span>
    </Button>
  );
}

export default CallHotline;
