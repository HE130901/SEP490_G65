// File: ItemType.ts

interface ItemType {
    id: number;
    name: string;
    price: number;
    quantity: number;
    status?: string;
    // Add any additional properties here
  }
  
  export default ItemType;