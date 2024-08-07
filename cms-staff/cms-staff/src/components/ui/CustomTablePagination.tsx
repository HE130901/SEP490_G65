import React from "react";
import {
  TablePagination,
  TablePaginationProps,
  LabelDisplayedRowsArgs,
} from "@mui/material";

const CustomTablePagination: React.FC<TablePaginationProps> = (props) => {
  return (
    <TablePagination
      {...props}
      component="div"
      labelDisplayedRows={({ from, to, count }: LabelDisplayedRowsArgs) =>
        `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`
      }
    />
  );
};

export default CustomTablePagination;
