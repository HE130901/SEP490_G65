"use client";

import { useEffect, useState } from "react";
import NicheAPI from "@/services/nicheService";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

const NicheReservationPage = () => {
  const [niches, setNiches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNiches = async () => {
      try {
        const response = await NicheAPI.getAll(1, 1, 1);
        const nichesData = response.data.$values;

        if (Array.isArray(nichesData)) {
          setNiches(nichesData);
        } else {
          console.error("API did not return an array:", nichesData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching niches:", error);
        setLoading(false);
      }
    };

    fetchNiches();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      {niches.map((niche) => {
        const tooltipMessage =
          niche.status === "Booked"
            ? "Ô chứa đã được đặt trước!"
            : niche.status === "Unavailable"
            ? "Ô chứa đã được sử dụng!"
            : niche.reservedByUser
            ? "Đây là ô chứa của bạn!"
            : "Bạn có thể chọn ô chứa này!";

        return (
          <TooltipProvider key={niche.nicheId}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`p-2 m-2 border rounded-md cursor-pointer transform transition-transform font-bold ${
                    niche.reservedByUser
                      ? "bg-yellow-400 text-black"
                      : niche.status === "Unavailable"
                      ? "bg-black text-white hover:cursor-not-allowed cursor-not-allowed"
                      : niche.status === "Booked"
                      ? "bg-orange-400 cursor-not-allowed hover:cursor-not-allowed text-white"
                      : "bg-white border hover:bg-green-500 hover:scale-150 hover:shadow-md hover:z-10 hover:transition-transform hover:duration-300 text-gray-600"
                  }`}
                >
                  <div>{niche.nicheName}</div>
                </div>
              </TooltipTrigger>
              <TooltipContent>{tooltipMessage}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};

export default NicheReservationPage;
