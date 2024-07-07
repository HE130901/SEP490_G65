"use client";

import React, { useEffect, useState } from "react";
import { useStateContext } from "@/context/StateContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const NicheSelector = ({ openModal }: { openModal: any }) => {
  const {
    selectedBuilding,
    selectedFloor,
    selectedArea,
    setSelectedNiche,
    niches,
    fetchNiches,
  } = useStateContext();

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedBuilding && selectedFloor && selectedArea) {
      setLoading(true);
      fetchNiches(
        selectedBuilding.buildingId,
        selectedFloor.floorId,
        selectedArea.areaId
      ).then(() => setLoading(false));
    }
  }, [selectedBuilding, selectedFloor, selectedArea, fetchNiches]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1250);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const rows = isSmallScreen
    ? createRows(sortedNiches, 5).reduce((acc, cur, idx) => {
        if (idx % 4 === 0) acc.push([]);
        acc[acc.length - 1].push(cur);
        return acc;
      }, [])
    : createRows(sortedNiches, 20);

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
    if (isSmallScreen) {
      return rows.reverse().map((floorRows, floorIndex) => (
        <div key={floorIndex} className="flex flex-col space-y-2">
          <div className="flex items-center justify-center font-semibold pr-4 whitespace-nowrap">
            {floorLabels[floorIndex]}
          </div>
          {floorRows.map((row: any[], rowIndex: number) => (
            <div key={rowIndex} className="flex space-x-2">
              {row.map((niche: any) => (
                <div
                  key={niche.nicheId}
                  onClick={() => {
                    if (niche.status === "Available") {
                      setSelectedNiche(niche);
                      openModal();
                    }
                  }}
                  className={`p-2 border rounded-md cursor-pointer transform transition-transform ${
                    niche.status === "unavailable"
                      ? "bg-black text-white cursor-not-allowed"
                      : niche.status === "Booked"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-white border hover:bg-orange-300 hover:scale-105"
                  }`}
                >
                  <div>{niche.nicheName}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ));
    } else {
      return rows.reverse().map((row, rowIndex) => (
        <div key={rowIndex} className="flex space-x-2 items-center">
          <div className="flex-shrink-0 font-semibold pr-4 whitespace-nowrap">
            {floorLabels[rowIndex]}
          </div>
          {row.map((niche: any) => (
            <div
              key={niche.nicheId}
              onClick={() => {
                if (niche.status === "Available") {
                  setSelectedNiche(niche);
                  openModal();
                }
              }}
              className={`p-2 border rounded-md cursor-pointer transform transition-transform ${
                niche.status === "unavailable"
                  ? "bg-black text-white cursor-not-allowed"
                  : niche.status === "Booked"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-white border hover:bg-slate-200 hover:scale-105"
              }`}
            >
              <div>{niche.nicheName}</div>
            </div>
          ))}
        </div>
      ));
    }
  };

  return (
    <div className="text-center bg-stone-200 px-8 py-4 rounded-md shadow-md">
      <h2 className="text-xl text-center font-bold mb-4">
        {selectedBuilding?.buildingName} - {selectedFloor?.floorName} -{" "}
        {selectedArea?.areaName}
      </h2>
      <div className="flex flex-col items-center space-y-4">
        {loading ? renderSkeletonRows() : renderRows()}
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-black"></div>
          <span>Không thể chọn</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-white border"></div>
          <span>Có thể chọn</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-400"></div>
          <span>Đang được đặt</span>
        </div>
      </div>
    </div>
  );
};

export default NicheSelector;
