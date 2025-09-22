// Note: Goods Issue Component...!

"use client";

import React, { useState, memo, useEffect } from 'react';
import { Box, Button, Group, Stack, Text } from '@mantine/core';
import { useMediaQuery } from "@mantine/hooks"
import { IconBuildingWarehouse, IconCalendarMonth } from "@tabler/icons-react"
import TitleComponent from '@/components/common/component-title';
import { customStyles } from '@/styles/custom-theme';
import styles from '../../components/grn-movement/GRNMovementFilterBar.module.css'
import { DatePickerInput } from "@mantine/dates"
import GoodsIssuePosted from '../goods-issue-posted/GoodsIssuePosted';
import GoodsIssueUnPosted from "../goods-issue-unposted/GoodsIssueUnPosted"

const GoodsIssueComponent = () => {

    // Note: media query for responsive design
    const isSmallScreen = useMediaQuery('(max-width: 768px)');
    const isMediumScreen = useMediaQuery('(max-width: 1024px)');
    const isLargeScreen = useMediaQuery('(min-width: 1200px)');

    // Note: handling states here...!
    const [tab, setTab] = useState<'Posted' | 'Unposted'>('Posted');
    const [selectDate, setSelectDate] = useState<string | null>(null);
    const [opened, setOpened] = useState(false);

    // Note: THis hook will run tab change...!
    useEffect(() => {
        setSelectDate(null);
    }, [tab]);

    return (
        <Box>
            {/* Header section */}
            <TitleComponent
                title="Goods Issue"
                description="Monitor and review how stock moves between warehouses and systems"
            />

            {/* Tabs section */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '32px',
                position: 'relative'
            }}>
                {(['Posted', 'Unposted'] as const).map((tabOption) => (
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
            </div>

            {/* Note: Date selection and export to CSV section */}
            <Group
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
                    >
                        <Text size={isSmallScreen ? "sm" : "md"} mb={4} fw={500}>Select Date</Text>
                        <div className={styles.colFour}>
                            <DatePickerInput
                                rightSection={<IconCalendarMonth size={24} />}
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
            </Group>

            {/* Custom Tab Panels */}
            <div>
                {tab === 'Posted' && (<GoodsIssuePosted apiUrl={`${process.env.NEXT_PUBLIC_FETCH_ALL_GOOD_ISSUES}?sapStatus=Integrated` as string} />)}
                {tab === 'Unposted' && (<GoodsIssueUnPosted apiUrl={`${process.env.NEXT_PUBLIC_FETCH_ALL_GOOD_ISSUES}?sapStatus=pending` as string} />)}
            </div>
        </Box>
    );
};

export default memo(GoodsIssueComponent);