// Note: Inventory Transfer Request screen...!

"use client";

import React, { useState, useEffect } from 'react';
import {
  Group,
  SegmentedControl,
  Title,
  Stack,
} from '@mantine/core';
import { customStyles } from '@/styles/custom-theme';
import Loader from '@/components/loader/loader';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchAll_ITR_Data } from '@/redux/actions/itr-actions/itr-actions';
import ITR_TableCom from '@/components/itr-table/itr-table';
import TR_TableCom from '@/components/tr-table/tr-table';
import IT_TableCom from '@/components/it-table/it-table';

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

  // Note: Redux dispatch and selector hooks...!
  const dispatch = useAppDispatch();
  const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
  const {
    itrData,
    trData,
    itData,
    itrErrorState
  } = useAppSelector(({ itrStates }) => { return itrStates });
  // console.log("ITR , IT, TR data in Inventory Transfer Request screen: ", itrData);
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

    if (value === 'ITR') {
      dispatch(fetchAll_ITR_Data({
        token: authenticatedUser?.token || '',
        apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA || '',
        type: 'ITR'
      }));
      return;
    };

    if (value === 'TR') {
      dispatch(fetchAll_ITR_Data({
        token: authenticatedUser?.token || '',
        apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_TR_DATA || '',
        type: 'TR'
      }));
      return;
    };

    if (value === 'IT') {
      dispatch(fetchAll_ITR_Data({
        token: authenticatedUser?.token || '',
        apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_IT_DATA || '',
        type: 'IT'
      }));
      return;
    };
  };

  // Note: Mounted effect to fetch ITR data initially...!
  useEffect(() => {
    if (authenticatedUser) {
      dispatch(fetchAll_ITR_Data({
        token: authenticatedUser?.token || '',
        apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA || '',
        type: 'ITR'
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
            Inventory Transfer Request
          </Title>
        </Stack>
      </Group>

      <div style={{ padding: 10, paddingTop: 20 }}>
        <SegmentedControl
          fullWidth
          data={[{ label: 'Inventory Transfer Request', value: 'ITR' }, { label: 'Inventory Transfer', value: 'IT' }, { label: 'Transfer Request', value: 'TR' }]}
          value={tab}
          onChange={(value) => handleTabChange(value as 'ITR' | 'IT' | 'TR')}
          mb="lg"
        />

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
      </div>
    </div>
  );
};

export default InventoryTransferRequestScreen;