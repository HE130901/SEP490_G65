"use client";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";

import CombinedSelector from "@/components/niche-reservation/CombinedSelector";
import NicheSelector from "@/components/niche-reservation/NicheSelector";
import ReservationForm from "@/components/niche-reservation/ReservationForm";
import { useStateContext } from "@/context/state-context";

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
    selectedNiche,
    fetchBuildingsData,
    fetchNiches,
    fetchReservations,
    buildings,
    user,
  } = useStateContext();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nicheLoading, setNicheLoading] = useState(false);

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

  return (
    <div>
      <div className="flex flex-col md:flex-row px-4 md:px-10 lg:px-20 xl:px-32 2xl:px-44">
        <motion.div
          className="w-full md:w-1/6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          custom={1}
        >
          <h1 className="text-2xl font-bold">Tìm kiếm</h1>
          <div>{loading ? <Skeleton height={50} /> : <CombinedSelector />}</div>
        </motion.div>
        <motion.div
          className="w-full md:w-5/6 pt-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          custom={2}
        >
          <div className="flex justify-center my-6">
            {nicheLoading ? (
              <Skeleton height={200} width="100%" />
            ) : (
              <NicheSelector openModal={openBookingForm} />
            )}
          </div>
          <ReservationForm
            isVisible={isFormVisible}
            onClose={closeBookingForm}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default NicheReservationPage;
