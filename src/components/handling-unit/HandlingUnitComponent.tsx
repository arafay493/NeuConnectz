'use client';

import { Box, Card, Grid, Group, Text, Button, Select, ActionIcon } from "@mantine/core";
import { IconBox, IconPackage, IconPlus, IconChevronDown, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import TitleComponent from "../common/component-title";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { deleteHandlingUnit, fetchHandlingUnits } from "@/redux/actions/handling-unit-actions/handling-unit-actions";
import { customStyles } from "@/styles/custom-theme";
import LoaderComponent from "../common/loader/loader";
import axios from "axios";
import showNotificationToast from "@/lib/notification-toast/notification-toast";

const HandlingUnitComponent = () => {
    const dispatch = useAppDispatch();

    const { handlingUnit, totalCount, loading } = useAppSelector(({ handlingUnitStates }) => { return handlingUnitStates; });
    // console.log("Handling Unit Response: ", handlingUnit);
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);

    // Note: Router for route changing
    const router = useRouter();

    // Note: State for pagination
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const scrolToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handlingRouteChange = () => {
        router.push('/handling-unit/add-unit');
    };

    // Note: Function to delete handling unit...!
    // const handleDelete = async (groupId: string) => {
    //     // Implement delete functionality here
    //     // console.log("Delete Handling Unit with Group ID: ", groupId);

    //     const dataToDelete = [];
    //     dataToDelete.push(groupId);

    //     try {
    //         const response = await axios({
    //             method: 'PATCH',
    //             url: `http://163.61.91.173:31131/Track_And_Trace/IGroupFeature/DeleteGroup`,
    //             data: { groupIds: dataToDelete },
    //             headers: {
    //                 'Authorization': `Bearer ${authenticatedUser?.token}`
    //             }
    //         });
    //         // console.log("Delete response: ", response);
    //         const { status, data } = response;

    //         if (status === 200) {
    //             showNotificationToast('HU Deleted', 'Handling Unit Deleted Successfully', customStyles.colors._1B59F8);
    //             dispatch(fetchHandlingUnits({
    //                 lastCount: pagination.pageSize,
    //                 skipRecords: pagination.pageIndex * pagination.pageSize
    //             }));
    //         };
    //     }

    //     catch (error) {
    //         console.log("Error deleting handling unit: ", error);
    //     };
    // }

    const handleDelete = (groupId: string) => {
        dispatch(
            deleteHandlingUnit({
                authToken: authenticatedUser?.token || "",
                groupId,
                resHandler: () => {
                    dispatch(
                        fetchHandlingUnits({
                            authToken: authenticatedUser?.token,
                            lastCount: pagination.pageSize,
                            skipRecords: pagination.pageIndex * pagination.pageSize,
                        })
                    );
                },
            })
        );
    };

    const totalPages = Math.ceil(totalCount / pagination.pageSize);
    const canPreviousPage = pagination.pageIndex > 0;
    const canNextPage = pagination.pageIndex < totalPages - 1;
    const numbersArray = Array.from(
        { length: totalPages },
        (_, index) => index + 1
    );

    useEffect(() => {
        dispatch(fetchHandlingUnits({
            lastCount: pagination.pageSize,
            skipRecords: pagination.pageIndex * pagination.pageSize
        }));
        scrolToTop();
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
                        {handlingUnit.map((group, key) => (
                            <Grid.Col key={group.groupId} span={{ base: 12, md: 6 }}>
                                <Box style={{ borderRadius: '16px', padding: '16px', height: '100%', backgroundColor: customStyles.colors.white }}>
                                    <Group
                                        style={{
                                            // backgroundColor: 'yellow',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        <Text size="xl" fw={600} c={customStyles.colors._4D4D4D}>
                                            {`${pagination.pageIndex * pagination.pageSize + key + 1}) ${group.groupName.charAt(0).toUpperCase()}${group.groupName.slice(1).toLowerCase()}`}
                                        </Text>

                                        <Button
                                            // leftSection={buttonIcon}
                                            // className='filledButton'
                                            variant="transparent"
                                            size="md"
                                            radius={8}
                                            onClick={() => handleDelete(group.groupId)}
                                            style={{ backgroundColor: "red", color: "#fff" }}
                                        >
                                            Delete
                                        </Button>
                                    </Group>

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
                                                                {`${group?.groupStages?.name?.charAt(0)?.toUpperCase()}${group?.groupStages?.name?.slice(1)?.toLowerCase()}`}
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

                <hr />

                {/* Pagination */}
                <Box
                    mt={12}
                    bg={'customStyles.colors.white'}
                    style={{
                        borderRadius: '16px',
                        padding: "12px 24px"
                    }}
                >
                    <Group
                        justify="space-between"
                        align="center"
                    >
                        {/* Left side - Page navigation */}
                        <Group justify="flex-start" align="center" gap="xs">
                            <ActionIcon
                                className={!canPreviousPage ? 'pagination-icon-disabled' : 'pagination-icon'}
                                variant="transparent"
                                size="lg"
                                h={36}
                                w={36}
                                radius={8}
                                c={customStyles.colors._909090}
                                disabled={!canPreviousPage}
                                onClick={() =>
                                    setPagination(prev => ({
                                        ...prev,
                                        pageIndex: prev.pageIndex - 1,
                                    }))
                                }
                            >
                                <IconChevronLeft size={18} />
                            </ActionIcon>

                            <Select
                                w={80}
                                radius={8}
                                rightSection={<IconChevronDown size={18} />}
                                data={numbersArray.map(num => ({
                                    value: String(num),
                                    label: String(num),
                                }))}
                                styles={{
                                    input: {
                                        border: `1px solid ${customStyles.colors._E1E7EC}`,
                                    },
                                }}
                                value={String(pagination.pageIndex + 1)}
                                onChange={(value) => {
                                    const pageIndex = value ? Number(value) - 1 : 0;

                                    setPagination(prev => ({
                                        ...prev,
                                        pageIndex,
                                    }));
                                }}
                            />

                            <ActionIcon
                                className={!canNextPage ? 'pagination-icon-disabled' : 'pagination-icon'}
                                variant="transparent"
                                size="lg"
                                h={36}
                                w={36}
                                radius={8}
                                c={customStyles.colors._909090}
                                disabled={!canNextPage}
                                onClick={() =>
                                    setPagination(prev => ({
                                        ...prev,
                                        pageIndex: prev.pageIndex + 1,
                                    }))
                                }
                            >
                                <IconChevronRight size={18} />
                            </ActionIcon>

                            <Text size="md" c={customStyles.colors._4D4D4D}>
                                / {totalPages} pages
                            </Text>
                        </Group>

                        {/* Right side - Page size selector and info */}
                        <Group gap="md" align="center">
                            <Group gap="xs" align="center">
                                <Text size="sm" c={customStyles.colors._909090}>
                                    Show
                                </Text>
                                <Select
                                    w={80}
                                    radius={8}
                                    rightSection={<IconChevronDown size={18} />}
                                    data={[
                                        { value: '5', label: '5' },
                                        { value: '10', label: '10' },
                                        { value: '20', label: '20' },
                                        { value: '50', label: '50' },
                                        { value: '100', label: '100' }
                                    ]}
                                    styles={{
                                        input: {
                                            border: `1px solid ${customStyles.colors._E1E7EC}`
                                        }
                                    }}
                                    value={String(pagination.pageSize)}
                                    // onChange={value => {
                                    //     const newPageSize = value ? Number(value) : 10;
                                    //     table.setPageSize(newPageSize);
                                    // }}
                                    onChange={(value) => {
                                        const newPageSize = Number(value);

                                        setPagination({
                                            pageIndex: 0,
                                            pageSize: newPageSize,
                                        });
                                    }}
                                />
                                <Text size="sm" c={customStyles.colors._909090}>
                                    per page
                                </Text>
                            </Group>

                            <Text size="sm" c={customStyles.colors._909090}>
                                Showing {(pagination.pageIndex * pagination.pageSize) + 1} to {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount)} of {totalCount} entries
                            </Text>
                        </Group>
                    </Group>
                </Box>
            </Box>

            {/* Loader Overlay with Blurry Background */}
            {loading && (
                <LoaderComponent />
            )}
        </Box>
    )
}

export default HandlingUnitComponent