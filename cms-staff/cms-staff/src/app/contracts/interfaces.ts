// types.ts

export interface Contract {
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
    duration?: number;  // đổi lại thành number để đồng nhất
    type?: string;
    cost?: number;
    notes?: string[];
}

export interface FormData {
    customerName: string;
    relationship: string;
    phone: string;
    address: string;
    idNumber: string;
    idDate: string;
    idPlace: string;
    deceasedName: string;
    age: string;
    deathDate: string;
    deathCertificate: string;
    deathCertificatePlace: string;
    nicheBuilding: string;
    nicheFloor: string;
    nicheZone: string;
    nicheCode: string;
    type: string;
    duration: number;
    startDate: string;
    endDate: string;
    cost: number;
    status: string;
}

export interface Building {
    id: number;
    name: string;
    floors: Floor[];
}

export interface Floor {
    id: number;
    name: string;
    zones: Zone[];
}

export interface Zone {
    id: number;
    name: string;
    niches: Niche[];
}

export interface Niche {
    id: string;
    name: string;
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
