/***** All filters data sets are defined here *****/

// Note: Filters dropdown data for stock movement screen...!
const filters: string[] = [
    "SAP Status",
    "DOC Status",
    "From Warehouse Code",
    "To Warehouse Code",
    "Doc Date",
];

// Note: Filters dropdown data for GRN movement screen...!
const grnFilters: string[] = [
    "SAP Status",
    "DOC Status",
    "Vendor Code",
    "Warehouse",
    "Item Code",
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

const apiFilterParamsForGRNS: string[] = [
    "sapStatus",
    "docStatus",
    "vendorCode",
    "whsCode",
    "itemCode",
    "docDate",
];

// SAP Status options...!
const sapStatusOptions: string[] = [
    "Pending",
    "Updated",
    "Integrated",
];

// SAP Status options for GRN...!
const sapStatusOptionsGRN: string[] = [
    "Pending",
    "Integrated",
];

// Doc Status options...!
const docStatusOptions: string[] = [
    "Open",
    "Closed",
    "Pending",
];

// Doc Status options (IT and TR)...!
const docStatusOptionsFor_IT_TR: string[] = [
    "Completed",
    "Pending",
    "Drafted"
];

export {
    filters,
    grnFilters,
    apiFilterParams,
    sapStatusOptions,
    docStatusOptions,
    docStatusOptionsFor_IT_TR,
    sapStatusOptionsGRN,
    apiFilterParamsForGRNS
};