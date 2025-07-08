'use client';

import { Select } from "@mantine/core";
import { Dispatch, FC, SetStateAction } from "react";

interface CheckboxDropdownProps {
    label?: string;
    isFlex?: boolean;
    placeholder: string;
    options: string[];
    maxWidth?: number | string;
    selectedValue: string | null;
    setSelectedValue: Dispatch<SetStateAction<string | null>>
}

const CheckboxDropdownSelect: FC<CheckboxDropdownProps> = ({
    options,
    maxWidth,
    selectedValue,
    setSelectedValue,
    label,
    isFlex = false,
    placeholder
}) => {
    return (
        <Select
            placeholder={selectedValue ? "" : placeholder}
            data={options}
            value={selectedValue}
            onChange={(value) => setSelectedValue(value)}
            clearable
            size="md"
            flex={isFlex ? 1 : undefined}
            maw={maxWidth}
            label={label}
            radius={8}
        />
    )
}

export default CheckboxDropdownSelect;