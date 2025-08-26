import { Text, Title } from "@mantine/core"
import { FC } from "react";

interface ConfirmationProps {
    title: string;
    description: string;
}

const ConfirmationComponent: FC<ConfirmationProps> = ({
    title,
    description
}) => {
    return (
        <>
            {/* Title */}
            <Title
                order={2}
                fw={600}
                ta="center"
                c="dark.8"
            >
                {title}
            </Title>

            {/* Description */}
            <Text
                maw={450}
                miw={250}
                size="lg"
                ta="center"
                c="gray.6"
                style={{ marginTop: '-8px' }}
            >
                {description}
            </Text>
        </>
    )
}

export default ConfirmationComponent