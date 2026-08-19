// import { Grid, GridCol, Text, Select, TextInput, ActionIcon, ComboboxItem, Button } from "@mantine/core";
// import { DateInput, DatePickerInput } from "@mantine/dates";
// import { IconCalendarMonth, IconFilterOff, IconTrash, IconX } from "@tabler/icons-react";
// import { useMediaQuery } from "@mantine/hooks";
// import { customStyles } from "@/styles/custom-theme";
// import { memo, useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/store";
// import { fetchListAllPlantsCodes } from "@/redux/actions/column-based-access-control/column-based-access-control-actions";
// import { PaginationState } from "@tanstack/react-table";
// import { FadeLoader } from "react-spinners";
// import { fetchAllStorageLocations, fetchAllWareHouses } from "@/redux/actions/warehouse-actions/warehouse-actions";
// import dayjs from "dayjs";

// // plant: null,
// //         warehouse : null,
// //         storageLocation : null,
// //         materialCode: null,
// //         materialDescription: null,
// //         storageType: null,
// //         storageBin: null,
// //         storageSection: null,
// //         batch: null,
// const FilterSection = ({ filterState, Dispatch, isPosted, filterActive }: any) => {
//   const isSmallScreen = useMediaQuery("(max-width: 600px)");
//   const isMediumScreen = useMediaQuery("(max-width: 992px)");
//   const isLargeScreen = useMediaQuery("(max-width: 1200px)");
//   const [filterClicked, setIsFilterClicked] = useState(false)
//   const [isPlantLoading, setIsPlantLoading] = useState(false)
//   const [isWarehouseLoading, setIsWarehouseLoading] = useState(false)
//   const [isStorageLocationLoading, setIsStorageLocationLoading] = useState(false)
//   const [plantPagination, setPlantPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });
//   const [warehousePagination, setWarehousePagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });
//   const [storageLocationPagination, setStorageLocationPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });
//   const skipRecord = plantPagination.pageIndex * plantPagination.pageSize;
//   const skipWarehouseRecord = warehousePagination.pageIndex * warehousePagination.pageSize;
//   const skipStorageLocationRecord = storageLocationPagination.pageIndex * storageLocationPagination.pageSize;

//   // Local States for debouncing
//   const [materialCode, setMaterialCode] = useState(filterState.materialCode || "");
//   const [materialDescription, setMaterialDescription] = useState(filterState.materialDescription || "");
//   const [batch, setBatch] = useState(filterState.batch || "");
//   const [storageBin, setStorageBin] = useState(filterState.storageBin || "");
//   const [storageType, setStorageType] = useState(filterState.storageType || "");
//   const [storageSection, setStorageSection] = useState(filterState.storageSection || "");


//   // Note: Dispatcher for all Actions
//   const dispatch = useAppDispatch();

//   // Note: Redux State
//   const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);
//   const {
//     ListAllPlantsCodes: { data: plantsList, totalCount: plantsCount }
//   } = useAppSelector(({ plantStates }) => plantStates);
//   const {
//     wareHousesList: { data: warehouseList, totalCount: warehouseCount },
//     storageLocationList: { data: storageLocationsList, totalCount: storageLocationCount },
//   } = useAppSelector(({ wareHouseStates }) => wareHouseStates);

//   // Mapped Data For Select Options
//   const mappedPlantList = plantsList.map((item: any) => {
//     if (item?.plantCode && item?.plantName) {
//       return {
//         value: item?.plantCode,
//         label: `${item?.plantName} ( ${item?.plantCode} )`
//       }
//     }
//   });
//   const mappedWarehouseList = [
//     ...new Map(
//       warehouseList
//         ?.filter((item: any) => item?.whsCode && item?.whsName)
//         ?.map((item: any) => [
//           item.whsCode.trim().toUpperCase(), // unique key
//           {
//             value: item.whsCode.trim(),
//             // label: item.whsName.trim(),
//             label: item.whsCode.trim(),
//           },
//         ])
//     ).values(),
//   ];

//   const mappedStorageLocationList: ComboboxItem[] = [
//     ...new Map<string, ComboboxItem>(
//       storageLocationsList
//         ?.filter((item: any) => item?.slcCode)
//         ?.map((item: any) => [
//           item.slcCode.trim().toUpperCase(),
//           {
//             value: item.slcCode.trim(),
//             label: item.slcCode.trim(),
//           },
//         ])
//     ).values(),
//   ];

