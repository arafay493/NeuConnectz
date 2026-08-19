import dayjs from "dayjs";
import { useMemo } from "react";

const useDocumentDetails = (row: any) => {
    return useMemo(
        () => [
            {
                label: "Document No",
                value: row?.docNum ?? "-",
            },
            {
                label: "Material Document No",
                value: row?.materialDocumentNumber ?? "-",
            },
            {
                label: "Purchase Order No",
                value: row?.purchaseOrderNumber ?? "-",
            },
            {
                label: "Vendor Name",
                value: row?.vendorName ?? "-",
            },
            {
                label: "Plant",
                value: row?.plant ?? "-",
            },
            {
                label: "Storage Location",
                value: row?.storageLocation ?? "-",
            },
            {
                label: "Warehouse Number",
                value: row?.warehouseNumber ?? "-",
            },
            {
                label: "GR Date",
                value: row?.grDate
                    ? dayjs(row.grDate).format("DD/MM/YYYY")
                    : "-",
            },
            {
                label: "Document Status",
                value: row?.docStatus ?? "-",
            },
            {
                label: "SAP Status",
                value: row?.sapStatus ?? "-",
            },
            {
                label: "Total Lines",
                value: row?.totalLines ?? "-",
            },
            {
                label: "Total Quantity",
                value: row?.totalQuantity ?? "-",
            },
            {
                label: "Created Date",
                value: row?.createdDate
                    ? dayjs(row.createdDate).format("DD/MM/YYYY")
                    : "-",
            },
            {
                label: "Created By",
                value: row?.createdByName ?? "-",
            },
        ],
        [row]
    );
};

export default useDocumentDetails;