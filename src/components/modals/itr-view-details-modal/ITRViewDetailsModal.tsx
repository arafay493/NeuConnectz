import { localAssets } from "@/lib/file-paths/file-paths";
import { customStyles } from "@/styles/custom-theme";
import {
    Modal,
    Button,
    Group,
    Text,
    Stack,
    Center,
    Flex,
    Divider,
    ActionIcon,
    SimpleGrid,
    Box,
    Title,
    Image
} from "@mantine/core";
import NextImage from "next/image";
import {
    IconAlertCircle,
    IconArrowNarrowDown,
    IconArrowNarrowUp,
    IconArrowsUpDown,
    IconBorderCorners,
    IconCircleX,
    IconColumns,
    IconFilter,
    IconFilterOff,
    IconSearch,
    IconSearchOff,
} from "@tabler/icons-react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useMemo, useState } from "react";
import { GlobalSearchFilter } from "@/components/table-filters/GlobalSearchFilter";
import { TableColumnsFilter } from "@/components/table-filters/TableColumnsFilter";


interface ModalProps {
    opened: boolean;
    handleModalClose: () => void;
    row: any
    // handleConfirm: () => void;
    // handleCancel: () => void;
    // description: string
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <Group gap="xs">
            <Text fw={500} size="sm" c="dark.6">
                {label}:
            </Text>
            <Text size="sm" c="dimmed">
                {value}
            </Text>
        </Group>
    );
}


