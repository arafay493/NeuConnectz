"use client";

import React, { memo } from "react";
import { Card, Badge, Grid, Text, Group, Stack, Table, Divider } from "@mantine/core";

const ProductionDashboard = () => {
    return (
        <Grid gutter="md" mt="md" mb="md">
            {/* Left: Production Line Performance */}
            <Grid.Col span={{ base: 12, md: 8 }}>
                <Card radius="lg" withBorder>
                    <Text fw={600} mb="md" style={{ color: "#4D4D4D" }}>Production Line Performance</Text>

                    {[1, 2].map((_, idx) => (
                        <Card key={idx} radius="md" withBorder mb="sm">
                            <Group justify="space-between" mb="xs">
                                <Text fw={500} style={{ color: "#4D4D4D" }}> {`Line 0${idx + 1}`} (Bottling)</Text>
                                <Badge color="green" variant="light">Running</Badge>
                            </Group>

                            <Divider mb="sm" />

                            <Grid>
                                <Grid.Col span={4}>
                                    <Stack gap={4}>
                                        <Text size="xs" c="dimmed">OEE</Text>
                                        <Text fw={600} style={{ color: "#4D4D4D" }}>92%</Text>
                                    </Stack>
                                </Grid.Col>

                                <Grid.Col span={4}>
                                    <Stack gap={4}>
                                        <Text size="xs" c="dimmed">Bottles</Text>
                                        <Text fw={600} style={{ color: "#4D4D4D" }}>35,120</Text>
                                    </Stack>
                                </Grid.Col>

                                <Grid.Col span={4}>
                                    <Stack gap={4}>
                                        <Text size="xs" c="dimmed">Downtime</Text>
                                        <Text fw={600} style={{ color: "#4D4D4D" }}>15 min <Text span c="dimmed">(Changeover)</Text></Text>
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </Card>
                    ))}
                </Card>
            </Grid.Col>

            {/* Right: Shift Performance */}
            <Grid.Col span={{ base: 12, md: 4 }}>
                <Card radius="lg" withBorder style={{ height: "100%" }}>
                    <Text fw={600} mb="md" style={{ color: "#4D4D4D" }}>Shift Performance (Current Day)</Text>

                    <Table striped highlightOnHover withTableBorder style={{ color: "#4D4D4D" }} verticalSpacing="md" horizontalSpacing="md">
                        <Table.Thead>
                            <Table.Tr style={{ padding: '10px' }}>
                                <Table.Th>Shift</Table.Th>
                                <Table.Th>Bottles</Table.Th>
                                <Table.Th>Cartons</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td>Morning (A)</Table.Td>
                                <Table.Td>60,100</Table.Td>
                                <Table.Td>10,010</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>Evening (B)</Table.Td>
                                <Table.Td>65,380</Table.Td>
                                <Table.Td>10,903</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>Night (C)</Table.Td>
                                <Table.Td>125,480</Table.Td>
                                <Table.Td>20,913</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>Morning (D)</Table.Td>
                                <Table.Td>25,780</Table.Td>
                                <Table.Td>30,913</Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </Card>
            </Grid.Col>
        </Grid>
    );
};

export default memo(ProductionDashboard);