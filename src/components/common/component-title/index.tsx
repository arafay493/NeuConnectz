'use client';

import { customStyles } from '@/styles/custom-theme';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FC, ReactNode } from 'react';

interface TitleComponentProps {
    title: string;
    description?: string;
    isButton?: boolean;
    buttonText?: string;
    buttonIcon?: ReactNode;
    handleOnClick?: () => void;
}

const TitleComponent: FC<TitleComponentProps> = ({
    title,
    description,
    isButton = false,
    buttonText,
    buttonIcon,
    handleOnClick
}) => {
    const isSmallScreen = useMediaQuery('(max-width: 768px)')

    const renderTitleLayout = (isButton: boolean) => {
        return !isButton ? (
            <Stack mb={24} gap={8}>
                <Title
                    order={isSmallScreen ? 3 : 2}
                    c={customStyles.colors._4D4D4D}
                    size={isSmallScreen ? 'h3' : 'h2'}
                >
                    {title}
                </Title>
                <Text
                    c={customStyles.colors._909090}
                    size={isSmallScreen ? 'sm' : 'md'}
                >
                    {description}
                </Text>
            </Stack>
        ) : (
            <Group mb={24} justify="space-between" align="center" style={{ flexShrink: 0 }}>
                <Stack gap={0}>
                    <Title
                        mb={8}
                        order={isSmallScreen ? 3 : 2}
                        c={customStyles.colors._4D4D4D}
                        size={isSmallScreen ? 'h3' : 'h2'}
                    >
                        {title}
                    </Title>
                    <Text
                        c={customStyles.colors._909090}
                        size={isSmallScreen ? 'sm' : 'md'}
                    >
                        {description}
                    </Text>
                </Stack>

                <Button
                    leftSection={buttonIcon}
                    className='filledButton'
                    variant="transparent"
                    size="md"
                    radius={8}
                    onClick={handleOnClick}
                >
                    {buttonText}
                </Button>
            </Group>
        )
    }

    return (
        renderTitleLayout(isButton)
    )
}

export default TitleComponent