//   const mappedConfirmationStatusList = [{
//     value: "Confirmed",
//     label: "Confirmed"
//   }, {
//     value: "UnConfirmed",
//     label: "Unconfirmed"
//   }];

//   const useDebouncedFilter = (
//     value: string,
//     key: string,
//     Dispatch: any,
//     delay = 1000
//   ) => {
//     useEffect(() => {
//       const timer = setTimeout(() => {
//         if (value) {
//           Dispatch({
//             type: "SET_FILTER",
//             key,
//             payload: value || null,
//           });
//         }
//       }, delay);
//       return () => clearTimeout(timer);
//     }, [value]);
//   };
//   useDebouncedFilter(materialCode, "materialCode", Dispatch);
//   useDebouncedFilter(materialDescription, "materialDescription", Dispatch);
//   useDebouncedFilter(batch, "batch", Dispatch);
//   useDebouncedFilter(storageBin, "storageBin", Dispatch);
//   useDebouncedFilter(storageType, "storageType", Dispatch);
//   useDebouncedFilter(storageSection, "storageSection", Dispatch);

//   useEffect(() => {
//     if (filterClicked) {
//       setIsPlantLoading(true)
//       Promise.all([
//         dispatch(
//           fetchListAllPlantsCodes({
//             authToken: authenticatedUser?.token as string,
//             lastCount: plantPagination.pageSize,
//             skipRecords: skipRecord,
//           })
//         ),
//       ]).finally(() => {
//         setIsPlantLoading(false)
//       });
//     }
//   }, [filterClicked])

//   const handlePlantChange = (val: any) => {
//     Dispatch({
//       type: "SET_FILTER",
//       key: "plant",
//       payload: val ? String(val) : null,
//     });
//     setIsWarehouseLoading(true)
//     Promise.all([
//       dispatch(
//         fetchAllWareHouses({
//           authToken: authenticatedUser?.token as string,
//           plantCode: String(val),
//           lastCount: warehousePagination.pageSize,
//           skipRecords: skipWarehouseRecord,
//         })
//       )
//     ]).finally(() => {
//       setIsWarehouseLoading(false)
//     });
//   }

//   const handleWarehouseChange = (val: any) => {
//     Dispatch({ type: "SET_FILTER", key: "warehouseNo", payload: val ? val : null })
//     setIsStorageLocationLoading(true)
//     Promise.all([
//       dispatch(
//         fetchAllStorageLocations({
//           authToken: authenticatedUser?.token as string,
//           warehouseCode: val,
//           plantCode: Number(filterState.plant),
//           lastCount: storageLocationPagination.pageSize,
//           skipRecords: skipStorageLocationRecord,
//         })
//       )
//     ]).finally(() => {
//       setIsStorageLocationLoading(false)
//     });
//   }

//   const OnScrollEndPaginatePlantList = (e: any) => {
//     const target = e.currentTarget;
//     const hasMore = plantsList?.length < plantsCount;
//     const reachedBottom =
//       target.scrollTop + target.clientHeight >= target.scrollHeight - 20;

//     if (hasMore && reachedBottom && !isPlantLoading) {
//       setIsPlantLoading(true);

//       setPlantPagination((prev) => {
//         const updatedPageSize = prev.pageSize + 5;
//         const updatedPageIndex = prev.pageIndex + 1;

//         dispatch(
//           fetchListAllPlantsCodes({
//             authToken: authenticatedUser?.token as string,
//             lastCount: updatedPageSize,
//             skipRecords: 0,
//           })
//         ).finally(() => {
//           setIsPlantLoading(false);
//         });

//         return {
//           pageSize: updatedPageSize,
//           pageIndex: updatedPageIndex,
//         };
//       });
//     }
//   };

//   const OnScrollEndPaginateWarehouseList = (e: any) => {
//     const target = e.currentTarget;
//     const hasMore = warehouseList?.length < warehouseCount;
//     const reachedBottom =
//       target.scrollTop + target.clientHeight >= target.scrollHeight - 20;

//     if (hasMore && reachedBottom && !isPlantLoading) {
//       setIsWarehouseLoading(true);

