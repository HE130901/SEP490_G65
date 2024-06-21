import React from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CarouselPlugin } from "@/components/ui/carouselPlugin";

const NicheDetails = ({
  isVisible,
  onClose,
  selectedBuilding,
  selectedFloor,
  selectedArea,
  selectedNiche,
  onBook,
}) => {
  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent>
        <h2 className="text-xl font-bold mb-4">Thông tin chi tiết ô chứa</h2>
        {selectedNiche && (
          <div className="space-y-4">
            <div>
              <strong>Tòa nhà:</strong> {selectedBuilding?.buildingName}
            </div>
            <div>
              <strong>Tầng:</strong> {selectedFloor?.floorName}
            </div>
            <div>
              <strong>Khu:</strong> {selectedArea?.areaName}
            </div>
            <div>
              <strong>Ô số:</strong> {selectedNiche.nicheName}
            </div>
            <div>
              <strong>Trạng thái:</strong> {selectedNiche.status}
            </div>
            <div>
              <strong>Mô tả:</strong> {selectedNiche.nicheDescription}
            </div>
            <div className="w-full flex items-center justify-center shadow-lg rounded-lg overflow-hidden">
              <CarouselPlugin />
            </div>
          </div>
        )}
        <DialogFooter className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Quay lại
          </Button>
          {selectedNiche && selectedNiche.status === "Available" && (
            <Button onClick={onBook}>Đặt ô số {selectedNiche.nicheName}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NicheDetails;
