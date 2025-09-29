import { customStyles } from "@/styles/custom-theme";
import {
    Modal,
    Group,
    Text,
    Stack,
    Flex,
    Divider,
    SimpleGrid,
    Box,
} from "@mantine/core";
import {
    IconCircleX,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useState } from "react";
import TanStackTable from "@/components/tanStackTable/TanStackTable";
import ITR_Columns from "@/components/columns/ITR_Columns";


interface ModalProps {
    opened: boolean;
    handleModalClose: () => void;
    row: any
    isLoading: boolean
    // handleConfirm: () => void;
    // handleCancel: () => void;
    // description: string
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


export default function ITRViewDetailsModal({
    opened,
    handleModalClose,
    row,
    isLoading
}: ModalProps) {
    const [toWarehouse, setToWarehouse] = useState("");
    const [fromWarehouse, setFromWarehouse] = useState("");
    const [selectDate, setSelectDate] = useState<string | null>(null);
    const [sapStatus, setSapStatus] = useState();
    const [docStatus, setDocStatus] = useState();
    const [filteredParams, setFilteredParams] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // // Pagination values for Api call
    // const skipRecord = pagination.pageIndex * pagination.pageSize;

    const { listAgainstPo, totalRecordsAgainstPo } = useAppSelector(
        ({ sapStates }) => {
            return sapStates;
        }
    );

    // const { itrData, itrDataCount, itrErrorState } = useAppSelector(
    //     ({ itrStates }) => {
    //         return itrStates;
    //     }
    // );

    const columns = ITR_Columns({ pagination, listAgainstPo })

    return (
        <Modal
            opened={opened}
            onClose={handleModalClose}
            zIndex={10000}
            closeButtonProps={{
                icon: <IconCircleX size={70} stroke={2} color="#ED1C24" />,
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
                    {/* <Divider mt="sm" /> */}
                </Flex>
            }
        >
            {/* Header with close button */}
            {/* <Group justify="space-between" align="flex-start">
                <Text fw={600} size="md">Preview</Text>
                <ActionIcon onClick={handleModalClose} variant="subtle" color="#ED1C24" size="lg">
                    <IconCircleX />
                </ActionIcon>
            </Group> */}

            <Box mb="md">
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" verticalSpacing="sm">
                    <InfoRow label="Document No" value={String(row?.documentNumber)} />
                    <InfoRow label="Item Code" value={row?.itemNo} />
                    <InfoRow label="Item Description" value={row?.productDescription.length < 20 ? row?.productDescription : row?.productDescription?.slice(0, 20)} />
                    <InfoRow label="UOM" value={row?.uom} />
                    <InfoRow label="Quantity" value={String(row?.quantity)} />
                    <InfoRow label="Remaining Qty" value={String(row?.remainingQuantity)} />
                    <InfoRow label="Planned Date" value={new Date(row?.plannedDate as string).toLocaleDateString()} />
                    <InfoRow label="Origin No" value={String(row?.originNo)} />
                    <InfoRow label="Warehouse" value={row?.warehouse} />
                </SimpleGrid>
            </Box>

            <Divider my="sm" />

            <TanStackTable
                data={Array.isArray(listAgainstPo) ? listAgainstPo : []}
                dataCount={Math.ceil(totalRecordsAgainstPo / pagination.pageSize)}
                columns={columns}
                isLoading={isLoading}
                isInsideModalTable={true}
            />
        </Modal >
    );
}

