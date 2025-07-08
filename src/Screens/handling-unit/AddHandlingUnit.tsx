'use client';

import { FC, useState } from "react";
import { Box, Button, Grid, GridCol, Stack, Textarea, TextInput, Title } from "@mantine/core"
import CheckboxDropdownSelect from "@/components/input-components/CheckboxDropdownSelect";

interface AddHandlingUnitProps {
    isExistingData: boolean;
}

const AddHandlingUnit: FC<AddHandlingUnitProps> = ({ isExistingData }) => {
    const [selectDropdownValue, setSelectDropdownValue] = useState<string | null>(null)

    return (
        <Box
            p={8}
            bg="#fbfbfb"

            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #e2e2e2',
                borderRadius: '8px',
            }}
        >
            <Stack
                maw={800}
                justify="center"
                align="center"
                style={{
                    padding: '16px',
                }}
            >
                <Grid maw={640} gutter="md">
                    <GridCol span={{ sm: 12, md: 12, lg: 12 }}>
                        <Title
                            order={2}
                            fw={600}
                            ta="center"
                            c="dark.8"
                        >
                            {isExistingData ? "Edit Handling Unit Level" : "Add New Handling Unit Level"}
                        </Title>
                    </GridCol>

                    <GridCol span={{ sm: 12, md: 12, lg: 6 }}>
                        <CheckboxDropdownSelect
                            label="Select Level"
                            placeholder="Select Level"
                            options={['Level 1', 'Level 2', 'Level 3', 'Level 4']}
                            selectedValue={selectDropdownValue}
                            setSelectedValue={setSelectDropdownValue}
                            isFlex
                            maxWidth="100%"
                        />
                    </GridCol>

                    <GridCol span={{ sm: 12, md: 12, lg: 6 }}>
                        <TextInput
                            size="md"
                            label="Unit Name"
                            placeholder="Enter Unit Name"
                            radius={8}
                        />
                    </GridCol>

                    <GridCol span={12}>
                        <Textarea
                            label="Description (Optional)"
                            size="md"
                            placeholder="Enter Description"
                            autosize
                            minRows={4}
                            maxRows={4}
                            radius={8}
                        />
                    </GridCol>

                    <GridCol span={12}>
                        <Title
                            order={4}
                            fw={500}
                            c="dark.6"
                            mb="xs"
                        >
                            Dimensions
                        </Title>
                    </GridCol>

                    <GridCol span={{ sm: 12, md: 12, lg: 4 }}>
                        <TextInput
                            label="Length (in)"
                            placeholder="Enter Length"
                            size="md"
                            radius={8}
                        />
                    </GridCol>

                    <GridCol span={{ sm: 12, md: 12, lg: 4 }}>
                        <TextInput
                            label="Width (in)"
                            placeholder="Enter Width"
                            size="md"
                            radius={8}
                        />
                    </GridCol>

                    <GridCol span={{ sm: 12, md: 12, lg: 4 }}>
                        <TextInput
                            label="Height (in)"
                            placeholder="Enter Height"
                            size="md"
                            radius={8}
                        />
                    </GridCol>

                    <GridCol span={{ sm: 12, md: 12, lg: 6 }}>
                        <TextInput
                            size="md"
                            label="Weight (kg)"
                            placeholder="Enter Weight"
                            radius={8}
                        />
                    </GridCol>

                    <GridCol span={{ sm: 12, md: 12, lg: 6 }}>
                        <TextInput
                            size="md"
                            label="Capacity (of lower unit)"
                            placeholder="Enter Capacity"
                            radius={8}
                        />
                    </GridCol>
                </Grid>
                <Box mt="xl" w="100%" style={{ display: 'flex', justifyContent: 'end' }}>
                    <Button
                        variant="filled"
                        color="blue"
                        size="md"
                    // onClick={handleSubmit}
                    >
                        Add Handling Unit
                    </Button>
                </Box>
            </Stack>
            <Box mt="32px">
            </Box>
        </Box>
    )
}

export default AddHandlingUnit