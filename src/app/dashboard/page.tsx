// Note: Dashboard screen...!

import React from 'react';

import { SimpleGrid } from '@mantine/core';

// Note: Importing required components...!
import DashboardsCards from '@/components/dashboard-cards/dashboards-cards';
import ProgressBarCard from '@/components/progress-bar/progress-bar';

import { customStyles } from '@/styles/custom-theme';
import Dashboard from '@/components/dashboard/Dashboard';

const DashboardScreen = () => {
  return (
    <Dashboard />
  );
};

export default DashboardScreen;