export default function ITRViewDetailsModal({
    opened,
    handleModalClose,
    row
    // handleConfirm,
    // handleCancel,
    // description
}: ModalProps) {
    // Search Table Filter With API Call
    const [toWarehouse, setToWarehouse] = useState("");
    const [fromWarehouse, setFromWarehouse] = useState("");
    const [selectDate, setSelectDate] = useState<string | null>(null);
    const [sapStatus, setSapStatus] = useState();
    const [docStatus, setDocStatus] = useState();
    const [filteredParams, setFilteredParams] = useState("");

    // Note: State for pagination
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10, // Adjusted to a more reasonable default
    });

    // Pagination values for Api call
    const skipRecord = pagination.pageIndex * pagination.pageSize;

    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnFilters, setColumnFilters] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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

    // Note: Fetching data from redux...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => {
        return authStates;
    });
    const { wareHousesList } = useAppSelector(({ wareHouseStates }) => {
        return wareHouseStates;
    });
    const { itrData, itrDataCount, itrErrorState } = useAppSelector(
        ({ itrStates }) => {
            return itrStates;
        }
    );

    // Note: Column definitions for the table
    // const columns = useMemo<ColumnDef<ITRDataType>[]>(
    const columns = useMemo(
        () => [
            {
                id: "serialNumber", // Use id instead of accessorKey for computed columns
                header: "S.No",
                cell: ({ row }: any) => {
                    // Calculate serial number based on server-side pagination
                    const serialNumber =
                        pagination.pageIndex * pagination.pageSize + row.index + 1;
                    return (
                        <Text fw={500} c={customStyles.colors._909090}>
                            {serialNumber}
                        </Text>
                    );
                },
                // filterFn: serialNumberFilterFn,
                enableColumnFilter: true,
                // size: calculateColumnWidth("S.No", ["99999"], 80, 120),
            },
            {
                accessorKey: "docNum",
                header: "Doc Num",
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {String(getValue())}
                    </Text>
                ),
                // filterFn: numberFilterFn,
                enableColumnFilter: true,
                // size: calculateColumnWidth(
                //     "Document Number",
                //     (itrData || []).map((item) => String(item.docNum)),
                //     150,
                //     220
                // ),
            },
            {
                accessorKey: "docDate",
                header: "Doc Date",
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {new Date(getValue() as string).toLocaleDateString()}
                    </Text>
                ),
                // filterFn: dateFilterFn,
                enableColumnFilter: true,
                // size: calculateColumnWidth(
                //     "Document Date",
                //     (itrData || []).map((item) =>
                //         new Date(item.docDate).toLocaleDateString()
                //     ),
                //     150,
                //     220
                // ),
            },
            {
                accessorKey: "fromWarehouseId",
                header: "From WH Code",
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                // filterFn: stringFilterFn,
                enableColumnFilter: true,
                // size: calculateColumnWidth(
                //     "From Warehouse Code",
                //     (itrData || []).map((item) => item.fromWarehouseId),
                //     150,
                //     220
                // ),
            },
            {
                accessorKey: "toWarehouseId",
                header: "To WH Code",
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                // filterFn: stringFilterFn,
                enableColumnFilter: true,
                // size: calculateColumnWidth(
                //     "To Warehouse Code",
                //     (itrData || []).map((item) => item.toWarehouseId),
                //     150,
                //     220
                // ),
            },
            {
                accessorKey: "docStatus",
                header: "Doc Status",
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                // filterFn: stringFilterFn,
                enableColumnFilter: true,
                // size: calculateColumnWidth(
                //     "Document Status",
                //     (itrData || []).map((item) => item.docStatus),
                //     150,
                //     180
                // ),
            },
            {
                accessorKey: "itemCode",
                header: "Item Code",
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                // filterFn: stringFilterFn,
                enableColumnFilter: true,
                // size: calculateColumnWidth(
                //     "Item Code",
                //     (itrData || []).map((item) => item.itemCode),
                //     150,
                //     220
                // ),
            },
            {
                accessorKey: "itemName",
                header: "Item Description",
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                // filterFn: stringFilterFn,
                enableColumnFilter: true,
                // size: calculateColumnWidth(
                //     "Item Description",
                //     (itrData || []).map((item) => item.itemName),
                //     200,
                //     300
                // ),
            },
            {
                accessorKey: "groupCode",
                header: "Group Code",
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : "-"}
                    </Text>
                ),
                // filterFn: stringFilterFn,
                enableColumnFilter: true,
                // size: calculateColumnWidth(
                //     "Group Code",
                //     itrData.map((item) => item.groupCode),
                //     200,
                //     220
                // ),
            },
            {
                accessorKey: "groupName",
                header: "Group Name",
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : "-"}
                    </Text>
                ),
                // filterFn: stringFilterFn,
                enableColumnFilter: true,
                // size: calculateColumnWidth(
                //     "Group Name",
                //     itrData.map((item) => item.groupName),
                //     200,
                //     300
                // ),
            },
            {
                accessorKey: "quantity",
                header: "Quantity",
                cell: ({ getValue, row }: any) => {
                    const { quantity } = row?.original;
                    return (
                        <Text c={customStyles.colors._909090} fw={500}>
                            {String(Number(quantity)?.toFixed(2))}
                        </Text>
                    )
                },
                // filterFn: numberFilterFn,
                enableColumnFilter: true,
                // size: calculateColumnWidth(
                //     "Quantity",
                //     (itrData || []).map((item) => String(item.quantity)),
                //     120,
                //     150
                // ),
            },
            {
                accessorKey: "erpDocEntry",
                header: "ERP Doc Entry",
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : "-"}
                    </Text>
                ),
                // filterFn: numberFilterFn,
                enableColumnFilter: true,
                // size: calculateColumnWidth(
                //     "ERP Document Entry",
                //     (itrData || []).map((item) => String(item.erpDocEntry || "-")),
                //     180,
                //     220
                // ),
            },
            {
                accessorKey: "erpObjectType",
                header: "ERP Object Type",
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : "-"}
                    </Text>
                ),
                // filterFn: stringFilterFn,
                enableColumnFilter: true,
                // size: calculateColumnWidth(
                //     "ERP Object Type",
                //     (itrData || []).map((item) => String(item.erpObjectType || "-")),
                //     200,
                //     250
                // ),
            },
            {
                accessorKey: "erpDocLine",
                header: "ERP Doc Line",
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : "-"}
                    </Text>
                ),
                // filterFn: numberFilterFn,
                enableColumnFilter: true,
                // size: calculateColumnWidth(
                //     "ERP Document Line",
                //     (itrData || []).map((item) => String(item.erpDocLine || "-")),
                //     150,
                //     220
                // ),
            },
            {
                accessorKey: "sapStatus",
                header: "SAP Status",
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                // filterFn: stringFilterFn,
                enableColumnFilter: true,
                // size: calculateColumnWidth(
                //     "SAP Status",
                //     (itrData || []).map((item) => item.sapStatus),
                //     180,
                //     200
                // ),
            },
        ],
        [itrData]
    );

    const table = useReactTable({
        data: itrData || [], // Handle undefined/null case
        columns,
        getCoreRowModel: getCoreRowModel(),
        // Remove client-side filtering and sorting for server-side pagination
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        // onSortingChange: setSorting,
        // onGlobalFilterChange: setGlobalFilter,
        // onColumnFiltersChange: setColumnFilters,
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
        //     "docNum",
        //     "docDate",
        //     "fromWarehouseId",
        //     "toWarehouseId",
        //     "docStatus",
        //     "itemCode",
        //     "itemName",
        //     "quantity",
        //     "erpDocEntry",
        //     "erpObjectType",
        //     "erpDocLine",
        //     "sapStatus",
        //   ];
        //   return columnIds.some((colId: string) =>
        //     globalFilterFn(row, colId, value)
        //   );
        // },
        onPaginationChange: setPagination,
        manualPagination: true, // Enable server-side pagination
        pageCount: Math.ceil(itrDataCount / pagination.pageSize), // Calculate total pages from server data
        state: {
            sorting,
            globalFilter,
            columnFilters,
            pagination,
        },
    });

    const handleGlobalSearch = (value: string) => {
        table.setGlobalFilter(String(value));
    };
    return (
        <Modal
            opened={opened}
            onClose={handleModalClose}
            zIndex={10000}
            closeButtonProps={{
                icon: <IconCircleX size={70} stroke={2} color="#ED1C24" />,
            }}
            centered
            // withCloseButton={false}
            size={"100%"}
            radius="md"
            title={
                <Flex direction="column" w="100%">
                    <Text fw={400} fz="lg">
                        Preview
                    </Text>
                    {/* <Divider mt="sm" /> */}
                </Flex>
            }
        >
            {/* Header with close button */}
            {/* <Group justify="space-between" align="flex-start">
                <Text fw={600} size="md">Preview</Text>
                <ActionIcon onClick={handleModalClose} variant="subtle" color="#ED1C24" size="lg">
                    <IconCircleX />
                </ActionIcon>
            </Group> */}

            {/* Document details */}
            <Box mb="md">
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" verticalSpacing="sm">
                    <InfoRow label="Document No" value={String(row?.documentNumber)} />
                    <InfoRow label="Item Code" value={row?.itemNo} />
                    <InfoRow label="Item Description" value={row?.productDescription.length < 20 ? row?.productDescription : row?.productDescription?.slice(0, 20)} />
                    <InfoRow label="UOM" value={row?.uom} />
                    <InfoRow label="Quantity" value={String(row?.quantity)} />
                    <InfoRow label="Remaining Qty" value={String(row?.remainingQuantity)} />
                    <InfoRow label="Planned Date" value={new Date(row?.plannedDate as string).toLocaleDateString()} />
                    <InfoRow label="Origin No" value={String(row?.originNo)} />
                    <InfoRow label="Warehouse" value={row?.warehouse} />
                </SimpleGrid>
            </Box>

            <Divider my="sm" />
            {/* <Stack gap="sm" align="start">
                
            </Stack> */}
            <Stack
                p={24}
                mt={24}
                bg={customStyles.colors.white}
                style={{ borderRadius: "16px", width: "100%", border: "1px solid #E1E7EC" }}
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
                            Inventory Transfer Request
                        </Title>
                    </Stack>
                    <Group gap="xs">
                        <GlobalSearchFilter
                            filters={globalFilter}
                            // setFilters={setGlobalFilter}
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
                <Box w="100%" mah={700} className={"custom-scroll"} style={{ overflow: "auto", height: 300 }}>
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
                                                w={140}
                                                h={140}
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
            </Stack>
        </Modal >
    );
}

