import {
    Modal,
    Group,
    Text,
    Flex,
    Divider,
    SimpleGrid,
    Box,
    TextInput,
    Button,
} from "@mantine/core";
import {
    IconCircleX,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import TanStackTable from "@/components/tanStackTable/TanStackTable";
import { fetchAgainstPoNumber } from "@/redux/actions/sap-actions/sap-actions";
import PickingOrderUnPosted_Outbound_View_Columns from "@/components/columns/PickingOrderUnPosted_Outbound_View_Columns";
import { fetchListAllOutboundDetailsByDocNo } from "@/redux/actions/picking-actions/picking-actions";
import IT_Columns from "@/components/columns/IT_Columns";


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
    docNumber: number
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


export default function PickingUnPostedViewDetailsModal({
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
    docNumber
}: ModalProps) {

    const { authenticatedUser } = useAppSelector(({ authStates }) => {
        return authStates;
    });
    const { ListAllPickingOutBoundViewDetailsData } = useAppSelector(({ pickingStates }) => { return pickingStates });
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (authenticatedUser?.token && opened) {
            setIsLoading(true)
            dispatch(
                fetchListAllOutboundDetailsByDocNo({
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

    const columns = PickingOrderUnPosted_Outbound_View_Columns({ pagination, list: ListAllPickingOutBoundViewDetailsData?.data, actions: {} })
    // const columns = IT_Columns({ pagination, list: [], actions: {} })

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
                    <InfoRow label="Document No" value={row?.docNum} />
                    <InfoRow label="Type" value={row?.confirmationStatus} />
                    <InfoRow label="Item Code" value={row?.material} />
                    <InfoRow label="Item No" value={row?.itemNo} />
                    <InfoRow label="Description" value={row?.itemDescription} />

                    <InfoRow label="Warehouse" value={row?.warehouse} />
                    <InfoRow label="Plant" value={row?.plant} />

                    <InfoRow
                        label="Date"
                        value={row?.createdDate ? new Date(row.createdDate).toLocaleDateString() : "-"}
                    />

                    <InfoRow label="Quantity" value={row?.quantity} />
                    <InfoRow label="UOM" value={row?.uom} />

                    <InfoRow label="Delivery No" value={row?.deliveryNo} />
                    <InfoRow label="Reference Document" value={row?.referenceDocument} />

                    <InfoRow label="ERP Transfer Order No" value={row?.erpTransferOrderNo ?? "-"} />
                    <InfoRow label="ERP Material Document" value={row?.erpMaterialDocument ?? "-"} />
                </SimpleGrid>
            </Box>


            <Divider my="sm" />

            <TanStackTable
                data={Array.isArray(ListAllPickingOutBoundViewDetailsData?.data) ? ListAllPickingOutBoundViewDetailsData?.data : []}
                // dataCount={ListAllPickingOutBoundViewDetailsData?.totalCount}
                dataCount={1}
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

