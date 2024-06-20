"use client";
import { Typography, Card } from "@material-tailwind/react";

interface StatsCardProps {
  count: string;
  title: string;
}

export function StatsCard({ count, title }: StatsCardProps) {
  return (
    <Card className="bg-gray-50 p-6 rounded-lg shadow-md">
      <Typography variant="h1" className="font-bold" color="blue-gray">
        {count}
      </Typography>
      <Typography variant="h6" color="blue-gray" className="mt-1 font-medium">
        {title}
      </Typography>
    </Card>
  );
}

export default StatsCard;
