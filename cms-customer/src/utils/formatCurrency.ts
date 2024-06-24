// src/utils/formatCurrency.ts
export function formatVND(value: number): string {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
  