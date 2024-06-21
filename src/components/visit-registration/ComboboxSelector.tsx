"use client";

import React, { useEffect, useState } from "react";
import { useStateContext } from "@/context/state-context";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const ComboboxSelector = () => {
  const {
    selectedBuilding,
    setSelectedBuilding,
    buildings,
    fetchBuildings,
    resetSelections,
    selectedFloor,
    setSelectedFloor,
    floors,
    fetchFloors,
    resetSectionAndNiche,
    selectedArea,
    setSelectedArea,
    areas,
    fetchAreas,
    resetNiche,
    selectedNiche,
    setSelectedNiche,
    niches,
    fetchNiches,
  } = useStateContext();

  const [buildingOpen, setBuildingOpen] = useState(false);
  const [floorOpen, setFloorOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const [nicheOpen, setNicheOpen] = useState(false);

  const [buildingValue, setBuildingValue] = useState("");
  const [floorValue, setFloorValue] = useState("");
  const [areaValue, setAreaValue] = useState("");
  const [nicheValue, setNicheValue] = useState("");

  useEffect(() => {
    fetchBuildings();
  }, []);

  useEffect(() => {
    if (selectedBuilding) {
      fetchFloors(selectedBuilding.buildingId);
    }
  }, [selectedBuilding]);

  useEffect(() => {
    if (selectedBuilding && selectedFloor) {
      fetchAreas(selectedBuilding.buildingId, selectedFloor.floorId);
    }
  }, [selectedBuilding, selectedFloor]);

  useEffect(() => {
    if (selectedBuilding && selectedFloor && selectedArea) {
      fetchNiches(
        selectedBuilding.buildingId,
        selectedFloor.floorId,
        selectedArea.areaId
      );
    }
  }, [selectedBuilding, selectedFloor, selectedArea]);

  const handleSelectBuilding = (building) => {
    setSelectedBuilding(building);
    resetSelections();
    setBuildingValue(building.buildingName);
    setFloorValue("");
    setAreaValue("");
    setNicheValue("");
    setBuildingOpen(false);
  };

  const handleSelectFloor = (floor) => {
    setSelectedFloor(floor);
    resetSectionAndNiche();
    setFloorValue(floor.floorName);
    setAreaValue("");
    setNicheValue("");
    setFloorOpen(false);
  };

  const handleSelectArea = (area) => {
    setSelectedArea(area);
    resetNiche();
    setAreaValue(area.areaName);
    setNicheValue("");
    setAreaOpen(false);
  };

  const handleSelectNiche = (niche) => {
    setSelectedNiche(niche);
    setNicheValue(niche.nicheName);
    setNicheOpen(false);
  };

  const filteredNiches = niches.filter(
    (niche) => niche.status === "unavailable"
  );

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <div>
        {/* Building Selector */}
        <Popover open={buildingOpen} onOpenChange={setBuildingOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={buildingOpen}
              className="w-full md:w-[200px] justify-between"
            >
              {buildingValue || "Chọn tòa nhà..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full md:w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Tìm kiếm tòa nhà..." />
              <CommandList>
                <CommandEmpty>Không tìm thấy tòa nhà.</CommandEmpty>
                <CommandGroup>
                  {buildings.map((building) => (
                    <CommandItem
                      key={building.buildingId}
                      value={building.buildingName}
                      onSelect={() => handleSelectBuilding(building)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedBuilding?.buildingId === building.buildingId
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {building.buildingName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedBuilding && (
        <div>
          {/* Floor Selector */}
          <Popover open={floorOpen} onOpenChange={setFloorOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={floorOpen}
                className="w-full md:w-[200px] justify-between"
              >
                {floorValue || "Chọn tầng..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full md:w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Tìm kiếm tầng..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy tầng.</CommandEmpty>
                  <CommandGroup>
                    {floors.map((floor) => (
                      <CommandItem
                        key={floor.floorId}
                        value={floor.floorName}
                        onSelect={() => handleSelectFloor(floor)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedFloor?.floorId === floor.floorId
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {floor.floorName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {selectedFloor && (
        <div>
          {/* Area Selector */}
          <Popover open={areaOpen} onOpenChange={setAreaOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={areaOpen}
                className="w-full md:w-[200px] justify-between"
              >
                {areaValue || "Chọn khu..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full md:w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Tìm kiếm khu..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy khu.</CommandEmpty>
                  <CommandGroup>
                    {areas.map((area) => (
                      <CommandItem
                        key={area.areaId}
                        value={area.areaName}
                        onSelect={() => handleSelectArea(area)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedArea?.areaId === area.areaId
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {area.areaName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {selectedArea && (
        <div>
          {/* Niche Selector */}
          <Popover open={nicheOpen} onOpenChange={setNicheOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={nicheOpen}
                className="w-full md:w-[200px] justify-between"
              >
                {nicheValue || "Chọn ô..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full md:w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Tìm kiếm ô..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy ô.</CommandEmpty>
                  <CommandGroup>
                    {filteredNiches.map((niche) => (
                      <CommandItem
                        key={niche.nicheId}
                        value={niche.nicheName}
                        onSelect={() => handleSelectNiche(niche)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedNiche?.nicheId === niche.nicheId
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {niche.nicheName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default ComboboxSelector;
