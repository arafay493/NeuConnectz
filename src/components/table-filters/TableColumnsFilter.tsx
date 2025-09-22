// TableColumnsFilter Component

import { Box, TextInput } from "@mantine/core";
import { FC } from "react";

interface TableColumnsFilterProps {
    placeholder: string;
    value: string;
    setValue: (value: string) => void;
    areTableFiltersVisible: boolean;
}
export const TableColumnsFilter: FC<TableColumnsFilterProps> = ({ placeholder, value, setValue, areTableFiltersVisible }) => {
    return (
        <Box
            mt={8}
            style={{
                overflow: 'hidden',
                height: `${areTableFiltersVisible ? '30px' : '0px'}`,
                transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: areTableFiltersVisible ? 1 : 0,
                transform: `translateY(${areTableFiltersVisible ? '0px' : '-5px'})`,
                transitionProperty: 'height, opacity, transform',
                transitionDuration: '0.4s',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            <TextInput
                mr={12}
                placeholder={`Filter ${placeholder}...`}
                value={value}
                onChange={e => setValue(e.currentTarget.value)}
                size="xs"
                style={{maxWidth: "150px"}}
            />
        </Box>
    )
}