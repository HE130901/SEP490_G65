// interfaces.ts

export interface Customer {
    customerId: number;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    citizenId: string;
    citizenIdissuanceDate: string;
    citizenIdsupplier: string;

  }
  
  export interface CustomerViewDialogProps {
    open: boolean;
    customerId: any;
    onClose: () => void;
  }
  
  export interface CustomerEditDialogProps {
    open: boolean;
    customerId: any;
    onClose: () => void;
  }
  