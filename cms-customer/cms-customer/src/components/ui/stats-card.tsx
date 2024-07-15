"use client";
import { Typography, Card, CardContent } from "@mui/material";

interface StatsCardProps {
  count: string;
  title: string;
}

export function StatsCard({ count, title }: StatsCardProps) {
  return (
    <Card className="bg-gray-50 p-6 rounded-lg shadow-md">
      <CardContent>
        <Typography variant="h3" className="font-bold" color="textPrimary">
          {count}
        </Typography>
        <Typography
          variant="h6"
          color="textSecondary"
          className="mt-1 font-medium"
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default StatsCard;
