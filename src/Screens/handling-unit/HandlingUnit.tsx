'use client';

import React from 'react'
import Link from 'next/link';
import { Box, Button, Grid, GridCol, Group, Title } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import AddHandlingUnitCard from '@/components/handling-units/AddHandlingUnitCard';
import HandlingUnitCard from '@/components/handling-units/HandlingUnitCard'

const handlingUnits = [
    {
        id: "01",
        title: "Piece (pcs)",
        description: "Smallest unit of measurement",
        size: "1 × 1 × 1 in",
        weight: "0.1 kg",
    },
    {
        id: "02",
        title: "Box (box)",
        description: "Contains 10 pieces",
        size: "12 × 8 × 6 in",
        weight: "1.5 kg",
        capacity: "10 pcs",
    },
    {
        id: "03",
        title: "Pallet (pallet)",
        description: "Contains 20 boxes",
        size: "48 × 40 × 6 in",
        weight: "50 kg",
        capacity: "20 boxes",
    },
    {
        id: "04",
        title: "Pallet (pallet)",
        description: "Contains 10 boxes",
        size: "32 × 30 × 6 in",
        weight: "30 kg",
        capacity: "10 boxes",
    },
];


const HandlingUnits = () => {
    return (
        <Box p={8}>
            <Group justify='space-between'>
                <Title order={3}>
                    Handling Units
                </Title>

                <Link href="/handling-units/add" style={{ textDecoration: 'none' }}>
                    <Button
                        variant="filled"
                        size='md'
                        color='#2f80ed'
                        radius='md'
                        leftSection={<IconPlus size={20} />}
                    >
                        Add Handling Unit
                    </Button>
                </Link>
            </Group>
            <Box mt={16}>
                <Grid p={16} bg="#fbfbfb" style={{ border: '1px solid #e2e2e2', borderRadius: '8px' }}>
                    {handlingUnits.map((unit) => (
                        <GridCol key={unit.id} span={{ base: 12, sm: 12, md: 6, lg: 6 }}>
                            <HandlingUnitCard
                                id={unit.id}
                                title={unit.title}
                                description={unit.description}
                                size={unit.size}
                                weight={unit.weight}
                                capacity={unit.capacity}
                                onEdit={() => console.log(`Edit ${unit.id}`)}
                                onDelete={() => console.log(`Delete ${unit.id}`)}
                            />
                        </GridCol>
                    ))}

                    <GridCol span={{ base: 12, sm: 12, md: 6, lg: 6 }}>
                        <AddHandlingUnitCard
                            label='Add Handling Unit'
                            onClick={() => console.log("Add Handling Unit")}
                        />
                    </GridCol>
                </Grid>
            </Box>
        </Box >
    )
}

export default HandlingUnits