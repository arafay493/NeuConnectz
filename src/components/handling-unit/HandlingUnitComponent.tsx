'use client';

import { Box, Card, Grid, Group, Text, Loader, Center } from "@mantine/core";
import { IconBox, IconPackage, IconPlus } from "@tabler/icons-react";
import { PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import TitleComponent from "../common/component-title";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchHandlingUnits } from "@/redux/actions/handling-unit-actions/handling-unit-actions";
import { customStyles } from "@/styles/custom-theme";
import LoaderComponent from "../common/loader/loader";

const HandlingUnitComponent = () => {
    const dispatch = useAppDispatch();

    const { handlingUnit, totalCount, loading } = useAppSelector(({ handlingUnitStates }) => { return handlingUnitStates; })

    // Note: Router for route changing
    const router = useRouter();

    // Note: State for pagination
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10, // Adjusted to a more reasonable default
    });

    const handlingRouteChange = () => {
        router.push('/handling-unit/add-unit');
    }

    useEffect(() => {
        dispatch(fetchHandlingUnits({
            lastCount: pagination.pageSize,
            skipRecords: pagination.pageIndex * pagination.pageSize
        }))
    }, [pagination.pageIndex, pagination.pageSize, dispatch]);

    return (
        <Box style={{ position: 'relative' }}>
            <TitleComponent
                title="Handling Unit"
                description="Create and manage Handling Unit for your products."
                buttonText='Add Handling Unit'
                isButton
                buttonIcon={<IconPlus size={16} />}
                handleOnClick={handlingRouteChange}
            />

            <Box style={{
                filter: loading ? 'blur(2px)' : 'none',
                transition: 'all 0.3s ease',
                pointerEvents: loading ? 'none' : 'auto'
            }}>
                {handlingUnit && handlingUnit.length > 0 && (
                    <Grid gutter={24}>
                        {handlingUnit.map((group) => (
                            <Grid.Col key={group.groupId} span={{ base: 12, md: 6 }}>
                                <Box style={{ borderRadius: '16px', padding: '16px', height: '100%', backgroundColor: customStyles.colors.white }}>
                                    <Text size="xl" fw={600} mb="sm" c={customStyles.colors._4D4D4D}>
                                        {group.groupName}
                                    </Text>

                                    {/* Main Stage */}
                                    <Grid mb="sm">
                                        <Grid.Col span={12}>
                                            <Card
                                                padding="md"
                                                radius="md"
                                                shadow='none'
                                                withBorder
                                                style={{
                                                    border: `1px solid ${customStyles.colors._ECECEC}`,
                                                    backgroundColor: '#fff',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <Group justify="space-between">
                                                    <Group gap="sm">
                                                        <IconPackage
                                                            size={24}
                                                            color={customStyles.colors._909090}
                                                        />
                                                        <Box>
                                                            <Text size="sm" fw={600}>
                                                                {group.groupStages.name}
                                                            </Text>
                                                            <Text size="xs" c="gray.6">
                                                                Level {group.groupStages.level} • Capacity: {group.groupStages.capacity}
                                                            </Text>
                                                        </Box>
                                                    </Group>
                                                </Group>
                                            </Card>
                                        </Grid.Col>
                                    </Grid>

                                    {/* Sub Stages */}
                                    {group.groupStages.subStages && group.groupStages.subStages.length > 0 && (
                                        <Box ml="md">
                                            <Text size="sm" fw={500} mb="xs" c="gray.7">
                                                Sub Stages:
                                            </Text>
                                            <Grid>
                                                {group.groupStages.subStages.map((subStage: any) => (
                                                    <Grid.Col key={subStage.id} span={{ base: 12, md: 6 }}>
                                                        <Card
                                                            padding="sm"
                                                            radius="md"
                                                            withBorder
                                                            shadow='none'
                                                            style={{
                                                                border: `1px solid ${customStyles.colors._ECECEC}`,
                                                                backgroundColor: '#fff',
                                                                transition: 'all 0.2s ease',
                                                            }}
                                                        >
                                                            <Group gap="sm">
                                                                <IconBox
                                                                    size={20}
                                                                    color={customStyles.colors._909090}
                                                                />
                                                                <Box>
                                                                    <Text size="sm" fw={500}>
                                                                        {subStage.name}
                                                                    </Text>
                                                                    <Text size="xs" c="gray.6">
                                                                        Level {subStage.level} • Capacity: {subStage.capacity}
                                                                    </Text>
                                                                </Box>
                                                            </Group>
                                                        </Card>
                                                    </Grid.Col>
                                                ))}
                                            </Grid>
                                        </Box>
                                    )}
                                </Box>
                            </Grid.Col>
                        ))}
                    </Grid>
                )}
            </Box>

            {/* Loader Overlay with Blurry Background */}
            {loading && (
                <LoaderComponent />
            )}
        </Box>
    )
}

export default HandlingUnitComponent