//       setWarehousePagination((prev) => {
//         const updatedPageSize = prev.pageSize + 5;
//         const updatedPageIndex = prev.pageIndex + 1;

//         dispatch(
//           fetchAllWareHouses({
//             authToken: authenticatedUser?.token as string,
//             lastCount: updatedPageSize,
//             skipRecords: 0,
//           })
//         ).finally(() => {
//           setIsWarehouseLoading(false);
//         });

//         return {
//           pageSize: updatedPageSize,
//           pageIndex: updatedPageIndex,
//         };
//       });
//     }
//   };

//   const OnScrollEndPaginateStorageLocationList = (e: any) => {
//     const target = e.currentTarget;
//     const hasMore = storageLocationsList?.length < storageLocationCount;
//     const reachedBottom =
//       target.scrollTop + target.clientHeight >= target.scrollHeight - 20;

//     if (hasMore && reachedBottom && !isPlantLoading) {
//       setIsStorageLocationLoading(true);

//       setStorageLocationPagination((prev) => {
//         const updatedPageSize = prev.pageSize + 5;
//         const updatedPageIndex = prev.pageIndex + 1;

//         dispatch(
//           fetchAllStorageLocations({
//             authToken: authenticatedUser?.token as string,
//             warehouseCode: filterState.warehouseNo,
//             plantCode: Number(filterState.plant),
//             lastCount: updatedPageSize,
//             skipRecords: 0,
//           })
//         ).finally(() => {
//           setIsStorageLocationLoading(false);
//         });

//         return {
//           pageSize: updatedPageSize,
//           pageIndex: updatedPageIndex,
//         };
//       });
//     }
//   };

//   const handleResetFilters = () => {
//     Dispatch({ type: "RESET", key: null, payload: null });

//     setMaterialCode("");
//     setMaterialDescription("");
//     setBatch("");
//     setStorageBin("");
//     setStorageType("");
//     setStorageSection("");
//   };

//   const span = isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 4 : 12 / 5


//   // const handleFilterClick = (type: string) => {
//   //   if (type === "PLANT") {
//   //     setIsPlantLoading(true)
//   //     dispatch(
//   //       fetchListAllPlantsCodes({
//   //         authToken: authenticatedUser?.token as string,
//   //         lastCount: plantPagination.pageSize,
//   //         skipRecords: skipRecord,
//   //       })
//   //     ).finally(() => setIsPlantLoading(false))
//   //   }
//   // }

//   return (
//     <Grid
//       mt={16}
//       mb={8}
//       bg={customStyles?.colors?.white || "#fff"}
//       p={24}
//       align="end"
//       style={{
//         borderRadius: "16px",
//         gap: isSmallScreen ? "16px" : "24px",
//       }}
//     >
//       {/* Plant Code */}
//       <GridCol span={span}>
//         <Text size="md" mb={8} fw={500}>Plant</Text>
//         <Select
//           placeholder="Select Plant"
//           data={mappedPlantList}
//           nothingFoundMessage="No Data Found"
//           clearable
//           radius={8}
//           size="md"
//           onClick={() => setIsFilterClicked(true)}
//           // onClick = {() => handleFilterClick("PLANT")}
//           // maxDropdownHeight={100}
//           value={filterState?.plant?.toString() || null}
//           onChange={(val) => handlePlantChange(val)}
//           rightSection={isPlantLoading ? <FadeLoader
//             height={15}
//             width={3}
//             margin={1}
//             radius={1}
//             color="#1b59f8" /> : null}
//           scrollAreaProps={{
//             onScrollEndCapture: (e) => OnScrollEndPaginatePlantList(e),
//           }}
//         />
//       </GridCol>

//       {/* Warehouse */}
//       <GridCol span={span}>
//         <Text size="md" mb={8} fw={500}>Warehouse</Text>
//         <Select
//           placeholder="Select Warehouse"
//           data={mappedWarehouseList}
//           nothingFoundMessage="No Data Found"
//           clearable
//           radius={8}
//           size="md"
//           onClick={() => setIsFilterClicked(true)}
//           // maxDropdownHeight={50}
//           value={filterState.warehouseNo?.toString() || null}
//           // onChange={(val) => { Dispatch({ type: "SET_FILTER", key: "warehouseNo", payload: val ? val : null }) }}
//           onChange={(val) => handleWarehouseChange(val)}
//           rightSection={isWarehouseLoading ? <FadeLoader
//             height={15}
//             width={3}
//             margin={1}
//             radius={1}
//             color="#1b59f8" /> : null}
//           scrollAreaProps={{
//             onScrollEndCapture: (e) => OnScrollEndPaginateWarehouseList(e),
//           }}
//         />
//       </GridCol>

