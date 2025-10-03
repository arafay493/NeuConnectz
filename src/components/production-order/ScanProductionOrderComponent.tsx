'use client';

import { localAssets } from "@/lib/file-paths/file-paths";
import showNotificationToast from "@/lib/notification-toast/notification-toast";
import { fetchProductionById, scanProductionOrder } from "@/redux/actions/production-order-actions/production-order-actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { customStyles } from "@/styles/custom-theme";
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
    Title
} from "@mantine/core";
import { IconBarcode, IconChevronDown, IconRefresh, IconScan, IconX } from "@tabler/icons-react";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import TitleComponent from "../common/component-title";
import LoaderComponent from "../common/loader/loader";

const ScanProductionOrderComponent = ({ id }: { id: string }) => {
    const dispatch = useAppDispatch();

    const { productionOrderById, loading, scannedProductionOrder } = useAppSelector(({ productionOrderStates }) => productionOrderStates);
    const [activeTab, setActiveTab] = useState('manual')
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const [scannedValue, setScannedValue] = useState<string>('')
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [isProductionOrderComplete, setIsProductionOrderComplete] = useState<boolean>(false)
    const [isScanning, setIsScanning] = useState<boolean>(false)

    const pathname = usePathname();

    const productionOrderId = pathname.split('/')[3]

    // Calculate progress percentage for each stage
    const calculateProgress = (scanned: number, total: number) => {
        return total > 0 ? Math.round((scanned / total) * 100) : 0;
    };

    // Merge scanned data with original production order data
    const getMergedStages = () => {
        if (!productionOrderById?.stages) return [];

        const originalStages = [...productionOrderById.stages];

        if (scannedProductionOrder?.stages) {
            // Create a map of scanned stages for quick lookup
            const scannedStagesMap = new Map(
                scannedProductionOrder.stages.map(stage => [stage.stageId, stage])
            );

            // Update original stages with scanned data
            return originalStages.map(originalStage => {
                const scannedStage = scannedStagesMap.get(originalStage.stageId);
                if (scannedStage) {
                    // Merge the scanned data with original stage
                    return {
                        ...originalStage,
                        scanned: scannedStage.scanned,
                        total: scannedStage.total,
                        codes: scannedStage.codes
                    };
                }
                return originalStage;
            });
        }

        return originalStages;
    };

    // Get stages sorted by level (ascending order)
    const sortedStages = getMergedStages().sort((a, b) => a.level - b.level);

    const toggleExpanded = (stageId: string) => {
        setExpandedItems(prev =>
            prev.includes(stageId)
                ? prev.filter(id => id !== stageId)
                : [...prev, stageId]
        );
    }

    // Handle response from API
    const handleResponse = (status: number) => {
        const errorResponseCodes = {
            400: "Bad Request - Invalid data provided",
            500: "Server Error - Please try again later",
            404: "Data not found - Invalid barcode",
            409: "Conflict - Bottle with this code already scanned"
        }

        if (status === 200 || status === 201) {
            showNotificationToast("Production Order Scanned", "Production Order scanned successfully", customStyles.colors._408CCE);
            setIsScanning(false);
            setScannedValue('');
            // Refresh the production order data to get updated scan counts
            dispatch(fetchProductionById({ id: productionOrderId }));
            return;
        }

        if (errorResponseCodes[status as keyof typeof errorResponseCodes]) {
            showNotificationToast("Error Scanning Production Order", errorResponseCodes[status as keyof typeof errorResponseCodes], customStyles.colors.red);
            setIsScanning(false);
            setScannedValue('');
            return;
        }
    }

    const handleScanProductionOrder = useCallback((barcode: string) => {
        if (!barcode.trim()) return;

        setIsScanning(true);
        const body = {
            productionOrderId,
            barcodes: [barcode]
        }

        dispatch(scanProductionOrder({ body: body, resHandler: handleResponse }))
    }, [productionOrderId, dispatch])

    // Debounced input handler
    const handleInputChange = useCallback((value: string) => {
        setScannedValue(value);
        setIsScanning(false); // Reset scanning state when user types

        // Clear existing timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Set new timeout to call API after 1 second of no typing
        if (value.trim()) {
            debounceTimeoutRef.current = setTimeout(() => {
                handleScanProductionOrder(value);
            }, 1000);
        }
    }, [handleScanProductionOrder])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [])

    useEffect(() => {
        dispatch(fetchProductionById({ id: productionOrderId }))
    }, [dispatch])

    useEffect(() => {
        if (productionOrderById) {
            const isCompleted = productionOrderById.status === 'Completed';
            setIsProductionOrderComplete(isCompleted);
        }
    }, [productionOrderById])

    // Auto-focus input when scanning is complete
    useEffect(() => {
        if (!isScanning && !isProductionOrderComplete && inputRef.current) {
            // Small delay to ensure the input is not disabled before focusing
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isScanning, isProductionOrderComplete])

    if (loading) {
        return (
            <LoaderComponent />
        )
    }

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
    }


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
                                        {loading ? (
                                            <Text>Loading...</Text>
                                        ) : sortedStages.length > 0 ? (
                                            sortedStages.map((stage, index) => {
                                                const progress = calculateProgress(stage.scanned, stage.total);
                                                const isExpanded = expandedItems.includes(stage.stageId);

                                                // Check if this stage has recent scans
                                                const hasRecentScans = scannedProductionOrder?.stages?.some(
                                                    scannedStage => scannedStage.stageId === stage.stageId
                                                );
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
                                                                {stage.codes.map((code, codeIndex) => (
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

                                <Button
                                    className="filledButton"
                                    variant="transparent"
                                    fullWidth
                                    size="md"
                                    radius={8}
                                >
                                    Generate QR Code
                                </Button>
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

                                <Divider size="xs" my="xs" />

                                <Tabs
                                    value={activeTab}
                                    onChange={(value) => value && setActiveTab(value)}
                                    style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
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
                                                label="Barcode Value"
                                                placeholder={
                                                    isProductionOrderComplete
                                                        ? "Production Order Completed"
                                                        : isScanning
                                                            ? "Scanning..."
                                                            : "Enter or paste barcode value..."
                                                }
                                                readOnly={isProductionOrderComplete}
                                                disabled={isScanning}
                                                value={scannedValue}
                                                onChange={(event) => handleInputChange(event.currentTarget.value)}
                                                size="lg"
                                                radius="md"
                                                leftSection={<IconBarcode size={18} color={isScanning ? "#1976d2" : "#666"} />}
                                                rightSection={
                                                    isScanning ? (
                                                        <Loader size="sm" color="blue" />
                                                    ) : scannedValue && (
                                                        <ActionIcon
                                                            variant="subtle"
                                                            size="sm"
                                                            color="gray"
                                                            onClick={() => {
                                                                setIsScanning(false);
                                                                setScannedValue('');
                                                                // Clear any pending timeout when clearing input
                                                                if (debounceTimeoutRef.current) {
                                                                    clearTimeout(debounceTimeoutRef.current);
                                                                }
                                                            }}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <IconX size={16} />
                                                        </ActionIcon>
                                                    )
                                                }
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

                                            {/* Show recent scan results */}
                                            {scannedProductionOrder?.stages && scannedProductionOrder.stages.length > 0 && (
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
                                                        {scannedProductionOrder.stages.map((stage) => (
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

                                            {/* <Button
                                                className="filledButton"
                                                variant="transparent"
                                                size="lg"
                                                radius="md"
                                                disabled={!scannedValue.trim()}
                                                leftSection={<IconFocus2 size={18} />}
                                                onClick={() => {
                                                    // Handle manual scan submission
                                                    console.log('Manual scan value:', scannedValue);
                                                    // Add your scan processing logic here
                                                }}
                                                styles={{
                                                    root: {
                                                        height: '48px',
                                                        fontSize: '16px',
                                                        fontWeight: 600
                                                    }
                                                }}
                                            >
                                                Process Barcode
                                            </Button> */}
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

export default ScanProductionOrderComponent