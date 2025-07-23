import { Box, TextInput } from "@mantine/core";
import { Dispatch, FC, SetStateAction } from "react";

interface GlobalSearchFilterProps {
    filters: string;
    setFilters: Dispatch<SetStateAction<string>>;
    isSearchInputVisible: boolean;
}

export const GlobalSearchFilter: FC<GlobalSearchFilterProps> = ({
    filters,
    setFilters,
    isSearchInputVisible,
}) => {

    return (
        <Box
            style={{
                overflow: 'hidden',
                width: isSearchInputVisible ? '150px' : '0px',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isSearchInputVisible ? 1 : 0,
                transform: `translateX(${isSearchInputVisible ? '0px' : '10px'})`,
                transitionProperty: 'width, opacity, transform',
                transitionDuration: '0.4s',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            <TextInput
                size='xs'
                value={filters}
                onChange={(event) => setFilters(event.currentTarget.value)}
                placeholder="Search..."
                style={{
                    width: '150px',
                    minWidth: '150px',
                }}
            />
        </Box>
    )
};