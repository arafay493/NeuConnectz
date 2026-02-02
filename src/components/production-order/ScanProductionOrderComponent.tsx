'use client';

import { useEffect, useRef, useState, memo } from "react";
import { localAssets } from "@/lib/file-paths/file-paths";
import showNotificationToast from "@/lib/notification-toast/notification-toast";
import { fetchProductionById, scanProductionOrder } from "@/redux/actions/production-order-actions/production-order-actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { customStyles } from "@/styles/custom-theme";
import { ScanProductionOrderProps } from "@/types/redux-types";
import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Card,
    Divider,
    Grid,
    GridCol,
    Group,
    Image,
    Loader,
    Progress,
    Stack,
    Tabs,
    Text,
    TextInput,
    Title,
    Tooltip
} from "@mantine/core";
import { IconBarcode, IconChevronDown, IconRefresh, IconScan, IconBottle, IconTrash } from "@tabler/icons-react";
import NextImage from "next/image";
import TitleComponent from "../common/component-title";
import LoaderComponent from "../common/loader/loader";
import { apiPost } from "@/lib/api-service";
import { useRouter, usePathname } from 'next/navigation';
import { routes } from "@/constants/routes";

const ScanProductionOrderComponent = ({ id }: { id: string }) => {
    const dispatch = useAppDispatch();

    const { productionOrderById, scannedProductionOrder } = useAppSelector(({ productionOrderStates }) => productionOrderStates);
    const [activeTab, setActiveTab] = useState('manual')
    const [loading, setLoading] = useState<boolean>(true)
    const [currentScannedCode, setCurrentScannedCode] = useState<Array<ScanProductionOrderProps> | null>(null)
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const [scannedValue, setScannedValue] = useState<string>('')
    const [isProductionOrderComplete, setIsProductionOrderComplete] = useState<boolean>(false)
    const [isScanning, setIsScanning] = useState<boolean>(false)
    const [completePOLoadingState, setCompletePOLoadingState] = useState<boolean>(false);
    const [pausePOLoadingState, setPausePOLoadingState] = useState<boolean>(false);
    const [scannedList, setScannedList] = useState<string[]>([]);
    const [notFoundSet, setNotFoundSet] = useState<Set<string>>(new Set());

    // const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const inputRef = useRef<HTMLInputElement>(null);
    const bufferRef = useRef('');

    console.log('Current scanned code state:', currentScannedCode);

    // Note: Router for switch page
    const router = useRouter();
    const pathname = usePathname();

    const productionOrderId = pathname.split('/')[3]

    // Calculate progress percentage for each stage
    const calculateProgress = (scanned: number, total: number) => {
        return total > 0 ? Math.round((scanned / total) * 100) : 0;
    };

    // Auth states...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);

    // Simple sorted stages - just use production order data directly
    const sortedStages = productionOrderById?.stages ?
        [...productionOrderById.stages].sort((a, b) => a.level - b.level) : [];
    console.log('Sorted stages: ', sortedStages);

    const toggleExpanded = (stageId: string) => {
        setExpandedItems(prev =>
            prev.includes(stageId)
                ? prev.filter(id => id !== stageId)
                : [...prev, stageId]
        );
    }

    const handlePrint = async (stageType: 'box' | 'pallet', code: string | null, itemNumber?: number) => {
        try {
            if (!code) {
                showNotificationToast("Print Error", "No code provided for printing", customStyles.colors.red);
                return;
            }

            const displayItemNumber = itemNumber ? ` ${itemNumber}` : '';
            console.log(`Starting print process for ${stageType}${displayItemNumber} with code:`, code);

            // Step 1: Check if Browser Print service is available
            let serviceResponse;
            try {
                serviceResponse = await fetch("http://127.0.0.1:9100/available", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
            } catch (fetchError) {
                throw new Error("Browser Print service is not running. Please start Zebra Browser Print application.");
            }

            if (!serviceResponse.ok) {
                throw new Error(`Browser Print service error: ${serviceResponse.status} ${serviceResponse.statusText}`);
            }

            // Step 2: Get available printers
            const availableDevices = await serviceResponse.json();
            console.log("Available devices:", availableDevices);

            if (!availableDevices || availableDevices.length === 0) {
                throw new Error("No printers found. Please ensure your Zebra printer is connected and recognized by Browser Print.");
            }

            // Step 3: Use the first available device
            const selectedDevice = availableDevices.printer[0];
            console.log("Selected device for printing:", selectedDevice);

            // Step 4: Get production order and stage information
            const itemName = productionOrderById?.itemName || 'Unknown Item';

            // First check if scanned production order data exists, otherwise use original data
            let currentStage;
            let stageData;

            if (currentScannedCode && currentScannedCode.length > 0) {
                // Use scanned production order data
                currentStage = currentScannedCode.find(stage =>
                    stage.stageName.toLowerCase() === stageType.toLowerCase()
                );
                console.log("Using scanned production order data:", currentStage);
            }

            else {
                // Fall back to original production order data
                stageData = productionOrderById?.stages?.find(stage =>
                    stage.stageName.toLowerCase() === stageType.toLowerCase()
                );
                console.log("Using original production order data:", stageData);
            }

            console.log("Current stage details:", currentStage || stageData);

            let bottleQuantity = 0;
            if (stageType === 'box') {
                // For box, get the bottle stage quantity
                bottleQuantity = currentStage?.stageQty || stageData?.stageQty || 0;

            }

            else if (stageType === 'pallet') {
                // For pallet, get the total bottle quantity from all boxes
                bottleQuantity = currentStage?.stageQty || stageData?.stageQty || 0;
            }

            // Step 5: Create appropriate ZPL data based on stage type
            let zplData = '';

            if (stageType === 'box') {
                const stageName = currentStage?.stageName || stageData?.stageName || 'Box';
                const itemDisplayName = itemNumber ? `Box: ${itemNumber}` : stageName;
                const scanned = currentStage?.scanned || stageData?.scanned || 0;
                const total = currentStage?.total || stageData?.total || 1;

                const quantityDisplay = itemNumber ? `${itemNumber}/${total}` : `${scanned}/${total}`;

                zplData = `
                            ^XA
                            ^PW406
                            ^LL406
                            ^LH0,0
                            ^CI28

                            ^CF0,30,30
                            ^FO20,30^FDItem:^FS
                            ^FO80,30^FD${itemName}^FS

                            ^CF0,26,26
                            ^FO20,70^FDBox:^FS
                            ^FO120,70^FD${itemDisplayName}^FS

                            ^FO20,105^FDQty:^FS
                            ^FO120,105^FD${quantityDisplay}^FS

                            ^FO20,140^FDTotal Bottles:^FS
                            ^FO160,140^FD${bottleQuantity}^FS

                            ^BY2,2,70
                            ^FO60,250^BCN,90,Y,N,N
                            ^FD${code}^FS

                            ^XZ
                            `;


            }

            else if (stageType === 'pallet') {
                // Get box data from either scanned or original data
                let boxStage, boxStageData;
                if (currentScannedCode && currentScannedCode.length > 0) {
                    boxStage = currentScannedCode.find(stage =>
                        stage.stageName.toLowerCase() === 'box'
                    );
                } else {
                    boxStageData = productionOrderById?.stages?.find(stage =>
                        stage.stageName.toLowerCase() === 'box'
                    );
                }

                const boxCount = boxStage?.scanned || boxStageData?.scanned || 0;
                const stageName = currentStage?.stageName || stageData?.stageName || 'Pallet';
                const itemDisplayName = itemNumber ? `Pallet: ${itemNumber}` : stageName;
                const scanned = currentStage?.scanned || stageData?.scanned || 0;
                const total = currentStage?.total || stageData?.total || 1;
                const stageQty = currentStage?.stageQty || stageData?.stageQty || 0;

                console.log("Box count for pallet label:", boxCount);

                const quantityDisplay = itemNumber ? `${itemNumber}/${total}` : `${scanned}/${total}`;

                zplData = `
                            ^XA
                            ^PW406
                            ^LL406
                            ^LH0,0
                            ^CI28

                            ^CF0,30,30
                            ^FO20,30^FDItem:^FS
                            ^FO80,30^FD${itemName}^FS

                            ^CF0,26,26
                            ^FO20,70^FDPallet:^FS
                            ^FO120,70^FD${itemDisplayName}^FS
                            ^FO20,105^FDQty:^FS
                            ^FO120,105^FD${quantityDisplay}^FS

                            ^FO20,140^FDTotal Bottles:^FS
                            ^FO160,140^FD${bottleQuantity}^FS

                            ^BY2,2,60
                            ^FO60,260^BCN,90,Y,N,N
                            ^FD${code}^FS

                            ^XZ
                    `;
            }

            console.log(`ZPL Data for pallete ${stageType}:`, zplData);

            // Step 6: Send print command
            const printResponse = await fetch("http://127.0.0.1:9100/write", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    device: selectedDevice,
                    data: zplData
                })
            });

            if (!printResponse.ok) {
                const errorText = await printResponse.text();
                console.error("Print response error:", errorText);
                throw new Error(`Print request failed: ${printResponse.status} - ${errorText}`);
            }

            const printResult = await printResponse.text();

            // Check if the result contains error messages
            if (printResult && printResult.toLowerCase().includes("error")) {
                throw new Error(printResult);
            }

            const successMessage = itemNumber
                ? `${stageType.charAt(0).toUpperCase() + stageType.slice(1)} ${itemNumber} label printed successfully`
                : `${stageType.charAt(0).toUpperCase() + stageType.slice(1)} label printed successfully`;
            showNotificationToast("Print Success", successMessage, customStyles.colors.green);

        } catch (error) {
            console.error("Error in handlePrint:", error);

            const errorMessage = error instanceof Error ? error.message : "Unknown printing error occurred";

            // Handle specific error types
            if (errorMessage.includes("Unauthorized device")) {
                showNotificationToast("Authorization Error", "Printer device not authorized. Please restart Browser Print and try again.", customStyles.colors.red);
            } else if (errorMessage.includes("Browser Print service")) {
                showNotificationToast("Service Error", errorMessage, customStyles.colors.red);
            } else if (errorMessage.includes("No printers found")) {
                showNotificationToast("Printer Error", errorMessage, customStyles.colors.red);
            } else {
                showNotificationToast("Print Error", `Failed to print ${stageType}: ${errorMessage}`, customStyles.colors.red);
            }
        }
    };

    const handleDelete = (code: string) => {
        setScannedList((prev) => prev.filter(item => item !== code));
        notFoundSet.delete(code); // optional: clean related state
    };


    // Handle response from API
    const handleResponse = (status: number, apiMessage: string) => {
        console.log("Api message:", apiMessage);
        const errorResponseCodes = {
            400: "Bad Request - Invalid data provided",
            500: "Server Error - Please try again later",
            // 404: "Data not found - Invalid barcode",
            404: "Something went wrong - The following codes were not found",
            406: "Production order is paused. Please resume before scanning.",
            409: "Bottle with this code already scanned"
        };

        if (status === 404 && apiMessage?.toLowerCase().includes("not found")) {
            const match = apiMessage.match(/not found[:\-]?\s*(.*)/i);

            if (match && match[1]) {
                const codes = match[1]
                    .split(",")
                    .map(code => code.trim())
                    .filter(Boolean);

                setNotFoundSet(new Set(codes));
            }
        }

        if (status === 200 || status === 201) {
            showNotificationToast(
                "Production Order Scanned",
                "Production Order scanned successfully",
                customStyles.colors._408CCE
            );
            setScannedList([]);
            // console.log(`Box ${boxNumber} completed, printing label with code:`, boxCode)
            // handlePrint('box', boxCode, boxNumber);
        }

        else if (errorResponseCodes[status as keyof typeof errorResponseCodes]) {
            showNotificationToast(
                "Error Scanning Production Order",
                apiMessage ? apiMessage : errorResponseCodes[status as keyof typeof errorResponseCodes],
                customStyles.colors.red
            );
        }

        setIsScanning(false);
        setScannedValue('');
    };

    const submitScan = (setOf12Codes: string[]) => {
        console.log("Submitting batch scan for codes:", setOf12Codes);

        const body = {
            productionOrderId,
            barcodes: setOf12Codes
        };
        console.log('Payload for scan: ', body);

        setIsScanning(true);
        dispatch(scanProductionOrder({ body, resHandler: handleResponse }))
            .finally(() => {
                inputRef.current?.focus();
            });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (isScanning) {
            e.preventDefault();
            return;
        }

        if (e.key === "Enter") {
            e.preventDefault();

            const raw = e.currentTarget.value;

            const firstEight = raw
                .replace(/[^a-fA-F0-9]/g, "")   // remove hyphens
                .substring(0, 8);              // ALWAYS from start

            // if (firstEight.length === 8) {
            //     submitScan(firstEight);
            // }

            if (scannedList.includes(firstEight)) {
                showNotificationToast("Duplication Error", `${firstEight} already exist`, customStyles.colors.red);
            }

            setScannedList((prev) =>
                prev.includes(firstEight) ? prev : [...prev, firstEight]
            );

            // clear for next scan
            e.currentTarget.value = "";
            setScannedValue("");
        }
    };

    useEffect(() => {
        if (scannedList.length === 0) return;
        console.log("Scanned List:", scannedList);

        const itemsLength = sortedStages.find(stage => stage.stageName.toLowerCase() === 'box')?.stageQty || 0;
        console.log('Items length: ', itemsLength);

        if (scannedList.length == itemsLength) {
            console.log('12 items scanned, submitting batch scan');
            submitScan(scannedList);
        };
    }, [scannedList]);

    useEffect(() => {
        const keepFocus = () => {
            if (!isScanning) {
                inputRef.current?.focus();
            }
        };

        const i = setInterval(keepFocus, 50);
        return () => clearInterval(i);
    }, [isScanning]);

    useEffect(() => {
        dispatch(fetchProductionById({ id: productionOrderId }));
        setLoading(false);
    }, [dispatch])

    useEffect(() => {
        if (productionOrderById) {
            const isCompleted = productionOrderById.status === 'Completed';
            setIsProductionOrderComplete(isCompleted);
        }
    }, [productionOrderById])

    useEffect(() => {
        if (!currentScannedCode || currentScannedCode.length === 0) return;
        const isBoxCompleted = currentScannedCode?.find(scannedStage => scannedStage.stageName.toLocaleLowerCase() === 'box');
        const isPalletCompleted = currentScannedCode?.find(scannedStage => scannedStage.stageName.toLocaleLowerCase() === 'pallet');
        console.log('Checking completed stages for printing labels:', isBoxCompleted);
        console.log("Current scanned code state changed:", currentScannedCode);

        if (isBoxCompleted) {
            const boxStage = currentScannedCode
                ?.find(stage => stage.stageName.toLowerCase() === 'box');
            const boxCode = boxStage?.codes?.[0]?.code || "";
            const boxNumber = boxStage?.scanned || 1; // Use the current scanned count as the box number
            console.log(`Box ${boxNumber} completed, printing label with code:`, boxCode);
            handlePrint('box', boxCode, boxNumber);
        }

        if (isPalletCompleted) {
            const palletStage = currentScannedCode
                ?.find(stage => stage.stageName.toLowerCase() === 'pallet');
            const palletCode = palletStage?.codes?.[0]?.code || "";
            const palletNumber = palletStage?.scanned || 1; // Use the current scanned count as the pallet number
            console.log(`Pallet ${palletNumber} completed, printing label with code:`, palletCode)
            handlePrint('pallet', palletCode, palletNumber);
        }

        setTimeout(() => {
            setCurrentScannedCode(null);
        }, 300);
    }, [currentScannedCode])

    useEffect(() => {
        setCurrentScannedCode(scannedProductionOrder)
        dispatch(fetchProductionById({ id: productionOrderId }));
    }, [scannedProductionOrder])

    // Function to complete production order...!
    const completePO = async () => {
        // console.log('PO Id: ', productionOrderId);
        setCompletePOLoadingState(true);

        try {
            const response = await apiPost(`/trace-and-track/v2${process.env.NEXT_PUBLIC_COMPLETE_PO}`, { productionOrderId: productionOrderId }, authenticatedUser?.token);
            // console.log('Complete PO res: ', response);
            const { status, data, error } = response;

            if (status == 201) {
                showNotificationToast("Production Order Completed", data?.message, customStyles.colors._1B59F8);
                setCompletePOLoadingState(false);
                router.push(routes.productionOrder)
            };

            if (!String(status).startsWith('2')) {
                showNotificationToast("Something went wrong", error, customStyles.colors.red);
                setCompletePOLoadingState(false);
            };
        }

        catch (error) {
            console.log("Something went wrong while completing production order: ", error);
        };
    };

    // Function to pause production order...!
    const pausePO = async () => {
        // console.log('PO Id: ', productionOrderId);
        setPausePOLoadingState(true);

        try {
            const response = await apiPost(`/trace-and-track/v2${process.env.NEXT_PUBLIC_PAUSE_PO}`, { productionOrderId: productionOrderId }, authenticatedUser?.token);
            // console.log('Pause PO res: ', response);
            const { status, data, error } = response;

            if (status == 201) {
                showNotificationToast("Production Order Paused", data?.message, customStyles.colors._1B59F8);
                setPausePOLoadingState(false);
                router.push(routes.productionOrder)
            };

            if (!String(status).startsWith('2')) {
                showNotificationToast("Something went wrong", error, customStyles.colors.red);
                setPausePOLoadingState(false);
            };
        }

        catch (error) {
            console.log("Something went wrong while completing production order: ", error);
        };
    };

    if (loading) {
        return (
            <LoaderComponent />
        )
    };

    if (!productionOrderById) {
        return (
            <Box>
                <TitleComponent
                    title="Production Order Not Found"
                    description="The requested production order could not be found."
                />
                <Stack h={650} align='center' justify='center' mt={24} p={24} style={{ backgroundColor: customStyles.colors.white, borderRadius: '16px' }}>
                    <Image w={250} h={250} radius={16} component={NextImage} src={localAssets.reconciliationNotFoundImage} alt="Not Found" />
                    <Title order={2} c={customStyles.colors._4D4D4D}>No Production Order Found</Title>
                    <Stack align='center' gap={0}>
                        <Text c={customStyles.colors._909090} size="md">There are no Production Orders to show right now.</Text>
                    </Stack>
                </Stack>
            </Box>
        );
    };

    return (
        <Box>
            <TitleComponent
                title={`Production Order: ${id}`}
                description="Scan the production order using the provided ID."
            />
            <Card
                radius={16}
                p={24}
            >
                <Group justify="space-between" mb="md">
                    <Title order={3} c={customStyles.colors._4D4D4D}>Production Process</Title>
                    <TextInput
                        placeholder="Search"
                        size="sm"
                        w={200}
                        rightSection={<ActionIcon variant="subtle" size="sm"><IconRefresh size={16} /></ActionIcon>}
                    />
                </Group>

                <Group mb="lg">
                    <Text c={customStyles.colors._4D4D4D} size="md">
                        Production Order: <strong>{productionOrderById?.itemName || 'Loading...'}</strong>
                    </Text>
                    <Group c="dimmed" ml="auto">
                        {(() => {
                            const totalScanned = sortedStages.reduce((sum, stage) => sum + stage.scanned, 0);
                            const totalCapacity = sortedStages.reduce((sum, stage) => sum + stage.total, 0);
                            const unfilled = totalCapacity - totalScanned;

                            return (
                                <>
                                    Total Items: <Text c={customStyles.colors._1B59F8} fw={600} size="sm">{totalCapacity}</Text>
                                    Scanned: <Text c={customStyles.colors.green} fw={600} size="sm">{totalScanned}</Text>
                                    Remaining: <Text c={customStyles.colors._909090} fw={600} size="sm">{unfilled}</Text>
                                </>
                            );
                        })()}
                    </Group>
                </Group>

                <Grid>
                    <GridCol span={6}>
                        <Card h="100%" padding={16} withBorder radius={8} bg={customStyles.colors.white} style={{ minHeight: '600px' }}>
                            <Stack gap="xs" style={{ flex: 1, overflow: 'hidden' }}>
                                <Group justify="space-between" mb="md">
                                    <Title order={4} c={customStyles.colors._4D4D4D}>Scanned Items</Title>
                                    <ActionIcon variant="subtle" size="md" c={customStyles.colors._1B59F8} onClick={() => dispatch(fetchProductionById({ id: productionOrderId }))}>
                                        <IconRefresh size={24} />
                                    </ActionIcon>
                                </Group>

                                <Divider size="xs" my="xs" />

                                <Box style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                                    <Stack gap="md">
                                        {sortedStages.length > 0 ? (
                                            sortedStages.map((stage, index) => {
                                                const progress = calculateProgress(stage.scanned, stage.total);
                                                const isExpanded = expandedItems.includes(stage.stageId);

                                                // Check if this stage has recent scans - only if scannedProductionOrder exists
                                                const hasRecentScans = scannedProductionOrder?.some(scannedStage => scannedStage.stageId === stage.stageId);

                                                const isCompleted = progress === 100;

                                                return (
                                                    <Box key={stage.stageId}>
                                                        <Box
                                                            p="md"
                                                            style={{
                                                                border: hasRecentScans ? '2px solid #4c6ef5' : '1px solid #e9ecef',
                                                                borderRadius: '8px',
                                                                backgroundColor: isCompleted ? '#f0fff4' : hasRecentScans ? '#f8f9ff' : '#f8f9fa',
                                                                transition: 'all 0.3s ease',
                                                                boxShadow: hasRecentScans ? '0 2px 8px rgba(76, 110, 245, 0.1)' : 'none'
                                                            }}
                                                        >
                                                            <Group justify="space-between" mb="xs">
                                                                <Group>
                                                                    <IconBarcode size={16} color="#4c6ef5" />
                                                                    <Text fw={500} c="blue">{stage.stageName}</Text>
                                                                    <Badge size="sm" variant="light" color="gray">
                                                                        Level {stage.level}
                                                                    </Badge>
                                                                    {hasRecentScans && (
                                                                        <Badge size="sm" variant="light" color="blue">
                                                                            Recently Updated
                                                                        </Badge>
                                                                    )}
                                                                    {isCompleted && (
                                                                        <Badge size="sm" variant="light" color="green">
                                                                            Complete
                                                                        </Badge>
                                                                    )}
                                                                </Group>
                                                                <ActionIcon
                                                                    variant="subtle"
                                                                    size="sm"
                                                                    onClick={() => toggleExpanded(stage.stageId)}
                                                                    style={{
                                                                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                                        transition: 'transform 0.2s ease'
                                                                    }}
                                                                    disabled={stage.codes.length === 0}
                                                                >
                                                                    <IconChevronDown size={16} />
                                                                </ActionIcon>
                                                            </Group>

                                                            <Group justify="space-between" mb="xs">
                                                                <Text size="sm" c="dimmed">
                                                                    Scanned: {stage.scanned}/{stage.total}
                                                                </Text>
                                                                <Text size="sm" c="dimmed">
                                                                    Qty: {stage.stageQty}
                                                                </Text>
                                                            </Group>

                                                            <Progress
                                                                value={progress}
                                                                size="sm"
                                                                color={progress === 100 ? "green" : "blue"}
                                                            />
                                                            <Text size="xs" c="dimmed" mt="xs">{progress}% Complete</Text>
                                                        </Box>

                                                        {/* Expanded Codes */}
                                                        {isExpanded && stage.codes.length > 0 && (
                                                            <Box
                                                                ml="md"
                                                                mt="xs"
                                                                style={{
                                                                    maxHeight: '200px',
                                                                    overflowY: 'auto',
                                                                    transition: 'all 0.3s ease'
                                                                }}
                                                            >
                                                                {stage.codes.map((code: any, codeIndex: number) => (
                                                                    <Box
                                                                        key={`${stage.stageId}-${codeIndex}`}
                                                                        p="sm"
                                                                        mb="xs"
                                                                        style={{
                                                                            border: '1px solid #e9ecef',
                                                                            borderRadius: '6px',
                                                                            backgroundColor: '#fff'
                                                                        }}
                                                                    >
                                                                        <Group justify="space-between" align="center">
                                                                            <Group>
                                                                                <IconBarcode size={14} color="#4c6ef5" />
                                                                                <Text fw={500} c="blue" size="sm">
                                                                                    {code.code}
                                                                                </Text>
                                                                            </Group>
                                                                            <Group>
                                                                                <Badge
                                                                                    color={code.isObject ? "green" : "gray"}
                                                                                    size="sm"
                                                                                    variant="light"
                                                                                >
                                                                                    {code.isObject ? "scanned" : "Code"}
                                                                                </Badge>
                                                                                {/* Add print button for box and pallet stages */}
                                                                                {(stage.stageName.toLowerCase() === 'box' || stage.stageName.toLowerCase() === 'pallet') && code.isObject && (
                                                                                    <ActionIcon
                                                                                        variant="light"
                                                                                        size="sm"
                                                                                        color="blue"
                                                                                        onClick={() => handlePrint(stage.stageName.toLowerCase() as 'box' | 'pallet', code.code, codeIndex + 1)}
                                                                                        title={`Print ${stage.stageName} ${codeIndex + 1} label`}
                                                                                        style={{ cursor: 'pointer' }}
                                                                                    >
                                                                                        <IconBarcode size={14} />
                                                                                    </ActionIcon>
                                                                                )}
                                                                            </Group>
                                                                        </Group>
                                                                        <Group justify="space-between" mt="xs">
                                                                            <Text size="xs" c="dimmed">
                                                                                ID: {code.id || 'N/A'}
                                                                            </Text>
                                                                            <Text size="xs" c="dimmed">
                                                                                Parent: {code.parentCode || 'None'}
                                                                            </Text>
                                                                        </Group>
                                                                    </Box>
                                                                ))}
                                                            </Box>
                                                        )}

                                                        {/* Show message when no codes available */}
                                                        {isExpanded && stage.codes.length === 0 && (
                                                            <Box
                                                                ml="md"
                                                                mt="xs"
                                                                p="sm"
                                                                style={{
                                                                    border: '1px dashed #e9ecef',
                                                                    borderRadius: '6px',
                                                                    backgroundColor: '#f8f9fa',
                                                                    textAlign: 'center'
                                                                }}
                                                            >
                                                                <Text size="sm" c="dimmed">No codes generated yet</Text>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                );
                                            })
                                        ) : (
                                            <Text c="dimmed" ta="center">No production order data available</Text>
                                        )}
                                    </Stack>
                                </Box>
                            </Stack>
                        </Card>
                    </GridCol>

                    <GridCol span={6}>
                        <Card h="100%" padding={16} withBorder radius={8} bg={customStyles.colors.white} style={{ minHeight: '600px' }}>
                            <Stack gap="xs" style={{ height: '100%' }}>
                                <Group justify="space-between" mb="md">
                                    <Title order={4} c={customStyles.colors._4D4D4D}>Scan Operations</Title>
                                    <ActionIcon variant="subtle" size="md" c={customStyles.colors._1B59F8}>
                                        <IconRefresh size={24} />
                                    </ActionIcon>
                                </Group>

                                <Group
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "flex-end"
                                    }}
                                >
                                    <Button
                                        className="filledButton"
                                        variant="transparent"
                                        size="md"
                                        my={8}
                                        radius={8}
                                        style={{ width: "30%" }}
                                        onClick={pausePO}
                                        loading={pausePOLoadingState}
                                        disabled={pausePOLoadingState}
                                    >
                                        Pause PO
                                    </Button>

                                    <Button
                                        className="filledButton"
                                        variant="transparent"
                                        size="md"
                                        my={8}
                                        radius={8}
                                        style={{ width: "30%" }}
                                        onClick={completePO}
                                        loading={completePOLoadingState}
                                        disabled={completePOLoadingState}
                                    >
                                        End PO
                                    </Button>
                                </Group>

                                <Divider size="xs" my="xs" />

                                <Tabs
                                    value={activeTab}
                                    onChange={(value) => value && setActiveTab(value)}
                                    style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                                    c={customStyles.colors._1B59F8}
                                    variant="pills"
                                    radius="md"
                                >
                                    <Tabs.List
                                        grow
                                        mb="lg"
                                        style={{
                                            backgroundColor: '#f8f9fa',
                                            padding: '4px',
                                            borderRadius: '12px',
                                            border: '1px solid #e9ecef'
                                        }}
                                    >
                                        <Tabs.Tab
                                            value="manual"
                                            leftSection={<IconBarcode size={16} />}
                                            style={{
                                                borderRadius: '8px',
                                                fontWeight: 500
                                            }}
                                        >
                                            Manual Scan
                                        </Tabs.Tab>
                                        <Tabs.Tab
                                            value="auto"
                                            leftSection={<IconScan size={16} />}
                                            style={{
                                                borderRadius: '8px',
                                                fontWeight: 500
                                            }}
                                        >
                                            Auto Scan
                                        </Tabs.Tab>
                                    </Tabs.List>

                                    <Tabs.Panel value="manual" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Stack gap="lg" style={{ flex: 1 }}>
                                            <Box
                                                p="md"
                                                style={{
                                                    backgroundColor: '#f0f7ff',
                                                    borderRadius: '12px',
                                                    border: '1px solid #e3f2fd'
                                                }}
                                            >
                                                <Group mb="xs">
                                                    <IconBarcode size={18} color="#1976d2" />
                                                    <Text size="sm" fw={500} c="#1976d2">Manual Entry</Text>
                                                </Group>
                                                <Text size="xs" c="dimmed">
                                                    Type or paste your barcode value below for manual processing
                                                </Text>
                                            </Box>

                                            <TextInput
                                                ref={inputRef}
                                                label="Scan Barcode"
                                                placeholder={
                                                    isProductionOrderComplete
                                                        ? "Production Order Completed"
                                                        : isScanning
                                                            ? "Scanning..."
                                                            : "Enter or paste barcode value..."
                                                }
                                                value={scannedValue}
                                                onChange={(e) => {
                                                    const cleaned = e.currentTarget.value
                                                        .replace(/[^a-fA-F0-9]/g, "")
                                                        .substring(0, 8);

                                                    setScannedValue(cleaned);
                                                }}
                                                onKeyDown={handleKeyDown}
                                                autoFocus
                                                onFocus={() => {
                                                    bufferRef.current = '';
                                                    setScannedValue('');
                                                }}
                                                autoComplete="off"
                                                spellCheck={false}
                                                disabled={isScanning}
                                                styles={{
                                                    input: {
                                                        fontSize: '16px',
                                                        fontFamily: 'monospace',
                                                        letterSpacing: '0.5px'
                                                    },
                                                    label: {
                                                        fontWeight: 500,
                                                        marginBottom: '8px'
                                                    }
                                                }}
                                            />

                                            {/* Scanned codes list section */}
                                            <Grid gutter="sm">
                                                {scannedList?.map((bottle: any, index: number) => {
                                                    const isNotFound = notFoundSet.has(bottle);

                                                    return (
                                                        <Grid.Col key={index} span={{ base: 12, sm: 6 }}>
                                                            <Card
                                                                radius="md"
                                                                padding="sm"
                                                                withBorder
                                                                style={{
                                                                    borderColor: isNotFound ? customStyles.colors.red : undefined
                                                                }}
                                                            >
                                                                <Group justify="space-between" align="flex-start" wrap="nowrap">
                                                                    {/* Left section */}
                                                                    <Group gap="sm" wrap="nowrap">
                                                                        <Box
                                                                            w={32}
                                                                            h={32}
                                                                            bg="blue.0"
                                                                            style={{
                                                                                borderRadius: 6,
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                            }}
                                                                        >
                                                                            <IconBottle size={18} color="#228be6" />
                                                                        </Box>

                                                                        <Stack gap={2}>
                                                                            <Text fw={600} size="sm">
                                                                                {`Bottle ${index + 1}`}
                                                                            </Text>
                                                                            <Text size="xs" c="dimmed">
                                                                                Code: {bottle}
                                                                            </Text>
                                                                        </Stack>
                                                                    </Group>

                                                                    {/* Right section - Delete */}
                                                                    <Tooltip label="Delete" withArrow>
                                                                        <ActionIcon
                                                                            color="red"
                                                                            variant="subtle"
                                                                            onClick={() => handleDelete(bottle)}
                                                                        >
                                                                            <IconTrash size={16} />
                                                                        </ActionIcon>
                                                                    </Tooltip>
                                                                </Group>

                                                            </Card>
                                                        </Grid.Col>
                                                    )
                                                })}
                                            </Grid>

                                            {/* Show recent scan results - only when there are actual updates */}
                                            {scannedProductionOrder && scannedProductionOrder.length > 0 && (
                                                <Box
                                                    p="md"
                                                    style={{
                                                        backgroundColor: '#f0fff4',
                                                        borderRadius: '12px',
                                                        border: '1px solid #d4edda'
                                                    }}
                                                >
                                                    <Group mb="xs">
                                                        <IconBarcode size={18} color="#28a745" />
                                                        <Text size="sm" fw={500} c="#28a745">Recent Scans</Text>
                                                    </Group>
                                                    <Stack gap="xs">
                                                        {scannedProductionOrder.map((stage) => (
                                                            <Group key={stage.stageId} justify="space-between">
                                                                <Text size="xs" c="dimmed">
                                                                    {stage.stageName}: {stage.scanned}/{stage.total}
                                                                </Text>
                                                                <Badge size="xs" color="green" variant="light">
                                                                    {Math.round((stage.scanned / stage.total) * 100)}%
                                                                </Badge>
                                                            </Group>
                                                        ))}
                                                    </Stack>
                                                </Box>
                                            )}

                                            <Box style={{ flex: 1 }} />
                                        </Stack>
                                    </Tabs.Panel>

                                    <Tabs.Panel value="auto" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Stack gap="lg" style={{ flex: 1 }}>
                                            <Box
                                                p="md"
                                                style={{
                                                    backgroundColor: '#f0fff4',
                                                    borderRadius: '12px',
                                                    border: '1px solid #d4edda'
                                                }}
                                            >
                                                <Group mb="xs">
                                                    <IconScan size={18} color="#28a745" />
                                                    <Text size="sm" fw={500} c="#28a745">Auto Scanner</Text>
                                                </Group>
                                                <Text size="xs" c="dimmed">
                                                    Use your device camera to automatically scan barcodes
                                                </Text>
                                            </Box>

                                            <Box
                                                p="xl"
                                                style={{
                                                    border: '2px dashed #28a745',
                                                    borderRadius: '16px',
                                                    textAlign: 'center',
                                                    backgroundColor: '#f8fff9',
                                                    flex: 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    minHeight: '200px',
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <Box
                                                    style={{
                                                        position: 'absolute',
                                                        top: '20px',
                                                        left: '20px',
                                                        width: '20px',
                                                        height: '20px',
                                                        border: '3px solid #28a745',
                                                        borderRight: 'transparent',
                                                        borderBottom: 'transparent',
                                                        borderRadius: '4px'
                                                    }}
                                                />
                                                <Box
                                                    style={{
                                                        position: 'absolute',
                                                        top: '20px',
                                                        right: '20px',
                                                        width: '20px',
                                                        height: '20px',
                                                        border: '3px solid #28a745',
                                                        borderLeft: 'transparent',
                                                        borderBottom: 'transparent',
                                                        borderRadius: '4px'
                                                    }}
                                                />
                                                <Box
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '20px',
                                                        left: '20px',
                                                        width: '20px',
                                                        height: '20px',
                                                        border: '3px solid #28a745',
                                                        borderRight: 'transparent',
                                                        borderTop: 'transparent',
                                                        borderRadius: '4px'
                                                    }}
                                                />
                                                <Box
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '20px',
                                                        right: '20px',
                                                        width: '20px',
                                                        height: '20px',
                                                        border: '3px solid #28a745',
                                                        borderLeft: 'transparent',
                                                        borderTop: 'transparent',
                                                        borderRadius: '4px'
                                                    }}
                                                />

                                                <IconScan size={56} color="#28a745" style={{ marginBottom: '16px' }} />
                                                <Text c="#28a745" fw={600} size="lg" mb="xs">Scanner Ready</Text>
                                                <Text size="sm" c="dimmed" ta="center" maw={280}>
                                                    Position your barcode within the frame and click start to begin scanning
                                                </Text>
                                            </Box>

                                            <Button
                                                className="filledButton"
                                                variant="transparent"
                                                size="lg"
                                                radius="md"
                                                leftSection={<IconScan size={18} />}
                                                onClick={() => {
                                                    // Handle auto scan start
                                                    console.log('Starting auto scan...');
                                                    // Add your auto scan logic here
                                                }}
                                                styles={{
                                                    root: {
                                                        height: '48px',
                                                        fontSize: '16px',
                                                        fontWeight: 600
                                                    }
                                                }}
                                            >
                                                Start Camera Scan
                                            </Button>
                                        </Stack>
                                    </Tabs.Panel>
                                </Tabs>
                            </Stack>
                        </Card>
                    </GridCol>
                </Grid>
            </Card>
        </Box>
    )
}

export default ScanProductionOrderComponent;