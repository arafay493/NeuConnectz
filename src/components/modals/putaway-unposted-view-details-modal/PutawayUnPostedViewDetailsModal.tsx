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
import { useEffect, useState } from "react";
import TanStackTable from "@/components/tanStackTable/TanStackTable";
import ITR_Columns from "@/components/columns/ITR_Columns";
import { fetchAgainstPoNumber } from "@/redux/actions/sap-actions/sap-actions";
import IT_Columns from "@/components/columns/IT_Columns";
import { fetchListAllPutAwayDetalisByDocNo } from "@/redux/actions/putaway-actions/putaway-actions";
import PutAwayOrderViewDetails_Columns from "@/components/columns/PutAwayOrderViewDetails_Columns";


interface ModalProps {
    opened: boolean;
    handleModalClose: () => void;
    row: any
    isLoading: boolean
    pagination: any
    setPagination: any,
    title: string,
    skipRecord: number,
    setIsLoading: any,
    apiUrl: string,
    poNumber: number
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


export default function PutawayUnPostedViewDetailsModal({
    opened,
    handleModalClose,
    row,
    isLoading,
    pagination,
    setPagination,
    title,
    skipRecord,
    setIsLoading,
    apiUrl,
    poNumber
}: ModalProps) {

    const { authenticatedUser } = useAppSelector(({ authStates }) => {
        return authStates;
    });
    const { ListAllPutAwayDetailsByDocNo } = useAppSelector(
        ({ putawayStates }) => {
            return putawayStates;
        }
    );
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (authenticatedUser?.token && opened) {
            setIsLoading(true)
            dispatch(
                fetchListAllPutAwayDetalisByDocNo({
                    authToken: authenticatedUser?.token || "",
                    docNumber: poNumber,
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
        poNumber
    ]);

    const columns = PutAwayOrderViewDetails_Columns({ pagination, List: ListAllPutAwayDetailsByDocNo?.data })

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
                    <InfoRow label="Material Doc No" value={row?.materialDocument} />
                    <InfoRow label="Supplier" value={row?.supplierName} />
                    <InfoRow label="Movement Type" value={row?.movementType} />
                    <InfoRow label="Purchase Order" value={row?.purchaseOrder} />
                    <InfoRow label="Date" value={row?.createdOn} />
                    <InfoRow label="Qty" value={row?.totalQuantity} />
                    {/* <InfoRow
                        label="Date"
                        value={new Date(row?.date).toLocaleDateString()}
                    /> */}
                    {/* <InfoRow label="User" value={row?.username} />
                    <InfoRow label="ERP Doc Entry" value={row?.erpDocEntry} /> */}
                </SimpleGrid>
            </Box>

            <Divider my="sm" />

            <TanStackTable
                data={Array.isArray(ListAllPutAwayDetailsByDocNo?.data) ? ListAllPutAwayDetailsByDocNo?.data : []}
                dataCount={ListAllPutAwayDetailsByDocNo?.totalCount}
                columns={columns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={pagination}
                setPagination={setPagination}
                title={title}
                skipRecord={skipRecord}
            />

            <Box my={20}>
                <Text>Remarks</Text>
                <TextInput placeholder="Write your description" radius={"md"} my={10} size="lg" />
            </Box>

            {/* Footer Section */}
            <Flex
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
            </Flex>
        </Modal>
    );
}

