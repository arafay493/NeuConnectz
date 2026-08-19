// Note: Goods Issue Component...!

"use client";

import TitleComponent from '@/components/common/component-title';
import { Box } from '@mantine/core';
import { useMediaQuery } from "@mantine/hooks";
import { memo, useEffect, useReducer, useState } from 'react';
import TableComponent from './TableComponent';


// const initialFilterState = {
//     plantCode: null,
//     whsCode: null,
//     storageLocation: null,
//     confirmationStatus: null,
//     trNumber: null,
//     materialCode: null,
//     materialDoc: null,
//     materialName: null,
//     purchaseOrder: null,
//     createdDate: null,
// };

// const reducer = (state: any, action: any) => {
//     switch (action.type) {
//         case "PLANT":
//             return {
//                 ...state,
//                 plantCode: action.payload
//             };
//         case "WAREHOUSE":
//             return {
//                 ...state,
//                 whsCode: action.payload
//             };
//         case "STORAGELOCATION":
//             return {
//                 ...state,
//                 storageLocation: action.payload
//             };
//         case "CONFIRMATIONSTATUS":
//             return {
//                 ...state,
//                 confirmationStatus: action.payload
//             };

//         case "RESET":
//             return {
//                 plantCode: null,
//                 whsCode: null,
//                 storageLocation: null,
//                 confirmationStatus: null,
//             };
//         default:
//             return state;
//     }

// }



const Component = () => {

    // Note: media query for responsive design
    const isSmallScreen = useMediaQuery('(max-width: 768px)');
    const isMediumScreen = useMediaQuery('(max-width: 1024px)');
    const isLargeScreen = useMediaQuery('(min-width: 1200px)');

    // Note: handling states here...!
    const [tab, setTab] = useState<'Unposted' | 'Posted'>('Unposted');
    const [selectDate, setSelectDate] = useState<string | null>(null);
    const [opened, setOpened] = useState(false);

    const initialFilterState = {
        plant: null,
        warehouse : null,
        storageLocation : null,
        materialCode: null,
        materialDescription: null,
        storageType: null,
        storageBin: null,
        storageSection: null,
        batch: null,
        // showInBags: false,
        // createdDate: null,
        // postedDate: null
    };

    const reducer = (state: any, action: any) => {
        switch (action.type) {
            case "SET_FILTER":
                return {
                    ...state,
                    [action.key]: action.payload,
                };

            case "RESET":
                return initialFilterState;

            default:
                return state;
        }
    };

    // Reducer States
    const [filterState, Dispatch] = useReducer(reducer, initialFilterState as any);

    // useEffect(() => {
    //     handleRefreshToken("Token Expired")
    // }, [])

    // refs
    // const datePickerRef = useRef<HTMLButtonElement | null>(null)
    // const datePickerRef = useRef<HTMLInputElement | null>(null)

    // Note: THis hook will run tab change...!
    useEffect(() => {
        setSelectDate(null);
    }, [tab]);

    return (
        <Box>
            {/* Header section */}
            <TitleComponent
                title="Inventory Management"
                description="Inventory Management Screen."
            />

            {/* Tabs section */}
            {/* <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px',
                position: 'relative'
            }}>
                {(['Unposted', 'Posted'] as const).map((tabOption) => (
                    <button
                        key={tabOption}
                        onClick={() => setTab(tabOption)}
                        style={{
                            flex: 1,
                            padding: '8px 16px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: tab === tabOption ? customStyles.colors._1B59F8 : customStyles.colors._909090,
                            transition: 'border 0.3s ease',
                            borderBottom: tab === tabOption ? `4px solid ${customStyles.colors._1B59F8}` : `2px solid ${customStyles.colors._E1E7EC}`,
                        }}
                    >
                        {tabOption}
                    </button>
                ))}
            </div> */}

            {/* Note: Date selection and export to CSV section */}
            {/* <Group
                p={isSmallScreen ? 16 : 24}
                justify={isSmallScreen ? 'flex-start' : customStyles.alignment.spaceBetween}
                align={isSmallScreen ? 'stretch' : 'flex-end'}
                bg={customStyles.colors.white}
                style={{ borderRadius: '16px' }}
                wrap="wrap"
                gap={isSmallScreen ? 16 : 24}
            >
                <Group
                    w={isSmallScreen ? '100%' : 'auto'}
                    justify={isSmallScreen ? 'center' : 'flex-start'}
                    wrap="wrap"
                    gap={isSmallScreen ? 12 : 16}
                >
                    <Stack
                        gap={4}
                        w={isSmallScreen ? '100%' : isMediumScreen ? '48%' : isLargeScreen ? 300 : 250}
                        maw={isSmallScreen ? '100%' : 350}
                        style={{
                            display: 'flex',
                            flexDirection: isLargeScreen ? 'row' : 'column',
                            alignItems: isLargeScreen ? 'center' : 'flex-start',
                            justifyContent: isLargeScreen ? 'space-between' : 'flex-start',
                        }}
                    >
                        <Text size={isSmallScreen ? "sm" : "md"} mb={4} fw={500}>Select Date</Text>
                        <div className={styles.colFour}>
                            <DatePickerInput
                                // ref={datePickerRef}
                                rightSection={<IconCalendarMonth size={24}
                                // onClick={() => datePickerRef.current?.focus()}
                                />}
                                placeholder="DD/MM/YY"
                                value={selectDate}
                                onChange={(value: string | null) => setSelectDate(value)}
                                radius={8}
                                size='md'
                                clearable
                                maxDate={new Date()}
                                miw={200}
                            />
                        </div>
                    </Stack>
                </Group>

                <div className={styles.colFive}>
                    <Button
                        variant='transparent'
                        className='filledButton'
                        radius={8}
                        size='md'
                        leftSection={<IconBuildingWarehouse size={24} />}
                        // onClick={exportToCSV}
                        fullWidth
                    >
                        Export To CSV
                    </Button>
                </div>
            </Group> */}

            {/* Custom Tab Panels */}
            <div>
                {/* {tab === 'Unposted' && (<UnPostedComponent apiUrl={`/IVendorReturnFeature/GetVendorReturnDocList?sapStatus=Pending` as string} filterState={filterState} Dispatch={Dispatch} />)}
                {tab === 'Posted' && (<PostedComponent apiUrl={`/IVendorReturnFeature/GetVendorReturnDocList?sapStatus=Integrated` as string} filterState={filterState} Dispatch={Dispatch} />)} */}
                <TableComponent apiUrl={`/IStocksFeature/ListAllStocks` as string} filterState={filterState} Dispatch={Dispatch} />
            </div>
        </Box>
    );
};

export default memo(Component);