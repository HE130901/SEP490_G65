// types.ts

export interface Contract {
    nicheAddress: any;
    contractId: any;
    niche: any;
    customer: any;
    id: number;
    code: string;
    nicheCode: string;
    customerName: string;
    startDate: string;
    endDate: string;
    status: string;
    address?: string;
    phone?: string;
    idNumber?: string;
    idDate?: string;
    idPlace?: string;
    deceasedName?: string;
    duration?: number;  
    type?: string;
    cost?: number;
    notes?: string[];
    staffID: number;
    
}

export interface FormData {
    customerFullName: string;
    customerPhoneNumber: string;
    customerEmail: string;
    customerAddress: string;
    customerCitizenId: string;
    customerCitizenIdIssueDate: string;
    customerCitizenIdSupplier: string;
    deceasedFullName: string;
    deceasedCitizenId: string;
    deceasedDateOfBirth: string;
    deceasedDateOfDeath: string;
    deathCertificateNumber: string;
    deathCertificateSupplier: string;
    relationshipWithCustomer: string;
    nicheID: number;
    staffID: number;
    startDate: string;
    endDate: string;
    note: string;
    totalAmount: number;
}

export interface Building {
    buildingId: number;
    buildingName: string;
    floors: Floor[];
}

export interface Floor {
    floorId: number;
    floorName: string;
    areas: Area[];
}

export interface Area {
    areaId: number;
    areaName: string;
    niches: Niche[];
}

export interface Niche {
    nicheId: string;
    nicheName: string;
}

export interface AddContractFormProps {
    open: boolean;
    handleClose: () => void;
    handleSave: (formData: Omit<Contract, "id" | "code" | "status">) => void;
}

export interface ContractDocumentProps {
    formData: FormData;
}

export interface SearchDialogProps {
    open: boolean;
    handleClose: () => void;
    handleImport: (importedData: Partial<FormData>) => void;
}

export interface ContractDetailDialogProps {
    open: boolean;
    handleClose: () => void;
    contract: Contract | null;
}

export interface ConfirmDialogProps {
    open: boolean;
    handleClose: () => void;
    handleConfirm: () => void;
    title: string;
    content: string;
}

export interface RenewalDialogProps {
    open: boolean;
    handleClose: () => void;
    contract: Contract | null;
    handleSave: (updatedContract: Contract) => void;
}
