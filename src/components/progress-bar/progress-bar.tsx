// Note: ProgressBarCard component...!

import React, { memo } from 'react'
import { Card, Group, Text, Progress, ThemeIcon } from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';
import { customStyles } from '@/styles/custom-theme';

interface ProgressBarCardProps {
    title: string
    completedRatio: string
    remainingRatio?: string // Marked as optional
    color: string
};

const ProgressBarCard = (props: ProgressBarCardProps) => {
    const { title, completedRatio, remainingRatio, color } = props;

    return (
        <Card
            shadow="sm"
            padding="md"
            radius="md"
            withBorder
        >
            <Text
                size="sm"
                c="dimmed"
                mb="xs"
                style={{ textTransform: customStyles.textTransformation.capitalize }}
            >
                {title}
            </Text>

            <Group
                justify={customStyles.alignment.spaceBetween}
                align="flex-end"
                mb="xs"
            >
                <Text fw={700} size="xl" c={color}>
                    {completedRatio}
                </Text>

                {
                    remainingRatio &&
                    <Group gap={4}>
                        <ThemeIcon color={color} variant="light" size="sm" radius="xl">
                            <IconArrowUpRight size={14} />
                        </ThemeIcon>
                        <Text size="sm" c={color}>
                            {remainingRatio}
                        </Text>
                    </Group>
                }
            </Group>

            <Progress value={60} color={color} radius="xl" />
        </Card>
    );
};

export default memo(ProgressBarCard);