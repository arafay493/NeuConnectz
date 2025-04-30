// Note: Add User screen...!

"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import {
    TextInput,
    PasswordInput,
    Select,
    Button,
    FileButton,
    Checkbox,
    Group,
    Container,
    Grid,
    Card,
    Title,
    Text,
    Stack,
} from '@mantine/core';
import { IconUpload, IconTrash, IconUserPlus } from '@tabler/icons-react';
import { localAssets } from '@/lib/file-paths/file-paths';
import { customStyles } from '@/styles/custom-theme';

const AddUserScreen = () => {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (file: File | null) => {
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    return (
        <Container size="xl" py="md">
            <Title order={2}>Add User</Title>
            <Text size="sm" c="dimmed" mb="xl">Username, email, phone, upload picture</Text>

            <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Card withBorder radius="lg" p="lg" shadow="sm">
                        <Stack gap="md">
                            <Group grow>
                                <TextInput label="User Name" placeholder="Username" required />
                                <TextInput label="Email" placeholder="Email" type="email" required />
                            </Group>

                            <Group grow>
                                <Select label="Department" placeholder="Department" data={["HR", "Finance", "Engineering"]} required />
                                <Select label="User Role" placeholder="User Role" data={["Admin", "Manager", "Employee"]} required />
                            </Group>

                            <Group grow>
                                <TextInput label="Phone Number" placeholder="Phone Number" required />
                                <PasswordInput label="Password" placeholder="Password" required />
                            </Group>

                            <PasswordInput label="Confirm Password" placeholder="Confirm Password" required />

                            <Checkbox label="Active" />
                        </Stack>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder radius="lg" p="lg" shadow="sm">
                        <Stack align="center" gap="md">
                            {
                                preview
                                    ?
                                    (
                                        <Image
                                            src={preview}
                                            alt="Profile Preview"
                                            // radius="md"
                                            // h={200}
                                            // fit="cover"
                                            style={{
                                                width: "auto",
                                                height: 200,
                                                objectFit: 'cover'
                                            }}
                                        />
                                    )
                                    :
                                    (
                                        <Image
                                            src={localAssets.userIcon}
                                            alt="User Icon"
                                            // radius="md"
                                            // fit="cover"
                                            style={{
                                                width: "auto",
                                                height: "auto",
                                                objectFit: 'cover',
                                                marginBottom: 10
                                            }}
                                        />
                                    )
                            }

                            <FileButton onChange={handleImageChange} accept="image/png,image/jpeg">
                                {(props) => <Button fullWidth leftSection={<IconUpload size={16} />} {...props}>Upload Picture</Button>}
                            </FileButton>
                            <Button
                                variant="light"
                                color="red"
                                fullWidth
                                leftSection={<IconTrash size={16} />}
                                onClick={() => handleImageChange(null)}
                                disabled={!image}
                            >
                                Delete Picture
                            </Button>
                        </Stack>
                    </Card>
                </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="xl">
                {/* <Button size="md" leftSection={<IconUserPlus size={18} />}>
                    Save User
                </Button> */}
                <Button
                    // variant="light"
                    // color="red"
                    // fullWidth
                    // leftSection={<IconTrash size={16} />}
                    // onClick={() => handleImageChange(null)}
                    size="md"
                    leftSection={<IconUserPlus size={18} />}
                    style={{ width: "408px" }}
                >
                    Save User
                </Button>
            </Group>
        </Container>
    );
};

export default AddUserScreen;