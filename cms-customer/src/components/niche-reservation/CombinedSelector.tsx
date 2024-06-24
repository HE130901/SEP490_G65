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

const CombinedSelector = () => {
  const {
    selectedBuilding,
    setSelectedBuilding,
    selectedFloor,
    setSelectedFloor,
    selectedArea,
    setSelectedArea,
    fetchNiches,
    resetSelections,
    resetSectionAndNiche,
    resetNiche,
    buildings,
  } = useStateContext();

  const [buildingOpen, setBuildingOpen] = useState(false);
  const [floorOpen, setFloorOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);

  const [floors, setFloors] = useState([]);
  const [areas, setAreas] = useState([]);
  const [buildingValue, setBuildingValue] = useState("");
  const [floorValue, setFloorValue] = useState("");
  const [areaValue, setAreaValue] = useState("");

  useEffect(() => {
    if (buildings && buildings.length > 0) {
      handleSelectBuilding(buildings[0]);
    }
  }, [buildings]);

  const handleSelectBuilding = (building) => {
    setSelectedBuilding(building);
    setFloors(building.floors?.$values || []);
    resetSelections();
    setBuildingValue(building.buildingName);
    setBuildingOpen(false); // Close the building popover

    if (building.floors?.$values && building.floors.$values.length > 0) {
      handleSelectFloor(building.floors.$values[0]);
    }
  };

  const handleSelectFloor = (floor) => {
    setSelectedFloor(floor);
    setAreas(floor.areas?.$values || []);
    resetSectionAndNiche();
    setFloorValue(floor.floorName);
    setFloorOpen(false); // Close the floor popover

    if (floor.areas?.$values && floor.areas.$values.length > 0) {
      handleSelectArea(floor.areas.$values[0]);
    }
  };

  const handleSelectArea = (area) => {
    setSelectedArea(area);
    resetNiche();
    setAreaValue(area.areaName);
    setAreaOpen(false); // Close the area popover
  };

  return (
    <div className="flex flex-col space-y-4 pr-12">
      <div>
        {/* Building Selector */}
        <Popover open={buildingOpen} onOpenChange={setBuildingOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={buildingOpen}
              className="w-full justify-between"
            >
              {buildingValue || "Chọn tòa nhà..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Tìm kiếm tòa nhà..." />
              <CommandList>
                <CommandEmpty>Không tìm thấy tòa nhà.</CommandEmpty>
                <CommandGroup>
                  {buildings?.map((building) => (
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

      <div>
        {/* Floor Selector */}
        <Popover open={floorOpen} onOpenChange={setFloorOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={floorOpen}
              className="w-full justify-between"
            >
              {floorValue || "Chọn tầng..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
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

      <div>
        {/* Area Selector */}
        <Popover open={areaOpen} onOpenChange={setAreaOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={areaOpen}
              className="w-full justify-between"
            >
              {areaValue || "Chọn khu..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
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
    </div>
  );
};

export default CombinedSelector;
