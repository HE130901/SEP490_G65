export interface Niche {
    nicheId: number;
    nicheName: string;
    customer: string;
    phone: string;
    deceased: string;
    status: string;
    history: string;
  }
  
  export interface Building {
    buildingId: number;
    buildingName: string;
    floors: {
      $values: Floor[];
    };
  }
  
  export interface Floor {
    floorId: number;
    floorName: string;
    areas: {
      $values: Zone[];
    };
  }
  
  export interface Zone {
    areaId: number;
    areaName: string;
  }
  