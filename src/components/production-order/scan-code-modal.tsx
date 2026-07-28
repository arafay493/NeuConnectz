"use client";

import { useState, memo, FC, useEffect } from "react";
import { Modal, Tabs } from "@mantine/core";

interface ScannerTypeModalProps {
    open: boolean;
    onClose: () => void;
    selectedScannerType : (val: string) => void;
};

const ScannerTypeModal: FC<ScannerTypeModalProps> = ({ open, onClose, selectedScannerType }) => {

    // selected value => "7" | "36"
    const [scannerType, setScannerType] = useState<string | null>("7");

    useEffect(() => {
        if (scannerType) {
            console.log("Selected Scanner Type:", scannerType);
            selectedScannerType(scannerType);
            onClose();
        };
    }, [scannerType]);

    return (
        <Modal
            opened={open}
            onClose={onClose}
            title="Select Scanner Type"
            centered
            size="md"
        >
            <Tabs
                value={scannerType}
                onChange={setScannerType}
            >
                <Tabs.List grow>
                    <Tabs.Tab value="7">
                        7 Digits Code Scanning
                    </Tabs.Tab>

                    <Tabs.Tab value="36">
                        36 Digits Code Scanning
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>
        </Modal>
    );
};

export default memo(ScannerTypeModal);