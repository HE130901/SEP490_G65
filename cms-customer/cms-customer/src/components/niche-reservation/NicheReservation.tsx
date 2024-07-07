import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import CombinedSelector from "@/components/niche-reservation/CombinedSelector";
import ReservationForm from "@/components/niche-reservation/ReservationForm";
import { useStateContext } from "@/context/StateContext";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
    },
  }),
};

const NicheReservationPage = () => {
  const {
    selectedBuilding,
    selectedFloor,
    selectedArea,
    setSelectedNiche,
    fetchBuildingsData,
    fetchNiches,
    fetchReservations,
    niches,
    user,
  } = useStateContext();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nicheLoading, setNicheLoading] = useState(false);
  const [screenSize, setScreenSize] = useState("large");

  useEffect(() => {
    const fetchData = async () => {
      await fetchBuildingsData();
      setLoading(false);
    };

    fetchData();
  }, [fetchBuildingsData]);

  useEffect(() => {
    if (selectedBuilding && selectedFloor && selectedArea) {
      setNicheLoading(true);
      fetchNiches(
        selectedBuilding.buildingId,
        selectedFloor.floorId,
        selectedArea.areaId
      ).then(() => setNicheLoading(false));
    }
  }, [selectedBuilding, selectedFloor, selectedArea, fetchNiches]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 600) {
        setScreenSize("small");
      } else if (width > 600 && width <= 1250) {
        setScreenSize("medium");
      } else {
        setScreenSize("large");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openBookingForm = () => {
    setIsFormVisible(true);
  };

  const closeBookingForm = () => {
    fetchNiches(
      selectedBuilding.buildingId,
      selectedFloor.floorId,
      selectedArea.areaId
    );
    setIsFormVisible(false);
    if (user && user.customerId) {
      fetchReservations(user.customerId);
    }
  };

  const sortedNiches = [...niches].sort((a, b) => {
    const aName = parseInt(a.nicheName, 10);
    const bName = parseInt(b.nicheName, 10);
    return aName - bName;
  });

  const createRows = (items: any[], itemsPerRow: number) => {
    const rows = [];
    for (let i = 0; i < items.length; i += itemsPerRow) {
      rows.push(items.slice(i, i + itemsPerRow));
    }
    return rows;
  };

  const floorLabels: { [key: number]: string } = {
    0: "Tầng 5",
    1: "Tầng 4",
    2: "Tầng 3",
    3: "Tầng 2",
    4: "Tầng 1",
  };

  const renderSkeletonRows = () => {
    return (
      <div className="flex flex-wrap justify-center space-x-2">
        {Array.from({ length: 100 }).map((_, idx) => (
          <Skeleton key={idx} height={50} width={50} />
        ))}
      </div>
    );
  };

  const renderRows = () => {
    if (screenSize === "small") {
      const rows = createRows(sortedNiches, 5);
      const groupedRows = rows
        .reduce((acc, cur, idx) => {
          if (idx % 4 === 0) acc.push([]);
          acc[acc.length - 1].push(cur.reverse());
          return acc;
        }, [])
        .reverse();

      return groupedRows.map((floorRows, floorIndex) => (
        <div key={floorIndex} className="flex flex-col space-y-2">
          <div className="flex items-center justify-center font-semibold whitespace-nowrap">
            {floorLabels[floorIndex]}
          </div>
          {floorRows.map((row: any[], rowIndex: number) => (
            <div key={rowIndex} className="flex space-x-2">
              {row.map((niche: any) => {
                const tooltipMessage =
                  niche.status === "Booked"
                    ? "Ô chứa đã được đặt trước!"
                    : niche.status === "unavailable"
                    ? "Ô chứa đã được sử dụng!"
                    : "Bạn có thể chọn ô chứa này!";

                return (
                  <TooltipProvider key={niche.nicheId}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={() => {
                            if (niche.status === "Available") {
                              setSelectedNiche(niche);
                              openBookingForm();
                            }
                          }}
                          className={`p-2 border rounded-md cursor-pointer transform transition-transform font-bold ${
                            niche.status === "unavailable"
                              ? "bg-black text-white hover:cursor-not-allowed cursor-not-allowed"
                              : niche.status === "Booked"
                              ? "bg-orange-400 cursor-not-allowed hover:cursor-not-allowed text-white"
                              : "bg-white border hover:bg-green-500 hover:scale-150 hover:shadow-md hover:z-10 hover:transition-transform hover:duration-300"
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
          ))}
        </div>
      ));
    } else if (screenSize === "medium") {
      const rows = createRows(sortedNiches, 10);
      const groupedRows = rows
        .reduce((acc, cur, idx) => {
          if (idx % 2 === 0) acc.push([]);
          acc[acc.length - 1].push(cur);
          return acc;
        }, [])
        .reverse();

      return groupedRows.map((floorRows, floorIndex) => (
        <div key={floorIndex} className="flex flex-col space-y-2">
          <div className="flex items-center justify-center font-semibold whitespace-nowrap">
            {floorLabels[floorIndex]}
          </div>
          {floorRows.map((row: any[], rowIndex: number) => (
            <div key={rowIndex} className="flex space-x-2">
              {row.map((niche: any) => {
                const tooltipMessage =
                  niche.status === "Booked"
                    ? "Ô chứa đã được đặt trước!"
                    : niche.status === "unavailable"
                    ? "Ô chứa đã được sử dụng!"
                    : "Bạn có thể chọn ô chứa này!";

                return (
                  <TooltipProvider key={niche.nicheId}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={() => {
                            if (niche.status === "Available") {
                              setSelectedNiche(niche);
                              openBookingForm();
                            }
                          }}
                          className={`p-2 border rounded-md cursor-pointer transform transition-transform font-bold ${
                            niche.status === "unavailable"
                              ? "bg-black text-white hover:cursor-not-allowed cursor-not-allowed"
                              : niche.status === "Booked"
                              ? "bg-orange-400 cursor-not-allowed hover:cursor-not-allowed text-white"
                              : "bg-white border hover:bg-green-500 hover:scale-150 hover:shadow-md hover:z-10 hover:transition-transform hover:duration-300"
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
          ))}
        </div>
      ));
    } else {
      const rows = createRows(sortedNiches, 20).reverse();
      return rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex space-x-2 items-center pt-2">
          <div className="flex-shrink-0 font-semibold whitespace-nowrap">
            {floorLabels[rowIndex]}
          </div>
          {row.map((niche: any) => {
            const tooltipMessage =
              niche.status === "Booked"
                ? "Ô chứa đã được đặt trước!"
                : niche.status === "unavailable"
                ? "Ô chứa đã được sử dụng!"
                : "Bạn có thể chọn ô chứa này!";

            return (
              <TooltipProvider key={niche.nicheId}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => {
                        if (niche.status === "Available") {
                          setSelectedNiche(niche);
                          openBookingForm();
                        }
                      }}
                      className={`p-2 border rounded-md cursor-pointer transform transition-transform font-bold ${
                        niche.status === "unavailable"
                          ? "bg-black text-white hover:cursor-not-allowed cursor-not-allowed"
                          : niche.status === "Booked"
                          ? "bg-orange-400 cursor-not-allowed hover:cursor-not-allowed text-white"
                          : "bg-white border hover:bg-green-500 hover:scale-150 hover:shadow-md hover:z-10 hover:transition-transform hover:duration-300"
                      }`}
                    >
                      <div className="">{niche.nicheName}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{tooltipMessage}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      ));
    }
  };

  return (
    <div className="">
      <section className="flex flex-col lg:flex-row gap-2 ">
        {/* Search Section */}
        <motion.div
          className="lg:w-1/6 p-6 shadow-md bg-slate-300 bg-opacity-85 rounded-md bg-gradient-to-b from-slate-100 to-stone-400"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          custom={1}
        >
          <h1 className="text-2xl font-bold mb-4">Tìm kiếm</h1>
          {loading ? <Skeleton height={40} /> : <CombinedSelector />}
        </motion.div>

        {/* Niche Selector Section */}
        <motion.div
          className="lg:w-5/6  p-6  shadow-md bg-slate-300 bg-opacity-85 rounded-md bg-gradient-to-b from-slate-100 to-stone-400"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          custom={2}
        >
          <h2 className="text-2xl text-center font-bold mb-4">
            {selectedBuilding?.buildingName} - {selectedFloor?.floorName} -{" "}
            {selectedArea?.areaName}
          </h2>
          <div className="flex flex-col items-center mb-6">
            {nicheLoading ? renderSkeletonRows() : renderRows()}
          </div>
          <div className="mt-4 flex justify-center space-x-4 ">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-black rounded-sm "></div>
              <span className="font-semibold text-white">Đã sử dụng</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white border rounded-sm"></div>
              <span className="font-semibold text-white">Còn trống</span>
            </div>
            <div className="flex items-center space-x-2 ">
              <div className="w-4 h-4 bg-orange-400 rounded-sm"></div>
              <span className="font-semibold text-white">Đã được đặt</span>
            </div>
          </div>
          <ReservationForm
            isVisible={isFormVisible}
            onClose={closeBookingForm}
          />
        </motion.div>
      </section>
    </div>
  );
};

export default NicheReservationPage;
