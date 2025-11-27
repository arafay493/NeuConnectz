import React from 'react';
import { Checkbox, Group, Stack, Title } from '@mantine/core';
import { customStyles } from '@/styles/custom-theme';

const PutAwayUnpostedTable_Columns = ({ selectedColumns, setSelectedColumns }: any) => {
  const handleToggle = (key: string) => {
    setSelectedColumns((prev: any) => {
      return {
        ...prev,
        [key]: {
          ...prev[key],
          value: !prev[key].value,
        },
      };
    });
  };

  const columnKeys = Object.keys(selectedColumns);

  return (
    <Stack>
      <Title
        mb={5}
        order={5}
        c={customStyles.colors._4D4D4D}
        style={{ fontWeight: 600, fontSize: 16 }}
      >
        Unposted Putaway Columns
      </Title>

      <Group my={10} gap={20}>
        {columnKeys.map((key: string) => (
          <Checkbox
            key={key}
            label={selectedColumns[key].label}
            color={customStyles.colors._1B59F8}
            radius="sm"
            checked={selectedColumns[key].value}
            onChange={() => handleToggle(key)}
          />
        ))}
      </Group>
    </Stack>
  );
};

export default PutAwayUnpostedTable_Columns;

