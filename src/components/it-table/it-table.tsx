// Note: IT Table Component...!

import DataNotFound from "@/components/data-not-found/data-not-found";
import { GlobalSearchFilter } from "@/components/table-filters/GlobalSearchFilter";
import { localAssets } from "@/lib/file-paths/file-paths";
import showNotificationToast from "@/lib/notification-toast/notification-toast";
import { fetchAllItData } from "@/redux/actions/itr-actions/itr-actions";
import { fetchAllWareHouses } from "@/redux/actions/warehouse-actions/warehouse-actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { customStyles } from "@/styles/custom-theme";
import {
  ActionIcon,
  Box,
  Group,
  Image,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconArrowsUpDown,
  IconBorderCorners,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
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
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import NextImage from "next/image";
import React, { memo, useEffect, useMemo, useState } from "react";
import StockMovementFilterBar, {
  DocStatusProp,
  SapStatusProp,
} from "../stock-movement/StockMovementFilterBar";
import { TableColumnsFilter } from "../table-filters/TableColumnsFilter";
import classes from "../production-order-section-component/po.module.css";

// Note: IT Data type based on actual Redux state structure
type ITDataType = {
  id: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  itemCode: string;
  itemName: string;
  binCode: string;
  barCode: string;
  docStatus: string;
  receivedQuantity: number;
  erpDocEntry: string | number;
  erpObjectType: string | number;
  erpDocLine: string | number;
  sapStatus: string;
  inTransit: string;
  docNum: string | number;
  uniqueId: string;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
  isActive: boolean;
};

type ApiProp = {
  apiUrl: string;
};

const IT_TableCom: React.FC<ApiProp> = ({ apiUrl }) => {
  // Search Table Filter With API Call
  const [toWarehouse, setToWarehouse] = useState("");
  const [fromWarehouse, setFromWarehouse] = useState("");
  const [selectDate, setSelectDate] = useState<string | null>(null);
  const [sapStatus, setSapStatus] = useState<SapStatusProp>();
  const [docStatus, setDocStatus] = useState<DocStatusProp>();
  const [filteredParams, setFilteredParams] = useState("");

  // Note: States...!
  const [isLoading, setIsLoading] = useState(false);

  // Note: State for pagination
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Pagination values for Api call
  const skipRecord = pagination.pageIndex * pagination.pageSize;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Note: State for Table Filters
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
  const [areTableFiltersVisible, setAreTableFiltersVisible] = useState(false);

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

  // Note: Handeling redux here...!
  const dispatch = useAppDispatch();

  const { authenticatedUser } = useAppSelector(({ authStates }) => {
    return authStates;
  });
  const { itData, itDataCount, itrErrorState } = useAppSelector(
    ({ itrStates }) => {
      return itrStates;
    }
  );
  const { wareHousesList } = useAppSelector(({ wareHouseStates }) => {
    return wareHouseStates;
  });
  // console.log('IT Data: ', itData);

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

  // Note: Column definitions for the table
  const columns = useMemo<ColumnDef<ITDataType>[]>(
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
        accessorKey: "docNum",
        header: "Doc Num",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {String(getValue())}
          </Text>
        ),
        filterFn: numberFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "Document Number",
          itData.map((item) => String(item.docNum)),
          120,
          200
        ),
      },
      {
        accessorKey: "uniqueId",
        header: "Base Doc Num",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {String(getValue())}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "Base Document Number",
          itData.map((item) => String(item.uniqueId)),
          180,
          220
        ),
      },
      {
        accessorKey: "fromWarehouseId",
        header: "From WH Code",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() as string}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "From Warehouse Code",
          itData.map((item) => item.fromWarehouseId),
          180,
          220
        ),
      },
      {
        accessorKey: "toWarehouseId",
        header: "To WH Code",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() as string}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "To Warehouse Code",
          itData.map((item) => item.toWarehouseId),
          180,
          220
        ),
      },
      {
        accessorKey: "docStatus",
        header: "Doc Status",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() as string}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "Document Status",
          itData.map((item) => item.docStatus),
          150,
          200
        ),
      },
      {
        accessorKey: "itemCode",
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
          itData.map((item) => item.itemCode),
          180,
          220
        ),
      },
      {
        accessorKey: "itemName",
        header: "Item Description",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() as string}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "Item Description",
          itData.map((item) => item.itemName),
          200,
          300
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() != null ? String(getValue()) : "-"}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
      },
      {
        accessorKey: "reconciliationCase",
        header: "Case",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() != null ? String(getValue()) : "-"}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
      },
      {
        accessorKey: "groupCode",
        header: "Group Code",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() != null ? String(getValue()) : "-"}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "Group Code",
          itData.map((item) => item.groupCode),
          200,
          220
        ),
      },
      {
        accessorKey: "groupName",
        header: "Group Name",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() != null ? String(getValue()) : "-"}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "Group Name",
          itData.map((item) => item.groupName),
          200,
          300
        ),
      },
      {
        accessorKey: "receivedQuantity",
        header: "Quantity",
        cell: ({ getValue, row }) => {
          const { receivedQuantity } = row?.original;
          return (
            <Text c={customStyles.colors._909090} fw={500}>
              {receivedQuantity != null ? Math.floor(receivedQuantity).toFixed(2) : "-"}
            </Text>
          );
        },
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "Quantity",
          itData.map((item) => String(item?.receivedQuantity)),
          200,
          300
        ),
      },
      {
        accessorKey: "erpDocEntry",
        header: "ERP Doc Entry",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() != null ? String(getValue()) : "-"}
          </Text>
        ),
        filterFn: numberFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "ERP Document Entry",
          itData.map((item) => String(item.erpDocEntry || "-")),
          180,
          220
        ),
      },
      {
        accessorKey: "erpObjectType",
        header: "ERP Object Type",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() != null ? String(getValue()) : "-"}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "ERP Object Type",
          itData.map((item) => String(item.erpObjectType || "-")),
          200,
          220
        ),
      },
      {
        accessorKey: "erpDocLine",
        header: "ERP Doc Line",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() != null ? String(getValue()) : "-"}
          </Text>
        ),
        filterFn: numberFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "ERP Doc Line",
          itData.map((item) => String(item.erpDocLine || "-")),
          200,
          220
        ),
      },
      {
        accessorKey: "sapStatus",
        header: "SAP Status",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() as string}
          </Text>
        ),
        filterFn: stringFilterFn,
        enableColumnFilter: true,
        size: calculateColumnWidth(
          "SAP Status",
          itData.map((item) => item.sapStatus),
          180,
          200
        ),
      },
    ],
    [itData]
  );

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

    // Handle other columns
    if (cellValue != null) {
      return String(cellValue).toLowerCase().includes(searchValue);
    }

    return false;
  };

  const table = useReactTable({
    data: itData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Remove client-side filtering and sorting for server-side pagination
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    // onGlobalFilterChange: (value) => {
    //   setGlobalFilter(value);
    //   // Reset to first page when global filter changes
    //   setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    // },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    // onColumnFiltersChange: (filters) => {
    //   setColumnFilters(filters);
    //   // Reset to first page when column filters change
    //   setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    // },
    globalFilterFn: (row, columnId, value) => {
      // Handle S.No column separately for global search
      if (row.index + 1 && String(row.index + 1).includes(value)) {
        return true;
      }

      const columnIds = [
        "docNum",
        "uniqueId",
        "fromWarehouseId",
        "toWarehouseId",
        "docStatus",
        "itemCode",
        "itemName",
        "erpDocEntry",
        "erpObjectType",
        "erpDocLine",
        "sapStatus",
      ];
      return columnIds.some((colId: string) =>
        globalFilterFn(row, colId, value)
      );
    },
    onPaginationChange: setPagination,
    manualPagination: true, // Enable server-side pagination
    pageCount: Math.ceil(itDataCount / pagination.pageSize), // Calculate total pages from server data
    state: {
      sorting,
      globalFilter,
      columnFilters,
      pagination,
    },
  });

  const numbersArray = useMemo<number[]>(() => {
    return Array.from({ length: table.getPageCount() }, (_, i) => i + 1);
  }, [table.getPageCount()]);

  // Warehouse validation functions
  const handleFromWarehouseChange = (value: string | null) => {
    if (value && value === toWarehouse) {
      showNotificationToast(
        "Invalid Selection",
        "From Warehouse and To Warehouse cannot be the same!",
        customStyles.colors.red
      );
      return;
    }
    setFromWarehouse(value ?? "");
  };

  const handleToWarehouseChange = (value: string | null) => {
    if (value && value === fromWarehouse) {
      showNotificationToast(
        "Invalid Selection",
        "To Warehouse and From Warehouse cannot be the same!",
        customStyles.colors.red
      );
      return;
    }
    setToWarehouse(value ?? "");
  };

  // Function to build URL parameters from filters
  const buildFilterParams = () => {
    const params = new URLSearchParams();

    if (sapStatus) params.append("sapStatus", sapStatus);
    if (docStatus) params.append("docStatus", docStatus);
    if (fromWarehouse) params.append("fromWarehouseCode", fromWarehouse);
    if (toWarehouse) params.append("toWarehouseCode", toWarehouse);
    if (selectDate) params.append("docDate", selectDate);

    setFilteredParams(params.toString());
    return params.toString();
  };

  // Function to fetch filtered data
  const fetchFilteredData = () => {
    if (!authenticatedUser?.token) return;

    const filterParams = buildFilterParams();
    const apiUrlWithParams = filterParams
      ? `${apiUrl}?${filterParams}`
      : apiUrl;
    const skipRecord = pagination.pageIndex * pagination.pageSize;

    setIsLoading(true);
    dispatch(
      fetchAllItData({
        authToken: authenticatedUser.token,
        apiUrl: apiUrlWithParams,
        lastCount: pagination.pageSize, // Use page size for server-side pagination
        skipRecords: skipRecord,
      })
    ).finally(() => {
      setIsLoading(false);
    });
  };

  // useEffect(() => {
  //   if (authenticatedUser?.token) {
  //     // setLoading(true);
  //     const skipRecord = pagination.pageIndex * pagination.pageSize;

  //     dispatch(
  //       fetchAllItData({
  //         authToken: authenticatedUser?.token || "",
  //         apiUrl: apiUrl,
  //         lastCount: pagination.pageSize, // Use page size for server-side pagination
  //         skipRecords: skipRecord,
  //       })
  //     );
  //   }
  // }, [authenticatedUser, pagination.pageIndex, pagination.pageSize]); // Add pagination dependencies

  // Note: Fetch All Warehouse List
  useEffect(() => {
    dispatch(
      fetchAllWareHouses({ authToken: authenticatedUser?.token as string })
    );
  }, [dispatch, authenticatedUser?.token]);

  useEffect(() => {
    // const timeoutId = setTimeout(() => {
    //   // if (sapStatus || docStatus || fromWarehouse || toWarehouse || selectDate) {
    //   if (authenticatedUser?.token) {
    //     fetchFilteredData();
    //   }
    //   // }
    // }, 500); // Debounce API calls by 500ms

    // return () => clearTimeout(timeoutId);
    if (authenticatedUser?.token) {
      fetchFilteredData();
    }
  }, [
    sapStatus,
    docStatus,
    fromWarehouse,
    toWarehouse,
    selectDate,
    pagination.pageIndex,
    pagination.pageSize,
    authenticatedUser
  ]); // Add pagination dependencies

  // Transform warehouse data for Select component
  const selectWarehouseData = wareHousesList.data
    // .filter((warehouse) => warehouse.isActive && !warehouse.isArchived)
    .map((warehouse) => ({
      value: warehouse.whsCode,
      label: warehouse.whsName,
    }));

  const handleGlobalSearch = (value: string) => {
    table.setGlobalFilter(String(value));
  };

  return (
    <Box>
      <StockMovementFilterBar
        docStatus={docStatus}
        setDocStatus={setDocStatus}
        sapStatus={sapStatus}
        setSapStatus={setSapStatus}
        fromWarehouse={fromWarehouse}
        handleFromWarehouseChange={handleFromWarehouseChange}
        toWarehouse={toWarehouse}
        handleToWarehouseChange={handleToWarehouseChange}
        selectDate={selectDate}
        setSelectDate={setSelectDate}
        selectWarehouseData={selectWarehouseData}
        sapType="IT"
        sapTypeApiUrl={process.env.NEXT_PUBLIC_EXPORT_IT_TO_EXCEL || ""}
        isFilterParams={filteredParams}
      />

      <Stack
        p={24}
        mt={24}
        bg={customStyles.colors.white}
        style={{ borderRadius: "16px", width: "100%" }}
      >
        {/* Header */}
        <Group
          mb={24}
          justify="space-between"
          align="center"
          style={{ flexShrink: 0 }}
        >
          <Stack gap={0}>
            <Title order={3} mb={8} c={customStyles.colors._4D4D4D} style={{ fontWeight: 600, fontSize: 16 }}>
              Manage IT Data
            </Title>
            <Text c={customStyles.colors._909090} style={{ fontWeight: 500, fontSize: 16 }}>
              View, search, and manage all IT data by using multiple filters.
            </Text>
          </Stack>
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

        {/* Table */}
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
                      {/* Note: Table Filter Input */}
                      {header.column.getCanFilter() && (
                        <TableColumnsFilter
                          areTableFiltersVisible={areTableFiltersVisible}
                          placeholder={header.column.columnDef.header as string}
                          value={
                            (header.column.getFilterValue() as string) ?? ""
                          }
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
            <tbody>
              {isLoading ? (
                // Loading skeleton
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
                            cell.column.id === "isActive"
                              ? "visible"
                              : "hidden",
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
            </tbody>
          </table>
        </Box>

        {/* {itData.length < 1 && <DataNotFound notFoundContent={itrErrorState || "No IT data found."} />} */}
      </Stack>

      {/* Pagination */}
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
              {Math.min(skipRecord + pagination.pageSize, itDataCount)} of{" "}
              {itDataCount} entries
            </Text>
          </Group>
        </Group>
      </Box>
    </Box>
  );
};

export default memo(IT_TableCom);
