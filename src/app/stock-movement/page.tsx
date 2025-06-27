// Note: Inventory Transfer Request screen...!

"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
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
import { exportToCSV } from '@/constants/export-to-csv';
import { filters, sapStatusOptions, docStatusOptions, apiFilterParams } from '@/constants/filters';

const InventoryTransferRequestScreen = () => {

  // Note: Using useRef to store the previous tab value...!
  const controlRef = useRef<HTMLDivElement>(null);

  // Note: Handeling states here...!
  const [tab, setTab] = useState<'ITR' | 'IT' | 'TR'>('ITR');
  const [loading, setLoading] = useState(false);
  const [activePage, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Note: For TR...!
  const [activePage_TR, setPage_TR] = useState(1);
  const [itemsPerPage_TR, setItemsPerPage_TR] = useState(10);

  // Note: For IT...!
  const [activePage_IT, setPage_IT] = useState(1);
  const [itemsPerPage_IT, setItemsPerPage_IT] = useState(10);

  // Note: Filters states...!

  // Note: Multi-filter state...!
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});

  // Note: Redux dispatch and selector hooks...!
  const dispatch = useAppDispatch();
  const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
  const {
    itrData,
    trData,
    itData,
    itrErrorState
  } = useAppSelector(({ itrStates }) => { return itrStates });
  // console.log("ITR data in Inventory Transfer Request screen: ", itrData);
  // console.log("TR data in Inventory Transfer Request screen: ", trData);
  // console.log("IT data in Inventory Transfer Request screen: ", itData);

  // Note: Required variables...!
  // Note: For ITR...!
  const totalPages = Math.ceil(itrData.length / itemsPerPage);
  const paginatedData = itrData.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  // Note: For TR...!
  const totalPages_TR = Math.ceil(trData.length / itemsPerPage_TR);
  const paginatedData_TR = trData.slice((activePage_TR - 1) * itemsPerPage_TR, activePage_TR * itemsPerPage_TR);

  // Note: For IT...!
  const totalPages_IT = Math.ceil(itData.length / itemsPerPage_IT);
  const paginatedData_IT = itData.slice((activePage_IT - 1) * itemsPerPage_IT, activePage_IT * itemsPerPage_IT);

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
      }));
      return;
    };

    if (value === 'TR') {
      dispatch(fetchAll_ITR_Data({
        token: authenticatedUser?.token || '',
        apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_TR_DATA || '',
        type: 'TR',
        handleLoading: () => setLoading(false)
      }));
      return;
    };

    if (value === 'IT') {
      dispatch(fetchAll_ITR_Data({
        token: authenticatedUser?.token || '',
        apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_IT_DATA || '',
        type: 'IT',
        handleLoading: () => setLoading(false)
      }));
      return;
    };
  };

  // Note: Export to CSV handler...!
  const handleExportToCSV = () => {
    if (tab === 'ITR') exportToCSV(paginatedData, 'inventory_transfer_request.csv');
    else if (tab === 'TR') exportToCSV(paginatedData_TR, 'transfer_request.csv');
    else if (tab === 'IT') exportToCSV(paginatedData_IT, 'inventory_transfer.csv');
  };

  // Note: Function to applied filter...!
  // const handleAppliedFilter = () => {
  //   const cleanedFilters = Object.entries(appliedFilters)
  //     .filter(([_, value]) => value) // remove empty
  //     .reduce((acc, [key, value]) => {
  //       const paramKey = apiFilterParams[filters.indexOf(key)];
  //       if (paramKey) acc[paramKey] = value;
  //       return acc;
  //     }, {} as Record<string, string>);

  //   const queryString = new URLSearchParams(cleanedFilters).toString();

  //   const modifiedUrl = `${process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA}?${queryString}`;

  //   dispatch(fetchAll_ITR_Data({
  //     token: authenticatedUser?.token || '',
  //     apiUrl: modifiedUrl,
  //     type: tab,
  //     handleLoading: () => setLoading(false),
  //   }));
  // };

  // Note: Mounted effect to fetch ITR data initially...!
  useEffect(() => {
    if (authenticatedUser) {
      setLoading(true);
      dispatch(fetchAll_ITR_Data({
        token: authenticatedUser?.token || '',
        apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA || '',
        type: 'ITR',
        handleLoading: () => setLoading(false)
      }));
    };
  }, []);

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
      >
        <Stack gap={4}>
          <Title order={3} style={{ color: customStyles.colors._4D4D4D }}>
            Stock Movement
          </Title>
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
              const options = filter === "SAP Status" ? sapStatusOptions : docStatusOptions;

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
                <TextInput
                  key={filter}
                  label={label}
                  placeholder={label}
                  value={appliedFilters[filter] || ''}
                  onChange={(e) =>
                    setAppliedFilters((prev) => ({
                      ...prev,
                      [filter]: e.target.value,
                    }))
                  }
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
              handleLoading: () => setLoading(false)
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
                    Transfer Request
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
                paginatedData={paginatedData}
                totalPages={totalPages}
                activePage={activePage}
                setPage={setPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                itrErrorState={itrErrorState}
              />
            )
          }

          {/* Note: TR data table */}
          {
            tab === 'TR' && (
              <TR_TableCom
                paginatedData={paginatedData_TR}
                totalPages={totalPages_TR}
                activePage={activePage_TR}
                setPage={setPage_TR}
                itemsPerPage={itemsPerPage_TR}
                setItemsPerPage={setItemsPerPage_TR}
                itrErrorState={itrErrorState}
              />
            )
          }

          {/* Note: IT data table */}
          {
            tab === 'IT' && (
              <IT_TableCom
                paginatedData={paginatedData_IT}
                totalPages={totalPages_IT}
                activePage={activePage_IT}
                setPage={setPage_IT}
                itemsPerPage={itemsPerPage_IT}
                setItemsPerPage={setItemsPerPage_IT}
                itrErrorState={itrErrorState}
              />
            )
          }
        </ScrollArea>
      </div>
    </div>
  );
};

export default InventoryTransferRequestScreen;