'use client';

import { Select, Text } from "@mantine/core";
import { Dispatch, FC, SetStateAction } from "react";

interface CheckboxDropdownProps {
    label?: string;
    placeholder: string;
    options: string[];
    maxWidth?: number | string;
    selectedValue: string | null;
    setSelectedValue: Dispatch<SetStateAction<string | null>>
}

const CheckboxDropdownSelect: FC<CheckboxDropdownProps> = ({
    options,
    maxWidth = 300,
    selectedValue,
    setSelectedValue,
    label,
    placeholder
}) => {
    return (
        <>
            <Text size="md" mb={8} fw={500}>{label}</Text>
            <Select
                placeholder={selectedValue ? "" : placeholder}
                radius={8}
                data={options}
                value={selectedValue}
                onChange={(value) => setSelectedValue(value)}
                clearable
                size="md"
                w={maxWidth}
            />
        </>
    )
}

export default CheckboxDropdownSelect;