//       {/* Storage Location */}
//       <GridCol span={span}>
//         <Text size="md" mb={8} fw={500}>Storage Location</Text>
//         <Select
//           placeholder="Storage Location"
//           data={mappedStorageLocationList}
//           nothingFoundMessage="No Data Found"
//           clearable
//           radius={8}
//           size="md"
//           onClick={() => setIsFilterClicked(true)}
//           // maxDropdownHeight={50}
//           value={filterState.storageLocation?.toString() || null}
//           onChange={(val) => { Dispatch({ type: "SET_FILTER", key: "storageLocation", payload: val ? val : null }) }}
//           rightSection={isStorageLocationLoading ? <FadeLoader
//             height={15}
//             width={3}
//             margin={1}
//             radius={1}
//             color="#1b59f8" /> : null}
//           scrollAreaProps={{
//             onScrollEndCapture: (e) => OnScrollEndPaginateStorageLocationList(e),
//           }}
//         />
//       </GridCol>

//       {/* Confirmation Status */}
//       {/* {!isPosted && <GridCol span={span}>
//         <Text size="md" mb={8} fw={500}>Status</Text>
//         <Select
//           placeholder="Select Status"
//           data={mappedConfirmationStatusList}
//           onChange={(val) => { Dispatch({ type: "SET_FILTER", key: "confirmationStatus", payload: val ? val : null }) }}
//           value={filterState.confirmationStatus?.toString() || null}
//           clearable
//           radius={8}
//           size="md"
//         />
//       </GridCol>} */}

//       {/* Material Code */}
//       <GridCol span={span}>
//         <Text size="md" mb={8} fw={500}>Material Code</Text>
//         <TextInput
//           placeholder="Enter Material Code"
//           value={materialCode}
//           onChange={(e) => {
//             setMaterialCode(e.currentTarget.value);
//             if (!e.currentTarget.value) {
//               Dispatch({
//                 type: "SET_FILTER",
//                 key: "materialCode",
//                 payload: null,
//               });
//             }
//           }}
//           radius={8}
//           size="md"
//         />
//       </GridCol>

//       {/* Material Description */}
//       <GridCol span={span}>
//         <Text size="md" mb={8} fw={500}>Material Description</Text>
//         <TextInput
//           placeholder="Enter Material Description"
//           value={materialDescription}
//           onChange={(e) => {
//             setMaterialDescription(e.currentTarget.value);
//             if (!e.currentTarget.value) {
//               Dispatch({
//                 type: "SET_FILTER",
//                 key: "materialDescription",
//                 payload: null,
//               });
//             }
//           }}
//           radius={8}
//           size="md"
//         />
//       </GridCol>

//       {/* Batch */}
//       <GridCol span={span}>
//         <Text size="md" mb={8} fw={500}>Batch</Text>
//         <TextInput
//           placeholder="Enter Batch"
//           value={batch}
//           onChange={(e) => {
//             setBatch(e.currentTarget.value);
//             if (!e.currentTarget.value) {
//               Dispatch({
//                 type: "SET_FILTER",
//                 key: "batch",
//                 payload: null,
//               });
//             }
//           }}
//           radius={8}
//           size="md"
//         />
//       </GridCol>

//       {/* Storage Bin */}
//       <GridCol span={span}>
//         <Text size="md" mb={8} fw={500}>Storage Bin</Text>
//         <TextInput
//           placeholder="Enter Storage Bin"
//           value={storageBin}
//           onChange={(e) => {
//             setStorageBin(e.currentTarget.value);
//             if (!e.currentTarget.value) {
//               Dispatch({
//                 type: "SET_FILTER",
//                 key: "storageBin",
//                 payload: null,
//               });
//             }
//           }}
//           radius={8}
//           size="md"
//         />
//       </GridCol>

