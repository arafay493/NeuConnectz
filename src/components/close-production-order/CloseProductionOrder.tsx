// CloseProductionOrderComponent...!

"use client";
import React, { memo, FC, useState } from "react";
import { Modal, Button, Group, Text, Stack, Center } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { closeProductionOrder, fetchAllProductionOrders } from "@/redux/actions/sap-actions/sap-actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import showNotificationToast from "@/lib/notification-toast/notification-toast";
import { customStyles } from "@/styles/custom-theme";

type CloseProductionOrderComponentProp = {
    open: boolean,
    onClose: () => void,
    docEntry?: number
};

const CloseProductionOrderComponent: FC<CloseProductionOrderComponentProp> = ({ open, onClose, docEntry }) => {

    // Note: Handling states here...!
    const [loading, setLoading] = useState(false);

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });

    // Note: Add / Create user response handler...!
    const handleResponse = (response: any): void => {
        console.log('Res: ', response);

        if (response && response.status == 200) {
            setLoading(false);
            onClose();

            dispatch(fetchAllProductionOrders({
                token: authenticatedUser?.token || '',
                apiUrl: process.env.NEXT_PUBLIC_PRODUCTION_ORDERS_LIST as string,
            }));

            showNotificationToast("Production Order Closed", response?.data?.message, customStyles.colors._408CCE);
        };
    };

    // Note: Function to close the production order...!
    const handleCloseProductionOrder = () => {
        // console.log("Doc Entry to close production order: ", docEntry);

        if (docEntry) {
            setLoading(true);
            dispatch(closeProductionOrder({
                token: authenticatedUser?.token || "",
                docEntry: docEntry,
                resHandler: handleResponse
            }))
        };
    };

    return (
        <Modal
            opened={open}
            onClose={onClose}
            centered
            withCloseButton={false}
            size={"auto"}
            radius="md"
            zIndex={1000}
        >
            <Stack gap="sm" align="start">
                {/* Warning Icon */}
                <Center
                    style={{
                        backgroundColor: "#FFF7E6",
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                    }}
                >
                    <IconAlertCircle size={24} color="#F59E0B" />
                </Center>

                {/* Title */}
                <Text fw={600} size="lg">
                    Are you sure?
                </Text>

                {/* Subtitle */}
                <Text size="sm" c="dimmed" ta="center">
                    Are you sure you want to close this production order?
                </Text>

                {/* Buttons */}
                <Group mt="md" grow>
                    <Button
                        variant="transparent"
                        // className={'filledButton'}
                        className={'btn'}
                        radius={8}
                        size="md"
                        w={300}
                        color="#1B59F8"
                        style={{
                            border: "1px solid", borderColor: "#E1E7EC", boxShadow: "10px"
                        }}
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="filled"
                        // className={'filledButton'}
                        radius={8}
                        size="md"
                        w={300}
                        color="#1B59F8"
                        onClick={handleCloseProductionOrder}
                        loading={loading}
                        disabled={loading}
                    >
                        Confirm
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default memo(CloseProductionOrderComponent);