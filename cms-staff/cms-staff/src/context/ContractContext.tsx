// src/context/ContractContext.tsx
import React, { createContext, useState, useEffect } from "react";
import contractService from "@/services/contractService";

interface Contract {
  totalAmount: any;
  nicheAddress: any;
  contractId: any;
  niche: any;
  customer: any;
  id: number;
  code: string;
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
  contractCode: string;
  nicheCode: string;
}

interface ContractContextProps {
  contracts: Contract[];
  selectedContractId: any;
  setSelectedContractId: any;
  selectedContractCode: any;
  setSelectedContractCode: any;
  order: any;
  setOrder: any;
  orderBy: any;
  setOrderBy: any;
  addContract: any;
  updateContract: any;
  removeContract: any;
  setContracts: any;
}

const ContractContext = createContext<ContractContextProps>(
  {} as ContractContextProps
);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(
    null
  );
  const [selectedContractCode, setSelectedContractCode] = useState<
    string | null
  >(null);
  const [order, setOrder] = useState<string>("asc");
  const [orderBy, setOrderBy] = useState<string>("contractId");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const contracts = await contractService.getAllContracts();
        setContracts(contracts);
      } catch (error) {
        console.error("Error fetching contracts:", error);
      }
    };
    fetchContracts();
  }, []);

  const addContract = (newContract: Contract) => {
    setContracts((prevContracts) => [...prevContracts, newContract]);
  };

  const updateContract = (updatedContract: Contract) => {
    setContracts((prevContracts) =>
      prevContracts.map((contract) =>
        contract.contractId === updatedContract.contractId
          ? updatedContract
          : contract
      )
    );
  };

  const removeContract = (contractId: string) => {
    setContracts((prevContracts) =>
      prevContracts.filter((contract) => contract.contractId !== contractId)
    );
  };

  return (
    <ContractContext.Provider
      value={{
        contracts,
        setContracts,
        selectedContractId,
        setSelectedContractId,
        selectedContractCode,
        setSelectedContractCode,
        order,
        setOrder,
        orderBy,
        setOrderBy,
        addContract,
        updateContract,
        removeContract,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export default ContractContext;
