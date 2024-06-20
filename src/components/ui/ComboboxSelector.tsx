// ComboboxSelector.jsx

import React, { useState, useEffect } from "react";
import { useStateContext } from "@/context/state-context";
import { Button } from "@/components/ui/button";
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

const ComboboxSelector = ({ type }) => {
  const {
    buildings,
    floors,
    areas,
    selectedBuilding,
    setSelectedBuilding,
    selectedFloor,
    setSelectedFloor,
    selectedArea,
    setSelectedArea,
    fetchBuildings,
    fetchFloors,
    fetchAreas,
    resetSelections,
    resetSectionAndNiche,
    resetNiche,
  } = useStateContext();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (type === "building") {
      fetchBuildings();
    } else if (type === "floor" && selectedBuilding) {
      fetchFloors(selectedBuilding.buildingId);
    } else if (type === "area" && selectedBuilding && selectedFloor) {
      fetchAreas(selectedBuilding.buildingId, selectedFloor.floorId);
    }
  }, [type, selectedBuilding, selectedFloor]);

  const options =
    type === "building"
      ? buildings
      : type === "floor"
      ? floors
      : type === "area"
      ? areas
      : [];

  const label =
    type === "building"
      ? "Chọn tòa nhà"
      : type === "floor"
      ? "Chọn tầng"
      : type === "area"
      ? "Chọn khu"
      : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? options.find((opt) => opt.value === value)?.label : label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={(currentValue) => {
                    if (type === "building") {
                      setSelectedBuilding(
                        buildings.find((b) => b.value === currentValue)
                      );
                      resetSelections();
                    } else if (type === "floor") {
                      setSelectedFloor(
                        floors.find((f) => f.value === currentValue)
                      );
                      resetSectionAndNiche();
                    } else if (type === "area") {
                      setSelectedArea(
                        areas.find((a) => a.value === currentValue)
                      );
                      resetNiche();
                    }
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={
                      value === opt.value ? "opacity-100" : "opacity-0"
                    }
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboboxSelector;
