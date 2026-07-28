// Note: Dashboard screen...!

import React from 'react';
import { Box } from '@mantine/core';
import DashboardsCards from '@/components/dashboard-cards/dashboards-cards';
import ProductionDashboard from '@/components/dashboard-components/dashboard-production/dashboard-production';
import PoTableDashboard from '@/components/dashboard-components/po-table-dashboard/po-table-dashboard';
import DoTableDashboard from '@/components/dashboard-components/do-table-dashboard/do-table-dashboard';

const DashboardScreen = () => {
  return (
    <Box>
      {/* Note: Section 1 */}
      <DashboardsCards />

      {/* Note: Section 2 */}
      <PoTableDashboard />

      {/* Note: Section 3 */}
      <ProductionDashboard />

      {/* Note: Section 4 */}
      <DoTableDashboard />
    </Box>
  );
};

export default DashboardScreen;