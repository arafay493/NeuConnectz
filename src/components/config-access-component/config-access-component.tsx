// Note: Config Access Component...!

import Image from 'next/image';
import { Box, Center, Stack, Text, Group, Title } from '@mantine/core';
import { localAssets } from '@/lib/file-paths/file-paths';
import { customStyles } from '@/styles/custom-theme';

const ConfigAccessComponent = () => {
    return (
        <div>
            <Group
                justify={customStyles.alignment.spaceBetween}
                align="flex-start"
                p="md"
                bg="gray.0"
            >
                <Stack gap={0}>
                    <Title
                        order={3}
                        style={{
                            color: customStyles.colors._4D4D4D,
                            fontSize: "24px",
                            fontWeight: 700
                        }}
                    >
                        Configuration
                    </Title>

                    <Text size="sm" c="dimmed" style={{ color: customStyles.colors._909090 }}>
                        Customizable Integration.
                    </Text>
                </Stack>
            </Group>

            <Center h="auto" p="md" pt={'5%'} bg={"white"} style={{borderRadius: 20}}>
                <Stack align="center" gap="lg" maw={400} w="100%" >
                    <Box>
                        <Image
                            src={localAssets.configAccessLogo}
                            alt="Configuration Access"
                            width={200}
                            height={200}
                            style={{ objectFit: 'contain' }}
                        />
                    </Box>

                    <Text fw={600} size="lg" style={{ textAlign: "center" }}>
                        Configuration Access Required
                    </Text>

                    <Text size="sm" c="dimmed" style={{ textAlign: "center" }}>
                        To configure these settings, please connect with your Admin or QBS Co team for access.
                    </Text>

                    <Text size="sm" style={{ textAlign: "center" }}>
                        Email:{' '}
                        <Text span component="a" href="mailto:info@qbsco.net" c="blue">
                            info@qbsco.net
                        </Text>{' '}
                        | Phone:{' '}
                        <Text span component="a" href="tel:03182814455" c="blue">
                            0318 2814455
                        </Text>
                    </Text>
                </Stack>
            </Center>
        </div>
    );
};

export default ConfigAccessComponent;