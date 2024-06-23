// src/utils/statusMapper.ts
export const mapStatusToVietnamese = (status) => {
    const statusMapping = {
      Active: "Đang Sử Dụng",
      Overdue: "Quá Hạn",
    };
  
    return statusMapping[status] || "Không xác định"; // Default to "Không xác định" if status is not found
  };
  