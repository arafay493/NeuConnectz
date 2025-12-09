import { Grid, GridCol, Text, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendarMonth } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { customStyles } from "@/styles/custom-theme";

export default function BinToBinTransferOrderFiltersSection({ }: any) {
  // 📱 Define responsive breakpoints
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isMediumScreen = useMediaQuery("(max-width: 992px)");
  const isLargeScreen = useMediaQuery("(max-width: 1200px)");

  const span = isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 4 : 12 / 5

  return (
    <Grid
      mt={16}
      mb={8}
      bg={customStyles?.colors?.white || "#fff"}
      p={24}
      align="end"
      style={{
        borderRadius: "16px",
        gap: isSmallScreen ? "16px" : "24px",
      }}
    >
      {/* Material Code */}
      <GridCol span={span}>
        <Text size="md" mb={8} fw={500}>Material Code</Text>
        <Select
          placeholder="Select Material Code"
          data={[]}
          clearable
          radius={8}
          size="md"
        />
      </GridCol>

      {/* Doc No */}
      <GridCol span={span}>
        <Text size="md" mb={8} fw={500}>Doc No</Text>
        <Select
          placeholder="Select Doc No"
          data={[]}
          clearable
          radius={8}
          size="md"
        />
      </GridCol>

      {/* Source Bin */}
      <GridCol span={span}>
        <Text size="md" mb={8} fw={500}>Source Bin</Text>
        <Select
          placeholder="Select Source Bin"
          data={[]}
          clearable
          radius={8}
          size="md"
        />
      </GridCol>

      {/* Purchase Order */}
      <GridCol span={span}>
        <Text size="md" mb={8} fw={500}>Purchase Order</Text>
        <Select
          placeholder="Select Purchase Order"
          data={[]}
          clearable
          radius={8}
          size="md"
        />
      </GridCol>

      {/* Destination Bin */}
      <GridCol span={span}>
        <Text size="md" mb={8} fw={500}>Destination Bin</Text>
        <Select
          placeholder="Select Destination Bin"
          data={[]}
          clearable
          radius={8}
          size="md"
        />
      </GridCol>

      {/* Reservation No */}
      <GridCol span={span}>
        <Text size="md" mb={8} fw={500}>Reservation No</Text>
        <Select
          placeholder="Select Reservation No"
          data={[]}
          clearable
          radius={8}
          size="md"
        />
      </GridCol>

      {/* Supplier */}
      <GridCol span={span}>
        <Text size="md" mb={8} fw={500}>Supplier</Text>
        <Select
          placeholder="Select Supplier"
          data={[]}
          clearable
          radius={8}
          size="md"
        />
      </GridCol>

      {/* Movement Type */}
      <GridCol span={span}>
        <Text size="md" mb={8} fw={500}>Movement Type</Text>
        <Select
          placeholder="Select Movement Type"
          data={[]}
          clearable
          radius={8}
          size="md"
        />
      </GridCol>

      {/* Date From Range */}
      <GridCol span={span}>
        <Text size="md" mb={8} fw={500}>Data From Range</Text>
        <DatePickerInput
          rightSection={<IconCalendarMonth size={24} />}
          placeholder="Select Data"
          radius={8}
          size="md"
          clearable
          maxDate={new Date()}
        />
      </GridCol>

      {/* Date To Range */}
      <GridCol span={span}>
        <Text size="md" mb={8} fw={500}>Data To Range</Text>
        <DatePickerInput
          rightSection={<IconCalendarMonth size={24} />}
          placeholder="Select Data"
          radius={8}
          size="md"
          clearable
          maxDate={new Date()}
        />
      </GridCol>
    </Grid>
  );
}
