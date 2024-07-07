// interfaces.ts

export interface Customer {
    customerId: number;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    citizenId: string;
  }
  
  export interface CustomerViewDialogProps {
    open: boolean;
    customer: Customer | null;
    onClose: () => void;
  }
  
  export interface CustomerEditDialogProps {
    open: boolean;
    customer: Customer | null;
    onClose: () => void;
  }
  