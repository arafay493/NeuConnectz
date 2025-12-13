import {
    Modal,
    Group,
    Text,
    Flex,
    Divider,
    SimpleGrid,
    Box,
} from "@mantine/core";
import {
    IconCircleX,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import TanStackTable from "@/components/tanStackTable/TanStackTable";
import InBoundSto_View_Columns from "@/components/columns/InBoundSto_View_Columns";
import { fetchListAllInboundStoDetailsByDocNo } from "@/redux/actions/inbound-sto-actions/inbound-sto-actions";


interface ModalProps {
    opened: boolean;
    handleModalClose: () => void;
    row: any
    isLoading: boolean
    pagination: any
    setPagination: any,
    title: string,
    subTitle: string,
    skipRecord: number,
    setIsLoading: any,
    apiUrl: string,
    docNumber: number,
    isPosted: boolean
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <Group gap="xs">
            <Text fw={500} size="sm" c="dark.6">
                {label}:
            </Text>
            <Text size="sm" c="dimmed">
                {value}
            </Text>
        </Group>
    );
}


export default function InBoundStoViewDetailsModal({
    opened,
    handleModalClose,
    row,
    isLoading,
    pagination,
    setPagination,
    title,
    subTitle,
    skipRecord,
    setIsLoading,
    apiUrl,
    docNumber,
    isPosted,
}: ModalProps) {

    const { authenticatedUser } = useAppSelector(({ authStates }) => {
        return authStates;
    });
    const { ListAllInBoundStoViewDetailsData } = useAppSelector(({ inboundStoStates }) => { return inboundStoStates });
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (authenticatedUser?.token && opened) {
            setIsLoading(true)
            dispatch(
                fetchListAllInboundStoDetailsByDocNo({
                    authToken: authenticatedUser?.token || "",
                    docNumber: docNumber,
                    apiUrl: apiUrl,
                    lastCount: pagination.pageSize,
                    skipRecords: skipRecord,
                })
            ).finally(() => {
                setIsLoading(false);
            });
        }
    }, [
        pagination.pageIndex,
        pagination.pageSize,
        apiUrl,
        docNumber
    ]);

    const columns = InBoundSto_View_Columns({ pagination, list: ListAllInBoundStoViewDetailsData?.data, actions: {} })

    return (
        <Modal
            opened={opened}
            onClose={handleModalClose}
            zIndex={10000}
            closeButtonProps={{
                icon: <Box p={4} style={{ backgroundColor: "#E1E7EC80", borderRadius: 5 }}><IconCircleX size={30} stroke={2} color="#ED1C24" /></Box>,
            }}
            centered
            // withCloseButton={false}
            size={"100%"}
            radius="md"
            title={
                <Flex direction="column" w="100%">
                    <Text fw={400} fz="lg">
                        Preview
                    </Text>
                </Flex>
            }
        >

            <Box mb="md">
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" verticalSpacing="sm">
                    <InfoRow label="Document No" value={row?.docNum || "-"} />
                    <InfoRow label="STO No" value={row?.stoNo || "-"} />
                    <InfoRow label="Outbound Delivery No" value={row?.outboundDeliveryNo || "-"} />

                    <InfoRow label="Issuing Plant" value={row?.issuingPlant || "-"} />
                    <InfoRow label="Receiving Plant" value={row?.receivingPlant || "-"} />
                    <InfoRow label="Receiving Warehouse" value={row?.receivingWarehouse || "-"} />
                    <InfoRow
                        label="Receiving Storage Location"
                        value={row?.receivingStorageLocation || "-"}
                    />

                    <InfoRow
                        label="Created Date"
                        value={
                            row?.createdDate
                                ? new Date(row.createdDate).toLocaleDateString()
                                : "-"
                        }
                    />

                    {isPosted && (
                        <InfoRow
                            label="Posted Date"
                            value={
                                row?.postedDate
                                    ? new Date(row.postedDate).toLocaleDateString()
                                    : "-"
                            }
                        />
                    )}

                    <InfoRow label="Total Quantity" value={row?.totalQuantity || "-"} />
                    <InfoRow label="Total Items" value={row?.totalItems || "-"} />
                    <InfoRow label="Confirmation Status" value={row?.confirmationStatus || "-"} />

                    {isPosted && (
                        <>
                            <InfoRow
                                label="ERP Transfer Order"
                                value={row?.erpTransferOrder || "-"}
                            />
                            <InfoRow
                                label="ERP Material Document"
                                value={row?.erpMaterialDocument || "-"}
                            />
                        </>
                    )}
                </SimpleGrid>
            </Box>



            <Divider my="sm" />

            <TanStackTable
                data={Array.isArray(ListAllInBoundStoViewDetailsData?.data) ? ListAllInBoundStoViewDetailsData?.data : []}
                dataCount={ListAllInBoundStoViewDetailsData?.totalCount}
                columns={columns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={pagination}
                setPagination={setPagination}
                subTitle={subTitle}
                title={title}
                skipRecord={skipRecord}
            />

            {/* Footer Section */}
            {/* <Flex
                justify="flex-end"
                align="center"
                mt="lg"
                pt="md"
            >
                <Button
                    variant="transparent"
                    className="filledButton"
                    radius={8}
                    miw={200}
                // onClick={() => actions.handleConfirmModalOpen(row.original)}
                >
                    Post
                </Button>
            </Flex> */}
        </Modal>
    );
}

