/***** All filters data sets are defined here *****/

// Note: Filters dropdown data for stock movement screen...!
const filters: string[] = [
    "SAP Status",
    "DOC Status",
    "From Warehouse Code",
    "To Warehouse Code",
    "Doc Date",
];

// Note: API filter params for stock movement screen (ITR Actions)...!
const apiFilterParams: string[] = [
    "sapStatus",
    "docStatus",
    "fromWarehouseCode",
    "toWarehouseCode",
    "docDate",
];

// SAP Status options...!
const sapStatusOptions: string[] = [
    "Pending",
    "Updated",
    "Integrated",
];

// Doc Status options...!
const docStatusOptions: string[] = [
    "Open",
    "Close",
    "Pending",
];

export {
    filters,
    apiFilterParams,
    sapStatusOptions,
    docStatusOptions
};