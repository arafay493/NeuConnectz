import { customStyles } from "@/styles/custom-theme";
import { Stack, Text, Title } from "@mantine/core";
import { FC } from "react";

interface TableTitleComponentProps {
    title: string;
    description: string;
}

const TableTitleComponent: FC<TableTitleComponentProps> = ({
    title,
    description
}) => {
    return (
        <Stack gap={8}>
            <Title order={3} c={customStyles.colors._4D4D4D}>
                {title}
            </Title>
            <Text c={customStyles.colors._909090}>{description}</Text>
        </Stack>
    )
}

export default TableTitleComponent