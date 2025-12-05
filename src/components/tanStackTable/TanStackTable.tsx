import { customStyles } from '@/styles/custom-theme';
import { ActionIcon, Box, Button, Group, Image, Select, Stack, Text, Title } from '@mantine/core'
import { IconArrowNarrowDown, IconArrowNarrowUp, IconArrowsUpDown, IconBorderCorners, IconChevronDown, IconChevronLeft, IconChevronRight, IconColumns, IconFileImport, IconFilter, IconFilterOff, IconSearch, IconSearchOff } from '@tabler/icons-react';
import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table';
import React, { memo, useMemo, useState } from 'react'
import { TableColumnsFilter } from '../table-filters/TableColumnsFilter';
import NextImage from "next/image";
import { localAssets } from '@/lib/file-paths/file-paths';
import { GlobalSearchFilter } from '../table-filters/GlobalSearchFilter';
import { useAppSelector } from '@/redux/store';

const TanStackTable = ({ data, dataCount, columns, isLoading, isInsideModalTable, pagination, setPagination, title, skipRecord, subTitle, isCsvExport, handleExportToCSV = () => { } }: any) => {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
    const [areTableFiltersVisible, setAreTableFiltersVisible] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const { putaway_unposted_columns } = useAppSelector(({ columnBasedAccessControlStates }) => { return columnBasedAccessControlStates });

    const table = useReactTable({
        data: data || [],
        columns: columns || [],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        manualPagination: true,
        pageCount: Math.ceil(dataCount / pagination.pageSize),
        state: {
            sorting,
            globalFilter,
            columnFilters,
            pagination,
            columnVisibility: {
                putawayUnposted_serialNumber: putaway_unposted_columns.serialNumber.value,
                putawayUnposted_docNum: putaway_unposted_columns.docNum.value,
                putawayUnposted_transferReceiptNumber: putaway_unposted_columns.transferReceiptNumber.value,
                putawayUnposted_material: putaway_unposted_columns.material.value,
                putawayUnposted_materialDescription: putaway_unposted_columns.materialDescription.value,
                putawayUnposted_materialDocument: putaway_unposted_columns.materialDocument.value,
                putawayUnposted_baseUOM: putaway_unposted_columns.baseUOM.value,
                putawayUnposted_totalQuantity: putaway_unposted_columns.totalQuantity.value,
                putawayUnposted_movementType: putaway_unposted_columns.movementType.value,
                putawayUnposted_purchaseOrder: putaway_unposted_columns.purchaseOrder.value,
                putawayUnposted_supplierName: putaway_unposted_columns.supplierName.value,
                putawayUnposted_sourceStorageBin: putaway_unposted_columns.sourceStorageBin.value,
                putawayUnposted_confirmationStatus: putaway_unposted_columns.confirmationStatus.value,
                putawayUnposted_createdOn: putaway_unposted_columns.createdOn.value,
                putawayUnposted_Actions: putaway_unposted_columns.actions.value,
            }
        },
    });
    const numbersArray = useMemo<number[]>(() => {
        return Array.from({ length: table.getPageCount() }, (_, i) => i + 1);
    }, [table.getPageCount()]);

    const handleSearchInputVisibility = () => {
        setIsSearchInputVisible(!isSearchInputVisible);
        setGlobalFilter("");
    };

    const handleTableFiltersVisibility = () => {
        setAreTableFiltersVisible(!areTableFiltersVisible);
        // Reset all filters
        table.getAllColumns().forEach((col) => {
            if (col.getCanFilter()) {
                col.setFilterValue(undefined);
            }
        });
    };
    const handleGlobalSearch = (value: string) => {
        table.setGlobalFilter(String(value));
    };
    return (
        <Stack
            p={24}
            mt={24}
            bg={customStyles.colors.white}
            style={{
                position: isFullscreen ? "fixed" : "relative",
                top: isFullscreen ? 0 : "auto",
                left: isFullscreen ? 0 : "auto",
                width: isFullscreen ? "100vw" : "100%",
                height: isFullscreen ? "100vh" : "auto",
                zIndex: isFullscreen ? 9999 : "auto",
                padding: 16,
                borderRadius: "16px", border: "1px solid #E1E7EC"
            }}
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
                        {title}
                    </Title>
                    {subTitle ? <Title order={3} mb={8} c={customStyles.colors._909090} style={{ fontWeight: 600, fontSize: 16 }}>
                        {subTitle}
                    </Title> : null}
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
                    {/* <IconColumns cursor="pointer" size={24} />
                    <IconBorderCorners cursor="pointer" size={24}
                    // onClick={() => setIsFullscreen(!isFullscreen)} 
                    /> */}
                    {isCsvExport && <Button
                        variant='transparent'
                        className='filledButton'
                        radius={8}
                        size='md'
                        leftSection={<IconFileImport size={24} />}
                        onClick={handleExportToCSV}
                    >
                        Export To CSV
                    </Button>}
                </Group>
            </Group>
            <Box w="100%" className={"custom-scroll"} style={{ overflow: "auto" }}>
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
                                            padding: "0 16px 16px 11px",
                                            borderBottom: `1px solid ${customStyles.colors._E1E7EC || "#E5E5E5"
                                                }`,
                                            width: `${header.getSize()}px`,
                                            textAlign: "center",
                                            // minWidth: `${header.getSize()}px`,
                                            // maxWidth: `${header.getSize()}px`,
                                            verticalAlign: "top",
                                            whiteSpace: "nowrap",
                                            userSelect: "none",
                                        }}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <Group wrap="nowrap" justify="center">
                                            <Group
                                                wrap="nowrap"
                                                justify="center"
                                            // onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <Box fw={600} c={customStyles.colors._4D4D4D}>
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                </Box>

                                            </Group>
                                            {header.column.getCanSort() && (
                                                <Button
                                                    variant="subtle"
                                                    size="xs"
                                                    c={customStyles.colors._4D4D4D}
                                                    p={0}
                                                    px={5}
                                                    onClick={(e) => {
                                                        header.column.getToggleSortingHandler()
                                                    }}
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
                                                </Button>
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
                                                onClick={(e: any) => e.stopPropagation()} // 💥 prevent sorting click
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
                                    {columns.map((_: any, colIndex: any) => (
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
                                                textAlign: "center",
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

            {/* Pagination */}
            <Box
                mt={12}
                bg={customStyles.colors.white}
                style={{ borderRadius: "16px", padding: "12px 24px" }}
            >
                <Group justify="space-between" align="center">
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
                                comboboxProps={{ withinPortal: false }}
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

                    <Group gap="md" align="center">
                        <Group gap="xs" align="center">
                            <Text size="sm" c={customStyles.colors._909090}>
                                Show
                            </Text>
                            <Select
                                // comboboxProps={{ withinPortal: false }}
                                w={80}
                                radius={8}
                                rightSection={<IconChevronDown size={18} />}
                                comboboxProps={{
                                    withinPortal: false,
                                    position: "top",
                                }}
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
                            {Math.min(skipRecord + pagination.pageSize, dataCount)} of{" "}
                            {dataCount} entries
                        </Text>
                    </Group>
                </Group>
            </Box>
        </Stack>
    )
}

export default memo(TanStackTable)
