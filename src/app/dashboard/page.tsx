// Note: Dashboard screen...!

import React from 'react';

import { SimpleGrid } from '@mantine/core';

// Note: Importing required components...!
import DashboardsCards from '@/components/dashboard-cards/dashboards-cards';
import ProgressBarCard from '@/components/progress-bar/progress-bar';

import { customStyles } from '@/styles/custom-theme';

const DashboardScreen = () => {
  return (
    <div>
      <h1> Dashboard is in development phase! </h1>

      {/* Note: Dashboard cards component */}
      {/* <DashboardsCards /> */}

      {/* Note: Progress bar component */}
      {/* <div style={{ padding: '15px 0px' }} > */}
      {/* <SimpleGrid
          cols={{ base: 1, sm: 2, md: 2 }}
          spacing={customStyles.deviceSize.lg}
          verticalSpacing={customStyles.deviceSize.lg}
        > */}
      {/* App Usage Card */}
      {/* <ProgressBarCard
            title='App Usage'
            completedRatio='60%'
            remainingRatio='12%'
            color={customStyles.colors.green}
          /> */}

      {/* Active Warehouse Staff Card */}
      {/* <ProgressBarCard
            title='Active Warehouse Staff'
            completedRatio='80'
            color={customStyles.colors._1B59F8}
          />
        // </SimpleGrid> */}
      {/* </div> */}
    </div>
  );
};

export default DashboardScreen;