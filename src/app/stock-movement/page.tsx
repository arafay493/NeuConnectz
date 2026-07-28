// Note: Stock Movement screen...!

"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  Group,
  SegmentedControl,
  Title,
  Stack,
  Button,
  ScrollArea,
  Select,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconFileTypeCsv } from "@tabler/icons-react";
import { customStyles } from '@/styles/custom-theme';
import Loader from '@/components/loader/loader';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchAll_ITR_Data, fetchAll_IT_Data, fetchAll_TR_Data } from '@/redux/actions/itr-actions/itr-actions';
import ITR_TableCom from '@/components/itr-table/itr-table';
import TR_TableCom from '@/components/tr-table/tr-table';
import IT_TableCom from '@/components/it-table/it-table';
import { filters, sapStatusOptions, docStatusOptions, apiFilterParams, docStatusOptionsFor_IT_TR } from '@/constants/filters';
import { exportDataToCsvFile } from '@/redux/actions/sap-actions/sap-actions';
import { fetchAllWareHouses } from '@/redux/actions/warehouse-actions/warehouse-actions';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

const StockMovementScreen = () => {

  // Note: Using useRef to store the previous tab value...!
  const controlRef = useRef<HTMLDivElement>(null);

  // Note: Handeling states here...!
  const [tab, setTab] = useState<'ITR' | 'IT' | 'TR'>('ITR');
  const [loading, setLoading] = useState(false);

  // Note: Filters states...!

  // Note: Multi-filter state...!
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});
  const [warehousesOptions, setWarehousesOptions] = useState([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  // Pagination values for Api call
  const skipRecord = pagination.pageIndex * pagination.pageSize;

  // Note: Redux dispatch and selector hooks...!
  const dispatch = useAppDispatch();
  const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
  const {
    itrData,
    trData,
    itData,
    itrErrorState,
    itrCount,
    trCount,
    itCount
  } = useAppSelector(({ itrStates }) => { return itrStates });
  const { wareHousesList } = useAppSelector(({ wareHouseStates }) => { return wareHouseStates });
  // console.log("ITR data in Inventory Transfer Request screen: ", itrData);
  // console.log("TR data in Inventory Transfer Request screen: ", trData);
  // console.log("IT data in Inventory Transfer Request screen: ", itData);

  // Note: Required variables...!
  // Note: For ITR...!
  const totalPages = Math.ceil(itrCount / pagination.pageSize);

  // Note: For TR...!
  const totalPages_TR = Math.ceil(trCount / pagination.pageSize);

  // Note: For IT...!
  const totalPages_IT = Math.ceil(itCount / pagination.pageSize);

  // Note: Teb onchange handler...!
  const handleTabChange = (value: 'ITR' | 'IT' | 'TR') => {
    // console.log("Tab value: ", value);
    setTab(value);
    setLoading(true);
    setAppliedFilters({});

    if (value === 'ITR') {
      dispatch(fetchAll_ITR_Data({
        token: authenticatedUser?.token || '',
        apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA || '',
        type: 'ITR',
        handleLoading: () => setLoading(false),
        lastCount: pagination.pageSize, // Use page size for server-side pagination
        skipRecords: skipRecord
      }));
      return;
    };

    if (value === 'TR') {
      dispatch(fetchAll_TR_Data({
        token: authenticatedUser?.token || '',
        apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_TR_DATA || '',
        type: 'TR',
        handleLoading: () => setLoading(false),
        lastCount: pagination.pageSize, // Use page size for server-side pagination
        skipRecords: skipRecord
      }));
      return;
    };

    if (value === 'IT') {
      dispatch(fetchAll_IT_Data({
        token: authenticatedUser?.token || '',
        apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_IT_DATA || '',
        type: 'IT',
        handleLoading: () => setLoading(false),
        lastCount: pagination.pageSize, // Use page size for server-side pagination
        skipRecords: skipRecord
      }));
      return;
    };
  };

  // Note: Export to CSV handler...!
  const handleExportToCSV = () => {
    console.log('Tab: ', tab);

    const isFiltersApplied = Object.keys(appliedFilters);

    if (isFiltersApplied.length < 1) {
      if (tab === 'ITR') {
        dispatch(exportDataToCsvFile({
          token: authenticatedUser?.token || "",
          apiUrl: process.env.NEXT_PUBLIC_EXPORT_ITR_TO_EXCEL as string,
          type: 'ITR',
        }));
      }

      if (tab === 'IT') {
        dispatch(exportDataToCsvFile({
          token: authenticatedUser?.token || "",
          apiUrl: process.env.NEXT_PUBLIC_EXPORT_IT_TO_EXCEL as string,
          type: 'IT',
        }));
      }

      if (tab === 'TR') {
        dispatch(exportDataToCsvFile({
          token: authenticatedUser?.token || "",
          apiUrl: process.env.NEXT_PUBLIC_EXPORT_TR_TO_EXCEL as string,
          type: 'TR',
        }));
      }
    }

    else if (isFiltersApplied.length > 0) {
      const cleanedFilters = Object.entries(appliedFilters)
        .filter(([_, value]) => value && value.trim() !== '')
        .reduce((acc, [key, value]) => {
          const paramKey = apiFilterParams[filters.indexOf(key)];
          if (paramKey) acc[paramKey] = value;
          return acc;
        }, {} as Record<string, string>);

      const queryString = new URLSearchParams(cleanedFilters).toString();

      if (tab === 'ITR') {
        dispatch(exportDataToCsvFile({
          token: authenticatedUser?.token || "",
          apiUrl: `${process.env.NEXT_PUBLIC_EXPORT_ITR_TO_EXCEL}?${queryString}` as string,
          type: 'ITR',
        }));
      }

      if (tab === 'IT') {
        dispatch(exportDataToCsvFile({
          token: authenticatedUser?.token || "",
          apiUrl: `${process.env.NEXT_PUBLIC_EXPORT_IT_TO_EXCEL}?${queryString}` as string,
          type: 'IT',
        }));
      }

      if (tab === 'TR') {
        dispatch(exportDataToCsvFile({
          token: authenticatedUser?.token || "",
          apiUrl: `${process.env.NEXT_PUBLIC_EXPORT_TR_TO_EXCEL}?${queryString}` as string,
          type: 'TR',
        }));
      }
    }

    // const rightNow = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
    // if (tab === 'ITR') exportToCSV(paginatedData, `${rightNow} - Inventory Transfer Request.csv`);
    // else if (tab === 'TR') exportToCSV(paginatedData_TR, `${rightNow} - Transfer Request.csv`);
    // else if (tab === 'IT') exportToCSV(paginatedData_IT, `${rightNow} - Inventory Transfer.csv`);
  };

  // Note: Mounted effect to fetch ITR data initially...!
  useEffect(() => {
    if (authenticatedUser) {
      setLoading(true);
      handleTabChange(tab);
      // dispatch(fetchAll_ITR_Data({
      //   token: authenticatedUser?.token || '',
      //   apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA || '',
      //   type: 'ITR',
      //   handleLoading: () => setLoading(false),
      //   lastCount: pagination.pageSize, // Use page size for server-side pagination
      //   skipRecords: skipRecord
      // }));
    };
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    dispatch(fetchAllWareHouses({ authToken: authenticatedUser?.token || "" }));
  }, []);

  useEffect(() => {
    // Reset to first page when tab changes
    setPagination(prev => ({ ...prev, pageIndex: 0, pageSize: 10 }));
  }, [tab]);

  // Note: This hook will run when wareHousesList state wil update...!
  useEffect(() => {
    if (wareHousesList.data && wareHousesList.data.length > 0) {
      const selectWarehouseOptions: any = wareHousesList?.data.map((wh) => ({
        value: wh.whsCode,
        label: wh.whsName,
      }));
      // console.log("Warehouses options: ", selectWarehouseOptions);
      selectWarehouseOptions && setWarehousesOptions(selectWarehouseOptions);
    };
  }, [wareHousesList.data]);

  return (
    <div>

      {/* Note: Loading component */}
      <Loader loadingState={loading} />

      {/* Note: Screen Head section */}
      <Group
        justify={customStyles.alignment.spaceBetween}
        align="flex-start"
        p="md"
        bg="gray.0"
        style={{
          // backgroundColor :"yellow",
          alignItems: "center"
        }}
      >
        <Stack gap={4}>
          <Title
            order={3}
            style={{
              color: customStyles.colors._4D4D4D,
              fontSize: "24px",
              fontWeight: 700
            }}
          >
            Stock Movement
          </Title>

          <Text size="sm" c="dimmed" style={{ color: customStyles.colors._909090 }}>
            Monitor and review how stock moves between warehouses and systems.
          </Text>
        </Stack>

        <Button
          leftSection={<IconFileTypeCsv size={20} color={customStyles.colors.white} />}
          color={customStyles.colors._1B59F8}
          onClick={handleExportToCSV}
        >
          Export to CSV
        </Button>
      </Group>

      {/* Filters */}
      <Group grow align="flex-end" p="md" style={{ flexWrap: "wrap" }}>
        {
          filters.map((filter) => {
            const label = `Select ${filter}`;

            if (filter === "SAP Status" || filter === "DOC Status") {
              const options = filter === "SAP Status" ? sapStatusOptions : ((tab == "ITR") ? (docStatusOptions) : (docStatusOptionsFor_IT_TR));

              return (
                <Select
                  key={filter}
                  label={label}
                  placeholder={label}
                  data={options}
                  value={appliedFilters[filter] || null}
                  onChange={(value) =>
                    setAppliedFilters((prev) => ({
                      ...prev,
                      [filter]: value || '',
                    }))
                  }
                  clearable
                />
              );
            }

            if (filter === "From Warehouse Code" || filter === "To Warehouse Code") {
              return (
                <Select
                  key={filter}
                  label={label}
                  placeholder={label}
                  data={warehousesOptions}
                  // value={appliedFilters[filter] || ''}
                  value={appliedFilters[filter] ? appliedFilters[filter] : null}
                  onChange={(value) => {
                    setAppliedFilters((prev) => ({
                      ...prev,
                      [filter]: value || '',
                    }));
                  }}
                  searchable
                />
              );
            }

            if (filter === "Doc Date") {
              return (
                <DateInput
                  key={filter}
                  label={label}
                  placeholder={label}
                  value={appliedFilters[filter] ? new Date(appliedFilters[filter]) : null}
                  onChange={(date) =>
                    setAppliedFilters((prev) => ({
                      ...prev,
                      [filter]: date ? new Date(date).toISOString().split('T')[0] : '',
                    }))
                  }
                  clearable
                  size="sm"
                  onKeyDown={(e) => e.preventDefault()}
                  popoverProps={{
                    withinPortal: true,
                    styles: {
                      dropdown: {
                        padding: 8,
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        maxWidth: 320,
                      },
                    },
                  }}
                  styles={{
                    input: { fontSize: 14 },
                    calendarHeaderControl: { fontSize: 14, padding: 4, width: 30, height: 30 },
                    calendarHeaderLevel: { fontSize: 16 },
                    day: { fontSize: 13, width: 34, height: 34 },
                  }}
                />
              );
            }

            return null;
          })
        }

        <Button
          mt="xs"
          onClick={() => {
            const cleanedFilters = Object.entries(appliedFilters)
              .filter(([_, value]) => value && value.trim() !== '')
              .reduce((acc, [key, value]) => {
                const paramKey = apiFilterParams[filters.indexOf(key)];
                if (paramKey) acc[paramKey] = value;
                return acc;
              }, {} as Record<string, string>);

            const queryString = new URLSearchParams(cleanedFilters).toString();
            const modifiedUrl = `${process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA}?${queryString}`;

            setLoading(true);
            dispatch(fetchAll_ITR_Data({
              token: authenticatedUser?.token || '',
              apiUrl: modifiedUrl,
              type: tab,
              handleLoading: () => setLoading(false),
            }));
          }}
          disabled={Object.values(appliedFilters).every(v => !v || v.trim() === '')}
        >
          Apply Filters
        </Button>

        <Button
          variant="outline"
          color="red"
          mt="xs"
          onClick={() => {
            setAppliedFilters({});
            setLoading(true);
            dispatch(fetchAll_ITR_Data({
              token: authenticatedUser?.token || '',
              apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA || '',
              type: tab,
              handleLoading: () => setLoading(false)
            }));
          }}
        >
          Clear All
        </Button>
      </Group>


      <div style={{ padding: 10, paddingTop: 20 }}>

        <div ref={controlRef}>
          <SegmentedControl
            fullWidth
            mb="lg"
            value={tab}
            onChange={(value) => handleTabChange(value as 'ITR' | 'IT' | 'TR')}
            data={[
              {
                label: (
                  <div onClick={() => handleTabChange('ITR')}>
                    Inventory Transfer Request
                  </div>
                ),
                value: 'ITR',
              },
              {
                label: (
                  <div onClick={() => handleTabChange('IT')}>
                    Inventory Transfer
                  </div>
                ),
                value: 'IT',
              },
              {
                label: (
                  <div onClick={() => handleTabChange('TR')}>
                    Transfer Receipt
                  </div>
                ),
                value: 'TR',
              },
            ]}
          />
        </div>

        <ScrollArea type='auto'>

          {/* Note: ITR data table */}
          {
            tab === 'ITR' && (
              <ITR_TableCom
                paginatedData={itrData}
                totalPages={totalPages}
                activePage={pagination.pageIndex + 1}
                setPage={(page: number) => setPagination(prev => ({ ...prev, pageIndex: page - 1 }))}
                itemsPerPage={pagination.pageSize}
                setItemsPerPage={(pageSize: number) => setPagination(prev => ({ ...prev, pageSize }))}
                itrErrorState={itrErrorState}
              />
            )
          }

          {/* Note: TR data table */}
          {
            tab === 'TR' && (
              <TR_TableCom
                paginatedData={trData}
                totalPages={totalPages_TR}
                activePage={pagination.pageIndex + 1}
                setPage={(page: number) => setPagination(prev => ({ ...prev, pageIndex: page - 1 }))}
                itemsPerPage={pagination.pageSize}
                setItemsPerPage={(pageSize: number) => setPagination(prev => ({ ...prev, pageSize }))}
                itrErrorState={itrErrorState}
              />
            )
          }

          {/* Note: IT data table */}
          {
            tab === 'IT' && (
              <IT_TableCom
                paginatedData={itData}
                totalPages={totalPages_IT}
                activePage={pagination.pageIndex + 1}
                setPage={(page: number) => setPagination(prev => ({ ...prev, pageIndex: page - 1 }))}
                itemsPerPage={pagination.pageSize}
                setItemsPerPage={(pageSize: number) => setPagination(prev => ({ ...prev, pageSize }))}
                itrErrorState={itrErrorState}
              />
            )
          }
        </ScrollArea>
      </div>
    </div>
  );
};

export default StockMovementScreen;