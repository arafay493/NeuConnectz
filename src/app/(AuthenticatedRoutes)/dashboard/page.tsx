// Note: Dashboard screen...!
"use client"
import React, { useState } from "react";
import { DashboardComponent } from "@/components/dashboard";
import ITR_DashboardComponent from "@/components/dashboard/ITR_DashboardComponent";

const DashboardScreen = () => {
  const [dashboard, setDashboard] = useState("ITR_Dashboard")

  const handleShowDashboard = (val: string) => {
    setDashboard(val)
  }
  return (
    <>
      {dashboard === "dashboard" && <DashboardComponent dashboard={dashboard} handleShowDashboard={handleShowDashboard} />}
      {dashboard === "ITR_Dashboard" && <ITR_DashboardComponent />}
    </>
    // <Box>
    //   {/* Note: Dashboard cards component */}
    //   <DashboardsCards />

    //   {/* Note: Progress bar component */}
    //   <Box style={{ padding: "15px 0px" }}>
    //     <SimpleGrid
    //       cols={{ base: 1, sm: 2, md: 2 }}
    //       spacing={customStyles.deviceSize.lg}
    //       verticalSpacing={customStyles.deviceSize.lg}
    //     >
    //       {/* App Usage Card */}
    //       <ProgressBarCard
    //         title="App Usage"
    //         completedRatio="60%"
    //         remainingRatio="12%"
    //         color={customStyles.colors.green}
    //       />

    //       {/* Active Warehouse Staff Card */}
    //       <ProgressBarCard
    //         title="Active Warehouse Staff"
    //         completedRatio="80"
    //         color={customStyles.colors._1B59F8}
    //       />
    //     </SimpleGrid>
    //   </Box>

    //   {/* Note: Bar chart component */}
    //   <BarChart />

    //   {/* Note: Footer charts */}
    //   <Box style={{ padding: "15px 0px" }}>
    //     <SimpleGrid
    //       cols={{ base: 1, sm: 2, md: 2 }}
    //       spacing={customStyles.deviceSize.lg}
    //       verticalSpacing={customStyles.deviceSize.lg}
    //       style={{ justifyContent: "space-between" }}
    //     >
    //       {/* Product Stacked Bar Chart */}
    //       <ProductStackedBarChart />

    //       {/* Donut Chart */}
    //       <DonutChart />
    //     </SimpleGrid>
    //   </Box>
    // </Box>
  );
};

export default DashboardScreen;
