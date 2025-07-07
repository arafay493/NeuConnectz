// Note: Dashboard screen...!

import React from 'react';

import { SimpleGrid, Box } from '@mantine/core';

// Note: Importing required components...!
import DashboardsCards from '@/components/dashboard-cards/dashboards-cards';
import ProgressBarCard from '@/components/progress-bar/progress-bar';
import BarChart from '@/components/bar-chart/bar-chart';
import ProductStackedBarChart from '@/components/product-stacked-bar-chart/product-stacked-bar-chart';
import DonutChart from '@/components/donut-chart/donut-chart';
import { customStyles } from '@/styles/custom-theme';

const DashboardScreen = () => {
  return (
    <div>

      {/* Note: Dashboard cards component */}
      <DashboardsCards />

      {/* Note: Progress bar component */}
      <div style={{ padding: '15px 0px' }} >
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 2 }}
          spacing={customStyles.deviceSize.lg}
          verticalSpacing={customStyles.deviceSize.lg}
        >
          {/* App Usage Card */}
          <ProgressBarCard
            title='App Usage'
            completedRatio='60%'
            remainingRatio='12%'
            color={customStyles.colors.green}
          />

          {/* Active Warehouse Staff Card */}
          <ProgressBarCard
            title='Active Warehouse Staff'
            completedRatio='80'
            color={customStyles.colors._1B59F8}
          />
        </SimpleGrid>
      </div>

      {/* Note: Bar chart component */}
      <BarChart />

      {/* Note: Footer charts */}
      <Box style={{ padding: '15px 0px' }}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 2 }}
          spacing={customStyles.deviceSize.lg}
          verticalSpacing={customStyles.deviceSize.lg}
          style={{ justifyContent: "space-between" }}
        >
          {/* Product Stacked Bar Chart */}
          <ProductStackedBarChart />

          {/* Donut Chart */}
          <DonutChart />
        </SimpleGrid>
      </Box>
    </div>
  );
};

export default DashboardScreen;