// Note: Inventory Transfer Request screen...!

"use client";

import React, { useState, useEffect } from 'react';
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
import { filters, sapStatusOptions, docStatusOptions } from '@/constants/filters';

const InventoryTransferRequestScreen = () => {

  // Note: Handeling states here...!
  const [tab, setTab] = useState<'ITR' | 'IT' | 'TR'>('ITR');
  const [loading, setLoading] = useState(false);
  // Note: For ITR...!
  const [activePage, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Note: For TR...!
  const [activePage_TR, setPage_TR] = useState(1);
  const [itemsPerPage_TR, setItemsPerPage_TR] = useState(10);

  // Note: For IT...!
  const [activePage_IT, setPage_IT] = useState(1);
  const [itemsPerPage_IT, setItemsPerPage_IT] = useState(10);

  // Note: Filters states...!
  const [selectFilter, setSelectFilter] = useState<string | null>(null);
  const [appliedFilter, setAppliedFilter] = useState<string | null>(null);

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
    setSelectFilter(null);
    setAppliedFilter(null);

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

  // Note: Handle filter dropdown onchange...!
  const handleFilterOnChange = (val: string | null) => {
    if (val === null) {
      // console.log('Clear button clicked!');
      setSelectFilter(null);
      setAppliedFilter(null);
      setTab('ITR');

      dispatch(fetchAll_ITR_Data({
        token: authenticatedUser?.token || '',
        apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA || '',
        type: tab,
        handleLoading: () => setLoading(false)
      }));
    }

    else {
      // console.log('Selected:', val);
      setSelectFilter(val);
    };
  };

  // Note: Function to applied filter...!
  const handleAppliedFilter = () => {
    if (selectFilter && appliedFilter) {
      // console.log(`Applied Filter: ${appliedFilter}`);
      setLoading(true);

      if (tab === 'ITR') {
        dispatch(fetchAll_ITR_Data({
          token: authenticatedUser?.token || '',
          apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA || '',
          type: 'ITR',
          handleLoading: () => setLoading(false),
          filterIndex: filters.indexOf(selectFilter),
          appliedFilter: appliedFilter || null
        }));
        return;
      };

      if (tab === 'IT') {
        dispatch(fetchAll_ITR_Data({
          token: authenticatedUser?.token || '',
          apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_IT_DATA || '',
          type: 'IT',
          handleLoading: () => setLoading(false),
          filterIndex: filters.indexOf(selectFilter),
          appliedFilter: appliedFilter || null
        }));
        return;
      };

      if (tab === 'TR') {
        dispatch(fetchAll_ITR_Data({
          token: authenticatedUser?.token || '',
          apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_TR_DATA || '',
          type: 'TR',
          handleLoading: () => setLoading(false),
          filterIndex: filters.indexOf(selectFilter),
          appliedFilter: appliedFilter || null
        }));
        return;
      };
    };
  };

  // Note: Mounted effect to fetch ITR data initially...!
  useEffect(() => {
    if (authenticatedUser) {
      setLoading(true);
      setSelectFilter(null);
      setAppliedFilter(null);
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
      <Group grow align="flex-end" p='md'>
        <Select
          label="Selected Filter"
          placeholder="Select Filter"
          data={filters}
          value={selectFilter}
          onChange={handleFilterOnChange}
          clearable
        />

        {
          (selectFilter == "SAP Status" || selectFilter == "DOC Status") &&
          <Select
            label={`Select ${selectFilter}`}
            placeholder={`Select ${selectFilter}`}
            data={selectFilter == "SAP Status" ? sapStatusOptions : docStatusOptions}
            value={appliedFilter}
            onChange={(value) => setAppliedFilter(value as string)}
          />
        }

        {
          (selectFilter == "From Warehouse Code" || selectFilter == "To Warehouse Code") &&
          <TextInput
            label={`Enter ${selectFilter}`}
            placeholder={`Enter ${selectFilter}`}
            value={appliedFilter || ''}
            onChange={(e) => setAppliedFilter(e.target.value)}
          />
        }

        {
          (selectFilter == "Doc Date") &&
          <DateInput
            label="Select Doc Date"
            placeholder="Select Doc Date"
            value={appliedFilter ? new Date(appliedFilter) : null}
            onChange={(date) => setAppliedFilter(date ? date : null)}
            clearable
            size="sm" // makes the input smaller
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
              input: {
                fontSize: 14,
              },
              calendarHeaderControl: {
                fontSize: 14,
                padding: 4,
                width: 30,
                height: 30,
              },
              calendarHeaderLevel: {
                fontSize: 16,
              },
              day: {
                fontSize: 13,
                width: 34,
                height: 34,
              },
            }}
          />
        }

        <Button
          mt="xs"
          disabled={!selectFilter || !appliedFilter}
          onClick={handleAppliedFilter}
        >
          Applied Filter
        </Button>
      </Group>

      <div style={{ padding: 10, paddingTop: 20 }}>
        <SegmentedControl
          fullWidth
          data={[{ label: 'Inventory Transfer Request', value: 'ITR' }, { label: 'Inventory Transfer', value: 'IT' }, { label: 'Transfer Request', value: 'TR' }]}
          value={tab}
          onChange={(value) => handleTabChange(value as 'ITR' | 'IT' | 'TR')}
          mb="lg"
        />

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