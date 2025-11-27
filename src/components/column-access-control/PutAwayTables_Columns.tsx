import React from 'react';
import { Checkbox, Group, Stack, Title } from '@mantine/core';
import { customStyles } from '@/styles/custom-theme';

const PutAwayTable_Columns = ({ columns, selectedColumns, onChange }: any) => {
  const handleToggle = (col: string) => {
    if (selectedColumns.includes(col)) {
      onChange(selectedColumns.filter((item: string) => item !== col));
    } else {
      onChange([...selectedColumns, col]);
    }
  };

  return (
    <Stack>
      <Title mb={5}
        order={5}
        c={customStyles.colors._4D4D4D}
        // size={isSmallScreen ? "h3" : "h2"}
        style={{ fontWeight: 600, fontSize: 16 }}>Unposted Putaway Columns</Title>

      <Group my={10} gap={20}>
        {columns.map((col: string) => (
          <Checkbox
            key={col}
            label={col}
            color={customStyles.colors._1B59F8}
            radius={"sm"}
            checked={selectedColumns.includes(col)}
            onChange={() => handleToggle(col)}
          />
        ))}
      </Group>
    </Stack>
  );
};

export default PutAwayTable_Columns;
