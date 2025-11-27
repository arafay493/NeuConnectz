import React from 'react';
import { Checkbox, Group, Stack, Title } from '@mantine/core';
import { customStyles } from '@/styles/custom-theme';

const PutAwayTable_Columns = ({ selectedColumns, setSelectedColumns }: any) => {
  const handleToggle = (key: string) => {
    // console.log("🚀 ~ handleToggle ~ col:", key, selectedColumns[key])
    setSelectedColumns((prev: any) => {
      return {
        ...prev,
        [key]: {
          ...prev[key],
          value: !prev[key].value,
        },
      };
    });
    // setSelectedColumns((prev: any) => {
    //   return {
    //     ...prev,
    //     selectedColumns[key]: {
    //       label: selectedColumns[key].label,
    //       value: !selectedColumns[key].value
    //     }
    //   }
    // })
    // selectedColumns[key]
    // if (selectedColumns.includes(col)) {
    //   onChange(selectedColumns.filter((item: string) => item !== col));
    // } else {
    //   onChange([...selectedColumns, col]);
    // }
  };

  // Object keys extract
  const columnKeys = Object.keys(selectedColumns); // ["serialNumber", "docNum", ...]

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
            label={selectedColumns[key].label}     // <-- label show
            color={customStyles.colors._1B59F8}
            radius="sm"
            // checked={selectedColumns.includes(key)}
            checked={selectedColumns[key].value}
            onChange={() => handleToggle(key)}
          />
        ))}
      </Group>
    </Stack>
  );
};

export default PutAwayTable_Columns;