//       {/* Storage Type */}
//       <GridCol span={span}>
//         <Text size="md" mb={8} fw={500}>Storage Type</Text>
//         <TextInput
//           placeholder="Enter Storage Type"
//           value={storageType}
//           onChange={(e) => {
//             setStorageType(e.currentTarget.value);
//             if (!e.currentTarget.value) {
//               Dispatch({
//                 type: "SET_FILTER",
//                 key: "storageType",
//                 payload: null,
//               });
//             }
//           }}
//           radius={8}
//           size="md"
//         />
//       </GridCol>

//       {/* Storage Section */}
//       <GridCol span={span}>
//         <Text size="md" mb={8} fw={500}>Storage Section</Text>
//         <TextInput
//           placeholder="Enter Storage Section"
//           value={storageSection}
//           onChange={(e) => {
//             setStorageSection(e.currentTarget.value);
//             if (!e.currentTarget.value) {
//               Dispatch({
//                 type: "SET_FILTER",
//                 key: "storageSection",
//                 payload: null,
//               });
//             }
//           }}
//           radius={8}
//           size="md"
//         />
//       </GridCol>

//       {/* <GridCol span={span}>
//         <Text size="md" mb={8} fw={500}>Created Date</Text>
//         <DatePickerInput
//           rightSection={
//             filterState.createdDate ? (
//               <ActionIcon
//                 variant="light"
//                 onClick={() =>
//                   Dispatch({
//                     type: "SET_FILTER",
//                     key: "createdDate",
//                     payload: null,
//                   })
//                 }
//               >
//                 <IconX size={16} />
//               </ActionIcon>
//             ) : (
//               <IconCalendarMonth size={20} />
//             )
//           }
//           placeholder="Select Date"
//           value={
//             filterState.createdDate
//               ? dayjs(filterState.createdDate).toDate()
//               : null
//           }
//           onChange={(val) =>
//             Dispatch({
//               type: "SET_FILTER",
//               key: "createdDate",
//               payload: val
//                 ? dayjs(val)
//                   .hour(12)
//                   .minute(0)
//                   .second(0)
//                   .millisecond(0)
//                   .toISOString()
//                 : null
//               // payload: val ? dayjs(val).toISOString() : null,
//               // payload: val ? dayjs(val).format("YYYY-MM-DD") : null,
//             })
//           }
//           radius={8}
//           size="md"
//           clearable
//           maxDate={new Date()}
//         />
//       </GridCol> */}
//       {/* {isPosted && <GridCol span={span}>
//         <Text size="md" mb={8} fw={500}>Posted Date</Text>
//         <DatePickerInput
//           rightSection={
//             filterState.postedDate ? (
//               <ActionIcon
//                 variant="light"
//                 onClick={() =>
//                   Dispatch({
//                     type: "SET_FILTER",
//                     key: "postedDate",
//                     payload: null,
//                   })
//                 }
//               >
//                 <IconX size={16} />
//               </ActionIcon>
//             ) : (
//               <IconCalendarMonth size={20} />
//             )
//           }
//           placeholder="Select Date"
//           value={
//             filterState.postedDate
//               ? dayjs(filterState.postedDate).toDate()
//               : null
//           }
//           onChange={(val) =>
//             Dispatch({
//               type: "SET_FILTER",
//               key: "postedDate",
//               payload: val
//                 ? dayjs(val)
//                   .hour(12)
//                   .minute(0)
//                   .second(0)
//                   .millisecond(0)
//                   .toISOString()
//                 : null
//               // payload: val ? dayjs(val).toISOString() : null,
//               // payload: val ? dayjs(val).format("YYYY-MM-DD") : null,
//             })
//           }
//           radius={8}
//           size="md"
//           clearable
//           maxDate={new Date()}
//         />
//       </GridCol>} */}
//       {filterActive && <GridCol span={span} style={{ marginLeft: "auto", marginTop: 10 }}>
//         <Button
//           variant="filled"
//           py={10}
//           w={"100%"}
//           // className={"filledButton"}
//           color={customStyles.colors.red}
//           // disabled={row?.original?.confirmationStatus !== "Confirmed"}
//           leftSection={<IconFilterOff size={18} />}
//           radius={8}
//           miw={121}
//           onClick={() => handleResetFilters()}
//         >
//           Remove Filters
//         </Button>
//       </GridCol>}
//     </Grid>
//   );
// }

// export default memo(FilterSection)
