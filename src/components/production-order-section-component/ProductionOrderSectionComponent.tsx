// Note: Production Order Section Component...!

import React, { memo, useState, useMemo, FC, useEffect } from "react";
import NextImage from "next/image";
import {
  ActionIcon,
  Box,
  Group,
  Image,
  Stack,
  Text,
  Title,
  Select,
  Button,
  Collapse,
  Card,
} from "@mantine/core";
import { customStyles } from "@/styles/custom-theme";
import { GlobalSearchFilter } from "@/components/table-filters/GlobalSearchFilter";
import {
  IconArrowNarrowDown,
  IconChevronLeft,
  IconChevronDown,
  IconChevronRight,
  IconArrowNarrowUp,
  IconArrowsUpDown,
  IconBorderCorners,
  IconColumns,
  IconFilter,
  IconFilterOff,
  IconSearch,
  IconSearchOff,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { TableColumnsFilter } from "@/components/table-filters/TableColumnsFilter";
import { localAssets } from "@/lib/file-paths/file-paths";
import classes from "./po.module.css";
import { useAppSelector, useAppDispatch, store } from "@/redux/store";
import {
  fetchAllProductionOrders,
  fetchProductionOrdersLinesList,
} from "@/redux/actions/sap-actions/sap-actions";
import TableModalComponent from "../table-modal/TableModalComponent";
import { CLEAR_ALL_PRODUCTION_ORDERS_LINES_DATA } from "@/redux/reducers/sap-reducer/sap-reducer";
import CloseProductionOrderComponent from "../close-production-order/CloseProductionOrder";
import { useDisclosure } from "@mantine/hooks";

const cardsData = [
  {
    title: "Inventory Transfer Request",
    totalDoc: 2,
    totalCreated: 15,
    label: "ITR",
  },
  {
    title: "Inventory Transfer",
    totalDoc: 2,
    totalCreated: 11,
    label: "IT",
  },
  {
    title: "Transfer Receipt",
    totalDoc: 2,
    totalCreated: 15,
    label: "TR",
  },
  {
    title: "Issuance",
    totalDoc: 2,
    totalCreated: 15,
    label: "Issuance",
  },
  {
    title: "Receving",
    totalDoc: 2,
    totalCreated: 15,
    label: "Receving",
  },
];

export interface ProductionOrderDataType {
  absoluteEntry: number;
  documentNumber: number;
  itemNo: string;
  originNo: number;
  plannedDate: string;
  productDescription: string;
  productionOrderStatus: string;
  project: string;
  quantity: number;
  remainingQuantity: number;
  uom: string;
  warehouse: string;
}

type ApiProp = {
  apiUrl: string;
};

const ProductionOrderSectionComponent: FC<ApiProp> = ({ apiUrl }) => {
  // console.log("API URL:", apiUrl);

  // Note: Handling states here...!
  const [isLoading, setIsLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
  const [areTableFiltersVisible, setAreTableFiltersVisible] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10, // Adjusted to a more reasonable default
  });
  const [expanded, setExpanded] = useState({});
  const [opened, { toggle }] = useDisclosure(false);

  // Note: Table modal state...!
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isClosePOModalOpen, setIsClosePOModalOpen] = useState(false);
  const [rowData, setRowData] = useState<ProductionOrderDataType | null>(null);

  // Pagination values for Api call
  const skipRecord = pagination.pageIndex * pagination.pageSize;

  // Note: Handeling redux here...!
  const dispatch = useAppDispatch();
  const { authenticatedUser } = useAppSelector(({ authStates }) => {
    return authStates;
  });
  const { productionOrdersList, productionOrdersCount } = useAppSelector(
    ({ sapStates }) => {
      return sapStates;
    }
  );
  // console.log("productionOrdersList: ", productionOrdersList);

  // Note: Functions...!
  const handleSearchInputVisibility = () => {
    setIsSearchInputVisible(!isSearchInputVisible);
    setGlobalFilter("");
  };

  const handleTableFiltersVisibility = () => {
    setAreTableFiltersVisible(!areTableFiltersVisible);
    // Reset all filters
    table.getAllColumns().forEach((col) => {
      if (col.getCanFilter()) {
        col.setFilterValue(undefined); // ya ''
      }
    });
  };

  // Utility function to calculate optimal column width
  const calculateColumnWidth = (
    headerText: string,
    sampleValues: string[],
    minWidth: number = 80,
    maxWidth: number = 300
  ) => {
    // Calculate width based on header text (approximate 8px per character)
    const headerWidth = headerText.length * 8 + 40; // +40 for padding

    // Calculate width based on longest sample value
    const maxValueLength = sampleValues.reduce((max, value) => {
      return Math.max(max, String(value).length);
    }, 0);
    const valueWidth = maxValueLength * 8 + 40; // +40 for padding

    // Return the larger of header or content width, within min/max bounds
    return Math.min(
      Math.max(Math.max(headerWidth, valueWidth), minWidth),
      maxWidth
    );
  };

  const dateFilterFn = (row: any, columnId: string, value: string): boolean => {
    if (!value) return true;
    const cellValue = row.getValue(columnId);
    if (!cellValue) return false;
    const dateValue = new Date(cellValue as string).toLocaleDateString();
    return dateValue.toLowerCase().includes(value.toLowerCase());
  };

  // Custom filter functions for specific column types
  const serialNumberFilterFn = (
    row: any,
    columnId: string,
    value: string
  ): boolean => {
    if (!value) return true;
    // Calculate serial number based on the current row's position in the filtered data
    const serialNumber = row.index + 1;
    return String(serialNumber).includes(value);
  };

  const numberFilterFn = (
    row: any,
    columnId: string,
    value: string
  ): boolean => {
    if (!value) return true;
    const cellValue = row.getValue(columnId);
    if (cellValue == null) return false;
    return String(cellValue).toLowerCase().includes(value.toLowerCase());
  };

  const stringFilterFn = (
    row: any,
    columnId: string,
    value: string
  ): boolean => {
    if (!value) return true;
    const cellValue = row.getValue(columnId);
    if (cellValue == null) return false;
    return String(cellValue).toLowerCase().includes(value.toLowerCase());
  };

  // Custom global filter function
  const globalFilterFn = (
    row: any,
    columnId: string,
    value: string
  ): boolean => {
    if (!value) return true;

    const searchValue = value.toLowerCase();
    const cellValue = row.getValue(columnId);

    // Handle S.No column (computed value)
    if (columnId === "S.No") {
      const serialNumber =
        row.index +
        (table?.getState?.()?.pagination?.pageIndex || 0) *
        (table?.getState?.()?.pagination?.pageSize || 10) +
        1;
      return String(serialNumber).includes(value);
    }

    // Handle date column
    if (columnId === "docDate") {
      const dateValue = new Date(cellValue as string).toLocaleDateString();
      return dateValue.toLowerCase().includes(searchValue);
    }

    // Handle other columns
    if (cellValue != null) {
      return String(cellValue).toLowerCase().includes(searchValue);
    }

    return false;
  };

  // Note: Call production orders lines list api...!
  const getProductionOrderLinesList = (rowData: ProductionOrderDataType) => {
    console.log("Row :", rowData);

    if (rowData && authenticatedUser?.token) {
      dispatch(
        fetchProductionOrdersLinesList({
          token: authenticatedUser?.token || "",
          apiUrl: process.env.NEXT_PUBLIC_PRODUCTION_ORDERS_LINES_LIST || "",
          docEntry: rowData.absoluteEntry,
        })
      );
      setRowData(rowData);
      setIsTableModalOpen(true);
    }
  };

  // Note: Close production order function...!
  const closeProductionOrder = (rowData: ProductionOrderDataType) => {
    // console.log("Close Row :", rowData);
    setRowData(null);
    setRowData(rowData);
    setIsClosePOModalOpen(true);
  };

  // Note: Column definitions for the table
  const columns = useMemo<ColumnDef<ProductionOrderDataType>[]>(
    () => [
      {
        id: "serialNumber", // Use id instead of accessorKey for computed columns
        header: "S.No",
        cell: ({ row }) => {
          // Calculate serial number based on server-side pagination
          const serialNumber =
            pagination.pageIndex * pagination.pageSize + row.index + 1;
          return (
            <Text fw={500} c={customStyles.colors._909090}>
              {serialNumber}
            </Text>
          );
        },
        filterFn: serialNumberFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth("S.No", ["99999"], 80, 120),
      },
      {
        accessorKey: "documentNumber",
        header: "Doc No",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() as string}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "Doc Num",
          (productionOrdersList || []).map((item) =>
            String(item.documentNumber)
          ),
          150,
          220
        ),
      },
      {
        accessorKey: "itemNo",
        header: "Item Code",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() as string}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "Item Code",
          (productionOrdersList || []).map((item) => item.itemNo),
          150,
          220
        ),
      },
      {
        accessorKey: "productDescription",
        header: "Item Description",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500} style={{ whiteSpace: "nowrap" }}>
            {getValue() as string}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "Item Description",
          (productionOrdersList || []).map((item) =>
            new Date(item.productDescription).toLocaleDateString()
          ),
          150,
          220
        ),
        minSize: 200,
      },
      {
        accessorKey: "uom",
        header: "UOM",
        cell: ({ getValue, row }) => {
          const val = row.original.uom != null ? row.original.uom : "N/A";
          return (
            <Text c={customStyles.colors._909090} fw={500}>
              {val as string}
            </Text>
          );
        },
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "UOM",
          (productionOrdersList || []).map((item) => item.uom),
          150,
          220
        ),
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {String(getValue())}
          </Text>
        ),
        filterFn: numberFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "Quantity",
          (productionOrdersList || []).map((item) => String(item.quantity)),
          120,
          150
        ),
      },
      {
        accessorKey: "remainingQuantity",
        header: "Remaining Qty",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() as string}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "Remaining Quantity",
          (productionOrdersList || []).map((item) =>
            String(item.remainingQuantity)
          ),
          150,
          220
        ),
      },
      {
        accessorKey: "plannedDate",
        header: "Planned Date",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {new Date(getValue() as string).toLocaleDateString()}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "Planned Date",
          (productionOrdersList || []).map((item) => item.plannedDate),
          150,
          220
        ),
      },
      {
        accessorKey: "originNo",
        header: "Origin No",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() as string}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "Origin No",
          (productionOrdersList || []).map((item) => String(item.originNo)),
          150,
          220
        ),
      },
      {
        accessorKey: "warehouse",
        header: "Warehouse",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() as string}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "Warehouse",
          (productionOrdersList || []).map((item) => item.warehouse),
          150,
          220
        ),
      },
      {
        accessorKey: "productionOrderStatus",
        header: "Status",
        cell: ({ getValue, row }) => {
          const val =
            row.original.productionOrderStatus?.replace("bopos", "") || "N/A";
          return (
            <Text c={customStyles.colors._909090} fw={500}>
              {val as string}
            </Text>
          );
        },
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "Status",
          (productionOrdersList || []).map(
            (item) => item.productionOrderStatus
          ),
          150,
          180
        ),
      },
      {
        header: "Action",
        cell: ({ getValue, row }) => {
          const rowData = row.original;
          // console.log("row data: ", rowData);
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Button
                variant="transparent"
                className={"outlineButton"}
                radius={8}
                size="sm"
                w={120}
                onClick={() => getProductionOrderLinesList(rowData)}
              >
                View Details
              </Button>

              <Button
                variant="transparent"
                // className={'outlineButton'}
                radius={8}
                size="sm"
                w={120}
                style={{
                  color: "#4A4A4A",
                  backgroundColor: "#E1E7EC",
                  marginLeft: 8,
                }}
                onClick={() => closeProductionOrder(rowData)}
              >
                Close
              </Button>
            </div>
          );
        },
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        // size: calculateColumnWidth('Action', (productionOrdersList || []).map(item => item.docStatus), 150, 180),
      },
    ],
    [productionOrdersList]
  );

  // Note: Table columns...!
  const table = useReactTable({
    data: productionOrdersList || [], // Handle undefined/null case
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    // onGlobalFilterChange: (value) => {
    //     setGlobalFilter(value);
    //     // Reset to first page when global filter changes
    //     setPagination(prev => ({ ...prev, pageIndex: 0 }));
    // },
    // onColumnFiltersChange: (filters) => {
    //     setColumnFilters(filters);
    //     // Reset to first page when column filters change
    //     setPagination(prev => ({ ...prev, pageIndex: 0 }));
    // },
    // globalFilterFn: (row, columnId, value) => {
    //   // Handle S.No column separately for global search
    //   if (row.index + 1 && String(row.index + 1).includes(value)) {
    //     return true;
    //   }

    //   const columnIds = [
    //     "serialNumber",
    //     "documentNumber",
    //     "itemNo",
    //     "productDescription",
    //     "uom",
    //     "quantity",
    //     "remainingQuantity",
    //     "plannedDate",
    //     "originNo",
    //     "warehouse",
    //     "productionOrderStatus",
    //   ];
    //   return columnIds.some((colId: string) =>
    //     globalFilterFn(row, colId, value)
    //   );
    // },
    onPaginationChange: setPagination,
    manualPagination: true, // Enable server-side pagination
    pageCount: Math.ceil(productionOrdersCount / pagination.pageSize), // Calculate total pages from server data
    state: {
      sorting,
      globalFilter,
      columnFilters,
      pagination,
      expanded
    },
  });

  const numbersArray = useMemo<number[]>(() => {
    return Array.from({ length: table.getPageCount() }, (_, i) => i + 1);
  }, [table.getPageCount()]);

  useEffect(() => {
    if (authenticatedUser?.token) {
      setIsLoading(true);
      const skipRecord = pagination.pageIndex * pagination.pageSize;

      dispatch(
        fetchAllProductionOrders({
          token: authenticatedUser?.token || "",
          apiUrl: apiUrl,
          lastCount: pagination.pageSize, // Use page size for server-side pagination
          skipRecords: skipRecord,
        })
      ).finally(() => {
        setIsLoading(false);
      });
    }
  }, [
    authenticatedUser,
    dispatch,
    apiUrl,
    pagination.pageIndex,
    pagination.pageSize,
  ]); // Add pagination dependencies

  useEffect(() => {
    if (isTableModalOpen === false)
      store.dispatch(CLEAR_ALL_PRODUCTION_ORDERS_LINES_DATA());
  }, [isTableModalOpen]);

  const handleGlobalSearch = (value: string) => {
    table.setGlobalFilter(String(value));
  };

  return (
    <Stack
      p={24}
      mt={24}
      bg={customStyles.colors.white}
      style={{ borderRadius: "16px", width: "100%" }}
    >
      {/* Table Modal Component */}
      <TableModalComponent
        open={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        rowData={rowData as ProductionOrderDataType}
      />

      {/* Close production order component */}
      <CloseProductionOrderComponent
        open={isClosePOModalOpen}
        onClose={() => setIsClosePOModalOpen(false)}
        docEntry={rowData?.absoluteEntry}
      />

      {/* Header Section */}
      <Group
        mb={24}
        justify="space-between"
        align="center"
        style={{ flexShrink: 0 }}
      >
        <Stack gap={0}>
          <Title order={3} mb={8} c={customStyles.colors._4D4D4D} style={{ fontWeight: 600, fontSize: 16 }}>
            Production Order
          </Title>
          <Text c={customStyles.colors._909090} style={{ fontWeight: 500, fontSize: 16 }}>
            Check production order records with status updates.
          </Text>
        </Stack>

        {/* Filters section */}
        <Group gap="xs">
          <GlobalSearchFilter
            filters={globalFilter}
            handleGlobalSearch={handleGlobalSearch}
            isSearchInputVisible={isSearchInputVisible}
          />
          {!isSearchInputVisible ? (
            <IconSearch
              cursor="pointer"
              size={24}
              onClick={handleSearchInputVisibility}
            />
          ) : (
            <IconSearchOff
              cursor="pointer"
              size={24}
              onClick={handleSearchInputVisibility}
            />
          )}
          {!areTableFiltersVisible ? (
            <IconFilter
              cursor="pointer"
              size={24}
              onClick={handleTableFiltersVisibility}
            />
          ) : (
            <IconFilterOff
              cursor="pointer"
              size={24}
              onClick={handleTableFiltersVisibility}
            />
          )}
          <IconColumns cursor="pointer" size={24} />

          <IconBorderCorners cursor="pointer" size={24} />
        </Group>
      </Group>

      {/* Table Section */}
      <Box w="100%" mah={700} className={"custom-scroll"} style={{ overflow: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "max-content",
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      cursor: "pointer",
                      textAlign: "left",
                      padding: "0 16px 16px 11px",
                      borderBottom: `1px solid ${customStyles.colors._E1E7EC || "#E5E5E5"
                        }`,
                      width: `${header.getSize()}px`,
                      minWidth: `${header.getSize()}px`,
                      maxWidth: `${header.getSize()}px`,
                      verticalAlign: "top",
                    }}
                  >
                    <Group
                      wrap="nowrap"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Text fw={600} c={customStyles.colors._4D4D4D}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Text>
                      {header.column.getCanSort() && (
                        <ActionIcon
                          variant="subtle"
                          size="xs"
                          c={customStyles.colors._4D4D4D}
                          style={{
                            cursor: "pointer",
                          }}
                          ml={4}
                        >
                          {(() => {
                            const sortDirection = header.column.getIsSorted();
                            if (sortDirection === "asc") {
                              return <IconArrowNarrowUp size={16} />;
                            } else if (sortDirection === "desc") {
                              return <IconArrowNarrowDown size={16} />;
                            } else {
                              return <IconArrowsUpDown size={16} />;
                            }
                          })()}
                        </ActionIcon>
                      )}
                    </Group>

                    {header.column.getCanFilter() && (
                      <TableColumnsFilter
                        areTableFiltersVisible={areTableFiltersVisible}
                        placeholder={header.column.columnDef.header as string}
                        value={(header.column.getFilterValue() as string) ?? ""}
                        setValue={(value) =>
                          header.column.setFilterValue(value)
                        }
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {/* <tbody>
            {isLoading ? (
              Array.from({ length: pagination.pageSize }).map((_, index) => (
                <tr
                  key={`loading-${index}`}
                  style={{
                    borderBottom: `1px solid ${customStyles.colors._E1E7EC || "#F0F0F0"
                      }`,
                  }}
                >
                  {columns.map((_, colIndex) => (
                    <td
                      key={`loading-cell-${colIndex}`}
                      style={{
                        textAlign: "left",
                        padding: "16px",
                      }}
                    >
                      <Box
                        h={20}
                        bg={customStyles.colors._E1E7EC || "#F0F0F0"}
                        style={{
                          borderRadius: "4px",
                          animation: "pulse 1.5s ease-in-out infinite",
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: `1px solid ${customStyles.colors._E1E7EC || "#F0F0F0"
                      }`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        textAlign: "left",
                        padding: "12px",
                        width: `${cell.column.getSize()}px`,
                        minWidth: `${cell.column.getSize()}px`,
                        maxWidth:
                          cell.column.id === "isActive"
                            ? "fit-content"
                            : "max-content",
                        overflow:
                          cell.column.id === "isActive" ? "visible" : "hidden",
                        textOverflow:
                          cell.column.id === "isActive"
                            ? "initial"
                            : "ellipsis",
                        whiteSpace: "nowrap",
                        verticalAlign: "middle",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    textAlign: "center",
                    padding: "32px 16px",
                    borderBottom: "none",
                  }}
                >
                  <Stack justify="center" align="center">
                    <Image
                      w={180}
                      h={180}
                      radius={16}
                      component={NextImage}
                      src={localAssets.dataNotFound}
                      alt="not-found"
                    />
                    <Title order={4} c={customStyles.colors._4D4D4D}>
                      No Data Found
                    </Title>
                  </Stack>
                </td>
              </tr>
            )}
          </tbody> */}
          <tbody>
            {isLoading ? (
              Array.from({ length: pagination.pageSize }).map((_, index) => (
                <tr
                  key={`loading-${index}`}
                  style={{
                    borderBottom: `1px solid ${customStyles.colors._E1E7EC || "#F0F0F0"
                      }`,
                  }}
                >
                  {columns.map((_, colIndex) => (
                    <td
                      key={`loading-cell-${colIndex}`}
                      style={{
                        textAlign: "left",
                        padding: "16px",
                      }}
                    >
                      <Box
                        h={20}
                        bg={customStyles.colors._E1E7EC || "#F0F0F0"}
                        style={{
                          borderRadius: "4px",
                          animation: "pulse 1.5s ease-in-out infinite",
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  {/* --- Normal Row --- */}
                  <tr
                    style={{
                      borderBottom: `1px solid ${customStyles.colors._E1E7EC || "#F0F0F0"
                        }`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          width: `${cell.column.getSize()}px`,
                          minWidth: `${cell.column.getSize()}px`,
                          maxWidth:
                            cell.column.id === "isActive"
                              ? "fit-content"
                              : "max-content",
                          overflow:
                            cell.column.id === "isActive" ? "visible" : "hidden",
                          textOverflow:
                            cell.column.id === "isActive" ? "initial" : "ellipsis",
                          whiteSpace: "nowrap",
                          verticalAlign: "middle",
                        }}
                      >
                        {cell.column.id === "serialNumber" ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {/* Arrow toggle */}
                            {row.getCanExpand() && (
                              <span
                                style={{ cursor: "pointer", marginTop: 6 }}
                                onClick={row.getToggleExpandedHandler()}
                              >
                                {row.getIsExpanded() ? <IconChevronDown stroke={2} size={20} color="#909090" /> : <IconChevronRight stroke={2} size={20} color="#909090" />
                                }
                              </span>
                            )}

                            {/* Serial number value */}
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* --- Expanded Row --- */}
                  {row.getIsExpanded() && (
                    <tr>
                      <td
                        colSpan={row.getVisibleCells().length}
                        style={{
                          padding: "16px",
                        }}
                      >
                        <Collapse in={row.getIsExpanded()} transitionDuration={1000}>
                          <Stack gap="md">
                            {cardsData.map((item, index) => (
                              <Card
                                key={index}
                                withBorder
                                radius="lg"
                                // shadow="xs"
                                w="100%"
                                p="lg"
                                style={{ borderColor: "#e0e0e0" }}
                              >
                                <Group align="center" justify="between">
                                  <Group flex={1}>
                                    <Text fw={600} size="sm">
                                      {item.title}
                                    </Text>
                                  </Group>
                                  <Group>
                                    <Group gap={3}>
                                      <Text size="xs" display={"flex"} fw={"bold"}>
                                        Total No of {item.label} Created : {" "}
                                      </Text>
                                      <Text size="xs" c={"dimmed"} fw={"bold"}>
                                        {item.totalCreated}
                                      </Text>
                                    </Group>
                                    <Button
                                      variant="transparent"
                                      className={"outlineButton"}
                                      radius={8}
                                      size="xs"
                                      w={120}
                                    // onClick={() => getProductionOrderLinesList(rowData)}
                                    >
                                      View Details
                                    </Button>
                                  </Group>
                                </Group>
                              </Card>
                            ))}
                          </Stack>
                          {/* <div style={{ padding: "16px" }}>
                            <Stack gap="xs">
                              <Text fw={600}>Details</Text>
                              <Text>Doc No: {row.original.documentNumber}</Text>
                              <Text>Item Code: {row.original.itemNo}</Text>
                              <Text>Quantity: {row.original.quantity}</Text>
                              <Text>Status: {row.original.productionOrderStatus}</Text>
                            </Stack>
                          </div> */}
                        </Collapse>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    textAlign: "center",
                    padding: "32px 16px",
                    borderBottom: "none",
                  }}
                >
                  <Stack justify="center" align="center">
                    <Image
                      w={180}
                      h={180}
                      radius={16}
                      component={NextImage}
                      src={localAssets.dataNotFound}
                      alt="not-found"
                    />
                    <Title order={4} c={customStyles.colors._4D4D4D}>
                      No Data Found
                    </Title>
                  </Stack>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>

      {/* Pagination Section */}
      <Box
        mt={12}
        bg={customStyles.colors.white}
        style={{ borderRadius: "16px", padding: "12px 24px" }}
      >
        <Group justify="space-between" align="center">
          {/* Left side - Page navigation */}
          <Group justify="flex-start" align="center" gap="xs">
            <ActionIcon
              className={
                !table.getCanPreviousPage()
                  ? "pagination-icon-disabled"
                  : "pagination-icon"
              }
              variant="transparent"
              size="lg"
              h={36}
              w={36}
              radius={8}
              c={customStyles.colors._909090}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronLeft size={18} />
            </ActionIcon>

            <Group gap="xs" align="center">
              <Select
                w={80}
                radius={8}
                rightSection={<IconChevronDown size={18} />}
                data={numbersArray.map((num) => ({
                  value: String(num),
                  label: String(num),
                }))}
                styles={{
                  input: {
                    border: `1px solid ${customStyles.colors._E1E7EC}`,
                  },
                }}
                max={table.getPageCount()}
                value={String(table.getState().pagination.pageIndex + 1)}
                onChange={(value) => {
                  const page = value ? Number(value) - 1 : 0;
                  table.setPageIndex(page);
                }}
              />
            </Group>

            <ActionIcon
              className={
                !table.getCanNextPage()
                  ? "pagination-icon-disabled"
                  : "pagination-icon"
              }
              variant="transparent"
              size="lg"
              h={36}
              w={36}
              radius={8}
              c={customStyles.colors._909090}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronRight size={18} />
            </ActionIcon>
            <Text size="md" c={customStyles.colors._4D4D4D}>
              / {table.getPageCount()} pages
            </Text>
          </Group>

          {/* Right side - Page size selector and info */}
          <Group gap="md" align="center">
            <Group gap="xs" align="center">
              <Text size="sm" c={customStyles.colors._909090}>
                Show
              </Text>
              <Select
                w={80}
                radius={8}
                rightSection={<IconChevronDown size={18} />}
                data={[
                  { value: "5", label: "5" },
                  { value: "10", label: "10" },
                  { value: "20", label: "20" },
                  { value: "50", label: "50" },
                  { value: "100", label: "100" },
                ]}
                styles={{
                  input: {
                    border: `1px solid ${customStyles.colors._E1E7EC}`,
                  },
                }}
                value={String(pagination.pageSize)}
                onChange={(value) => {
                  const newPageSize = value ? Number(value) : 10;
                  table.setPageSize(newPageSize);
                }}
              />
              <Text size="sm" c={customStyles.colors._909090}>
                per page
              </Text>
            </Group>

            <Text size="sm" c={customStyles.colors._909090}>
              Showing {skipRecord + 1} to{" "}
              {Math.min(
                skipRecord + pagination.pageSize,
                productionOrdersCount
              )}
              of {productionOrdersCount} entries
            </Text>
          </Group>
        </Group>
      </Box>
    </Stack>
  );
};

export default memo(ProductionOrderSectionComponent);
