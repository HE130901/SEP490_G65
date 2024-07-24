// src/components/interfaces.ts
export interface VisitRegistrationDto {
    formattedVisitDate: string;
    formattedCreatedDate: string;    
    visitId: number;
    customerId: number;
    nicheId: number;
    customerName: string;
    staffName: string;
    nicheAddress: string;
    createdDate: string;
    visitDate: string;
    status: string;
    accompanyingPeople: number;
    note: string;
    approvedBy?: number;
  }
  
  export interface VisitDialogProps {
    open: boolean;
    visit?: VisitRegistrationDto | null;
    onClose: () => void;
  }
  