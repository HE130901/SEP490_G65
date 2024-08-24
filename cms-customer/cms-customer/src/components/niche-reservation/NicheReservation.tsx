import React, { useEffect, useState, Suspense, lazy, useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import CombinedSelector from "@/components/niche-reservation/CombinedSelector";
import { useStateContext } from "@/context/StateContext";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import NicheAPI from "@/services/nicheService";
const CombinedDialog = lazy(() => import("./DetailAndBooking"));
const MyNicheDetailDialog = lazy(() => import("./MyNicheDetailDialog"));

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

interface Niche {
  nicheId: string;
  nicheName: string;
  status: string;
  reservedByUser?: boolean;
}

const NicheReservationPage = () => {
  const {
    selectedBuilding,
    selectedFloor,
    selectedArea,
    setSelectedNiche,
    fetchBuildingsData,
    fetchNiches,
    fetchNichesForCustomer,
    fetchReservations,
    niches,
    user,
  } = useStateContext();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDetailDialogVisible, setIsDetailDialogVisible] = useState(false);
  const [isMyDetailDialogVisible, setIsMyDetailDialogVisible] = useState(false);
  const [selectedNicheDetail, setSelectedNicheDetail] = useState<any>(null);
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
      const fetchNichesFunction = user ? fetchNichesForCustomer : fetchNiches;
      fetchNichesFunction(
        selectedBuilding.buildingId,
        selectedFloor.floorId,
        selectedArea.areaId
      ).then((data: any) => {
        console.log("Fetched niches:", data);
        setNicheLoading(false);
      });
    }
  }, [
    selectedBuilding,
    selectedFloor,
    selectedArea,
    fetchNiches,
    fetchNichesForCustomer,
    user,
  ]);

  useEffect(() => {
    // Chỉ thiết lập interval khi đã có đủ thông tin về tòa nhà, tầng và khu vực
    if (selectedBuilding && selectedFloor && selectedArea) {
      const intervalId = setInterval(() => {
        const fetchNichesFunction = user ? fetchNichesForCustomer : fetchNiches;
        fetchNichesFunction(
          selectedBuilding.buildingId,
          selectedFloor.floorId,
          selectedArea.areaId
        ).then((data: any) => {
          console.log("Auto fetched niches every 20 seconds:", data);
        });
      }, 20000); // 20 giây

      // Cleanup interval khi component unmount hoặc khi điều kiện thay đổi
      return () => clearInterval(intervalId);
    }
  }, [
    selectedBuilding,
    selectedFloor,
    selectedArea,
    fetchNiches,
    fetchNichesForCustomer,
    user,
  ]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 800) {
        setScreenSize("small");
      } else if (width > 800 && width <= 1450) {
        setScreenSize("medium");
      } else {
        setScreenSize("large");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openDetailDialog = useCallback(async (niche: Niche) => {
    try {
      const response = await NicheAPI.getDetail(niche.nicheId);
      setSelectedNicheDetail(response.data);
      console.log("Niche details:", response.data);
      setIsDetailDialogVisible(true);
    } catch (error) {
      console.error("Error fetching niche details:", error);
    }
  }, []);

  const openMyDetailDialog = useCallback(async (niche: Niche) => {
    try {
      const response = await NicheAPI.getDetailForCustomer(niche.nicheId);
      setSelectedNicheDetail(response.data);
      console.log("My Niche details:", response.data);
      setIsMyDetailDialogVisible(true);
    } catch (error) {
      console.error("Error fetching niche details:", error);
    }
  }, []);

  const closeDetailDialog = useCallback(() => {
    setIsDetailDialogVisible(false);
    setIsMyDetailDialogVisible(false);
    const fetchNichesFunction = user ? fetchNichesForCustomer : fetchNiches;
    fetchNichesFunction(
      selectedBuilding.buildingId,
      selectedFloor.floorId,
      selectedArea.areaId
    );
    setIsFormVisible(false);
    if (user && user.customerId) {
      fetchReservations(user.customerId);
    }
  }, [
    fetchNiches,
    fetchNichesForCustomer,
    fetchReservations,
    selectedBuilding,
    selectedFloor,
    selectedArea,
    user,
  ]);

  const sortedNiches = [...niches].sort((a, b) => {
    const aName = parseInt(a.nicheName, 10);
    const bName = parseInt(b.nicheName, 10);
    return aName - bName;
  });

  const createRows = useCallback((items: Niche[], itemsPerRow: number) => {
    const rows = [];
    for (let i = 0; i < items.length; i += itemsPerRow) {
      rows.push(items.slice(i, i + itemsPerRow));
    }
    return rows;
  }, []);

  const floorLabels: { [key: number]: string } = {
    0: "Hàng 5",
    1: "Hàng 4",
    2: "Hàng 3",
    3: "Hàng 2",
    4: "Hàng 1",
  };

  const renderSkeletonRows = useCallback(
    (itemsPerRow: number, rowsCount: number) => {
      return (
        <div className="flex flex-col space-y-2">
          {Array.from({ length: rowsCount }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex space-x-2">
              {Array.from({ length: itemsPerRow }).map((_, itemIndex) => (
                <Skeleton
                  key={itemIndex}
                  height={40}
                  width={40}
                  className="p-2 border rounded-md"
                />
              ))}
            </div>
          ))}
        </div>
      );
    },
    []
  );

  const renderRows = useCallback(() => {
    if (screenSize === "small") {
      const rows = createRows(sortedNiches, 5);
      const groupedRows = rows
        .reduce((acc, cur, idx) => {
          if (idx % 4 === 0) acc.push([]);
          acc[acc.length - 1].push(cur.reverse());
          return acc;
        }, [] as Niche[][][])
        .reverse();

      return groupedRows.map((floorRows, floorIndex) => (
        <div key={floorIndex} className="flex flex-col space-y-2">
          <div className="flex items-center justify-center font-semibold whitespace-nowrap">
            {floorLabels[floorIndex]}
          </div>
          {floorRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex space-x-2">
              {row.map((niche) => {
                const tooltipMessage = niche.reservedByUser
                  ? "Đây là ô chứa của bạn!"
                  : niche.status === "Booked"
                  ? "Ô chứa đã được đặt trước!"
                  : niche.status === "Unavailable" || niche.status === "Active"
                  ? "Ô chứa hiện không khả dụng!"
                  : "Bạn có thể chọn ô chứa này!";

                return (
                  <TooltipProvider key={niche.nicheId}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={() => {
                            if (niche.status === "Available") {
                              openDetailDialog(niche);
                            } else if (niche.reservedByUser) {
                              openMyDetailDialog(niche);
                            }
                          }}
                          className={`p-2 m-2 border rounded-md cursor-pointer transform transition-transform font-bold ${
                            niche.reservedByUser
                              ? "bg-sky-500 text-black"
                              : niche.status === "Unavailable" ||
                                niche.status === "Active"
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
        }, [] as Niche[][][])
        .reverse();

      return groupedRows.map((floorRows, floorIndex) => (
        <div key={floorIndex} className="flex flex-col space-y-2">
          <div className="flex items-center justify-center font-semibold whitespace-nowrap">
            {floorLabels[floorIndex]}
          </div>
          {floorRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex space-x-2">
              {row.map((niche) => {
                const tooltipMessage = niche.reservedByUser
                  ? "Đây là ô chứa của bạn!"
                  : niche.status === "Booked"
                  ? "Ô chứa đã được đặt trước!"
                  : niche.status === "Unavailable" || niche.status === "Active"
                  ? "Ô chứa hiện không khả dụng!"
                  : "Bạn có thể chọn ô chứa này!";

                return (
                  <TooltipProvider key={niche.nicheId}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={() => {
                            if (niche.status === "Available") {
                              openDetailDialog(niche);
                            } else if (niche.reservedByUser) {
                              openMyDetailDialog(niche);
                            }
                          }}
                          className={`p-2 m-2 border rounded-md cursor-pointer transform transition-transform font-bold ${
                            niche.reservedByUser
                              ? "bg-sky-500 text-black"
                              : niche.status === "Unavailable" ||
                                niche.status === "Active"
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
          ))}
        </div>
      ));
    } else {
      const rows = createRows(sortedNiches, 20).reverse();
      return rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex space-x-2 items-center">
          <div className="flex-shrink-0 font-semibold whitespace-nowrap">
            {floorLabels[rowIndex]}
          </div>
          {row.map((niche) => {
            const tooltipMessage = niche.reservedByUser
              ? "Đây là ô chứa của bạn!"
              : niche.status === "Booked"
              ? "Ô chứa đã được đặt trước!"
              : niche.status === "Unavailable" || niche.status === "Active"
              ? "Ô chứa hiện không khả dụng!"
              : "Bạn có thể chọn ô chứa này!";

            return (
              <TooltipProvider key={niche.nicheId}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => {
                        if (niche.status === "Available") {
                          openDetailDialog(niche);
                        } else if (niche.reservedByUser) {
                          openMyDetailDialog(niche);
                        }
                      }}
                      className={`p-2 m-2 border rounded-md cursor-pointer transform transition-transform font-bold ${
                        niche.reservedByUser
                          ? "bg-sky-500 text-black"
                          : niche.status === "Unavailable" ||
                            niche.status === "Active"
                          ? "bg-black text-white hover:cursor-not-allowed cursor-not-allowed"
                          : niche.status === "Booked"
                          ? "bg-orange-400 cursor-not-allowed hover:cursor-not-allowed text-white"
                          : "bg-white border hover:bg-green-500 hover:scale-150 hover:shadow-md hover:z-10 hover:transition-transform hover:duration-300 text-gray-600"
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
  }, [
    screenSize,
    sortedNiches,
    openDetailDialog,
    openMyDetailDialog,
    floorLabels,
  ]);

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
          <h1 className="text-2xl font-bold mb-4 text-center">Tìm kiếm</h1>
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
            {nicheLoading
              ? renderSkeletonRows(
                  screenSize === "small"
                    ? 5
                    : screenSize === "medium"
                    ? 10
                    : 20,
                  5
                )
              : renderRows()}
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-black rounded-sm"></div>
              <span className="font-semibold text-white">Đã được sử dụng</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white border rounded-sm"></div>
              <span className="font-semibold text-white">Còn trống</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-400 rounded-sm"></div>
              <span className="font-semibold text-white">Đang được đặt</span>
            </div>
            {user && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-sky-500 rounded-sm"></div>
                <span className="font-semibold text-white">
                  Ô chứa đang sở hữu
                </span>
              </div>
            )}
          </div>

          <Suspense fallback={<div>Loading...</div>}>
            <CombinedDialog
              isVisible={isDetailDialogVisible}
              onClose={closeDetailDialog}
              selectedNiche={selectedNicheDetail}
            />
          </Suspense>

          <Suspense fallback={<div>Loading...</div>}>
            <MyNicheDetailDialog
              isVisible={isMyDetailDialogVisible}
              onClose={closeDetailDialog}
              niche={selectedNicheDetail}
            />
          </Suspense>
        </motion.div>
      </section>
    </div>
  );
};

export default React.memo(NicheReservationPage);
