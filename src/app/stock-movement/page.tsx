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
  TextInput
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconFileTypeCsv } from "@tabler/icons-react";
import { customStyles } from '@/styles/custom-theme';
import Loader from '@/components/loader/loader';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchAll_ITR_Data } from '@/redux/actions/itr-actions/itr-actions';
import ITR_TableCom from '@/components/itr-table/itr-table';
import TR_TableCom from '@/components/tr-table/tr-table';
import IT_TableCom from '@/components/it-table/it-table';
import { filters, sapStatusOptions, docStatusOptions, apiFilterParams, docStatusOptionsFor_IT_TR } from '@/constants/filters';
import { exportDataToCsvFile } from '@/redux/actions/sap-actions/sap-actions';
import { fetchAllWareHouses } from '@/redux/actions/warehouse-actions/warehouse-actions';

const StockMovementScreen = () => {

  // Note: Using useRef to store the previous tab value...!
  const controlRef = useRef<HTMLDivElement>(null);

  // Note: Handeling states here...!
  const [tab, setTab] = useState<'ITR' | 'IT' | 'TR'>('ITR');
  const [loading, setLoading] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});
  const [warehousesOptions, setWarehousesOptions] = useState([]);
  const [finalApiUrl, setFinalApiUrl] = useState("");

  // Note: Redux dispatch and selector hooks...!
  const dispatch = useAppDispatch();
  const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
  const { wareHousesList } = useAppSelector(({ wareHouseStates }) => { return wareHouseStates });

  // Note: Teb onchange handler...!
  const handleTabChange = (value: 'ITR' | 'IT' | 'TR') => {
    // console.log("Tab value: ", value);
    setTab(value);
    // setLoading(true);
    setAppliedFilters({});

    if (value === 'ITR') {
      setFinalApiUrl(process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA || '');
      dispatch(fetchAll_ITR_Data({
        token: authenticatedUser?.token || '',
        apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA || '',
        type: 'ITR',
        handleLoading: () => setLoading(false),
        lastCount: 10,
        skipRecords: 0
      }));
      return;
    };

    if (value === 'TR') {
      setFinalApiUrl(process.env.NEXT_PUBLIC_FETCH_ALL_TR_DATA || '');
      dispatch(fetchAll_ITR_Data({
        token: authenticatedUser?.token || '',
        apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_TR_DATA || '',
        type: 'TR',
        handleLoading: () => setLoading(false),
        lastCount: 10,
        skipRecords: 0
      }));
      return;
    };

    if (value === 'IT') {
      setFinalApiUrl(process.env.NEXT_PUBLIC_FETCH_ALL_IT_DATA || '');
      dispatch(fetchAll_ITR_Data({
        token: authenticatedUser?.token || '',
        apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_IT_DATA || '',
        type: 'IT',
        handleLoading: () => setLoading(false),
        lastCount: 10,
        skipRecords: 0
      }));
      return;
    };
  };

  // Note: Export to CSV handler...!
  const handleExportToCSV = () => {
    // console.log('Tab: ', tab);

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
  };

  // Note: Mounted effect to fetch ITR data initially...!
  useEffect(() => {
    if (authenticatedUser) {
      dispatch(fetchAllWareHouses({ authToken: authenticatedUser?.token || "" }));
    };
  }, []);

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

            setLoading(true);

            if (tab === 'ITR') {
              const queryString = new URLSearchParams(cleanedFilters).toString();
              const modifiedUrl = `${process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA}?${queryString}`;
              setFinalApiUrl(modifiedUrl);

              dispatch(fetchAll_ITR_Data({
                token: authenticatedUser?.token || '',
                apiUrl: modifiedUrl,
                type: tab,
                handleLoading: () => setLoading(false),
                lastCount: 10,
                skipRecords: 0
              }));
            }

            if (tab === 'IT') {
              const queryString = new URLSearchParams(cleanedFilters).toString();
              const modifiedUrl = `${process.env.NEXT_PUBLIC_FETCH_ALL_IT_DATA}?${queryString}`;
              setFinalApiUrl(modifiedUrl);

              dispatch(fetchAll_ITR_Data({
                token: authenticatedUser?.token || '',
                apiUrl: modifiedUrl,
                type: tab,
                handleLoading: () => setLoading(false),
                lastCount: 10,
                skipRecords: 0
              }));
            }

            if (tab === 'TR') {
              const queryString = new URLSearchParams(cleanedFilters).toString();
              const modifiedUrl = `${process.env.NEXT_PUBLIC_FETCH_ALL_TR_DATA}?${queryString}`;
              setFinalApiUrl(modifiedUrl);

              dispatch(fetchAll_ITR_Data({
                token: authenticatedUser?.token || '',
                apiUrl: modifiedUrl,
                type: tab,
                handleLoading: () => setLoading(false),
                lastCount: 10,
                skipRecords: 0
              }));
            }
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

            if (tab === 'ITR') {
              setFinalApiUrl(process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA || "");
              dispatch(fetchAll_ITR_Data({
                token: authenticatedUser?.token || '',
                apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA || '',
                type: tab,
                handleLoading: () => setLoading(false),
                lastCount: 10,
                skipRecords: 0
              }));
            }

            if (tab === 'IT') {
              setFinalApiUrl(process.env.NEXT_PUBLIC_FETCH_ALL_IT_DATA || "");
              dispatch(fetchAll_ITR_Data({
                token: authenticatedUser?.token || '',
                apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_IT_DATA || '',
                type: tab,
                handleLoading: () => setLoading(false),
                lastCount: 10,
                skipRecords: 0
              }));
            }

            if (tab === 'TR') {
              setFinalApiUrl(process.env.NEXT_PUBLIC_FETCH_ALL_TR_DATA || "");
              dispatch(fetchAll_ITR_Data({
                token: authenticatedUser?.token || '',
                apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_TR_DATA || '',
                type: tab,
                handleLoading: () => setLoading(false),
                lastCount: 10,
                skipRecords: 0
              }));
            }
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
          {tab === 'ITR' && (<ITR_TableCom apiUrl={finalApiUrl || process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA as string} />)}

          {/* Note: TR data table */}
          {tab === 'TR' && (<TR_TableCom apiUrl={finalApiUrl || process.env.NEXT_PUBLIC_FETCH_ALL_TR_DATA as string} />)}

          {/* Note: IT data table */}
          {tab === 'IT' && (<IT_TableCom apiUrl={finalApiUrl || process.env.NEXT_PUBLIC_FETCH_ALL_IT_DATA as string} />)}
        </ScrollArea>
      </div>
    </div>
  );
};

export default StockMovementScreen;