import { Box, TextInput } from "@mantine/core";
import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";

interface GlobalSearchFilterProps {
  filters: string;
  // setFilters: Dispatch<SetStateAction<string>>;
  isSearchInputVisible: boolean;
  handleGlobalSearch: (value: string) => void;
}

export const GlobalSearchFilter: FC<GlobalSearchFilterProps> = ({
  filters,
  isSearchInputVisible,
  handleGlobalSearch,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchInputVisible) {
      inputRef.current?.focus();
    }
  }, [isSearchInputVisible]);

  return (
    <Box
      style={{
        overflow: "hidden",
        width: isSearchInputVisible ? "150px" : "0px",
        transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: isSearchInputVisible ? 1 : 0,
        transform: `translateX(${isSearchInputVisible ? "0px" : "10px"})`,
        transitionProperty: "width, opacity, transform",
        transitionDuration: "0.4s",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {isSearchInputVisible && (
        <TextInput
          ref={inputRef}
          size="xs"
          value={filters}
          onChange={(e) => handleGlobalSearch(e.target.value)}
          placeholder="Search here..."
          style={{
            width: "150px",
            minWidth: "150px",
          }}
        />
      )}
    </Box>
  );
};
