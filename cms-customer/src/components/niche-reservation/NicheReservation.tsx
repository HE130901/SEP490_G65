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
    fetchBuildingsData,
    fetchNiches,
    fetchReservations,
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
    <div className="container mx-auto px-4 lg:px-8 py-6">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          className="lg:col-span-1 bg-white p-4 rounded-md shadow-md"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          custom={1}
        >
          <h1 className="text-xl font-bold mb-4">Tìm kiếm</h1>
          {loading ? <Skeleton height={40} /> : <CombinedSelector />}
        </motion.div>

        <motion.div
          className="lg:col-span-2 bg-white p-4 rounded-md shadow-md"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          custom={2}
        >
          <div className="flex justify-center mb-6">
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
      </section>
    </div>
  );
};

export default NicheReservationPage;
