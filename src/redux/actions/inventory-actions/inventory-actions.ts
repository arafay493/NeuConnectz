import { handleRefreshToken } from "@/constants/refresh-token";
import { apiGet, apiPost, apiPut } from "@/lib/api-service";
import { FETCH_ALL_INVENTORY, CLEAR_ALL_INVENTORY_STATES, UNAUTHORIZE_USER_TRYING_TO_ACCESS_InVENTORY_DATA } from "@/redux/reducers/inventory-reducer/inventory-reducer";
import { ResHandler } from "@/types/api-types";
import { CreateUserDataType, UpdateUserType } from "@/types/modules/user-types/user-types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const TRACK_AND_TRACE_BASE_URL = process.env.NEXT_PUBLIC_TRACK_AND_TRACE_BASE_URL;

// Note: Action function fetch all users...!
// const fetchAllUsers = createAsyncThunk(
//     "user/fetchAllUsers",
//     async (
//         { authToken, LastCount, skipRecord }:
//             {
//                 authToken: string,
//                 LastCount?: number,
//                 skipRecord?: number
//             },
//         { dispatch }
//     ) => {
//         const params: { [key: string]: number } = {};
//         if (LastCount !== undefined) params.LastCount = LastCount;
//         if (skipRecord !== undefined) params.skipRecord = skipRecord;

//         const response = await apiGet('/neu-connect/v2/IUserManagementFeature/ListUsers', authToken, params);
//         console.log('Users list: ', response);

//         const { status, data } = response;

//         if (status == 200) {
//             dispatch(FETCH_ALL_USERS(data?.data));
//         };
//     }
// );

const fetchAllInventory = createAsyncThunk(
  "user/fetchAllInventory",
  async (
    {
      authToken,
      isScanned,
      isDispatched,
      LastCount,
      skipRecord,
      keywords,
    }: {
      authToken: string;
      isScanned: boolean,
      isDispatched: boolean,
      LastCount?: number;
      skipRecord?: number;
      keywords?: string;
    },
    { dispatch }
  ) => {
    try {
      const params: { [key: string]: number | string } = {};

      if (LastCount !== undefined) params.LastCount = LastCount;
      if (skipRecord !== undefined) params.skipRecord = skipRecord;
      if (keywords !== undefined) params.keywords = keywords;

      const response = await axios.get(
        `${TRACK_AND_TRACE_BASE_URL}/Track_And_Trace/IProductionOrderFeature/GetAllItemsBoxSummary`,
        {
          params,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // console.log("QTrack Users:", response.data);

      if (response.status === 200) {
        dispatch(FETCH_ALL_INVENTORY(response.data.data));
      }
    } catch (error) {
      console.error("Fetch QTrack Users Error:", error);
    }
  }
);

// Add User
// const addQtrackUser = createAsyncThunk(
//   "user/addQtrackUser",
//   async (
//     {
//       userData,
//       token,
//       resHandler,
//     }: {
//       userData: any;
//       token: string;
//       resHandler: ResHandler;
//     }
//   ) => {
//     try {
//       const response = await axios.post(
//         `${QTRACK_BASE_URL}/QTrack/IUserManagementFeature/AddUser`,
//         userData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log(response.data);

//       resHandler(response);
//     } catch (error: any) {
//       console.error("Add User Error:", error);
//       resHandler(error.response);
//     }
//   }
// );

// // Note: Action function to create / add user...!
// const addUser = createAsyncThunk(
//     "user/add",
//     async (
//         { userData, token, resHandler }:
//             {
//                 userData: CreateUserDataType,
//                 token: string,
//                 resHandler: ResHandler
//             },
//         { dispatch }
//     ) => {
//         const response = await apiPost(`/neu-connect/v2${process.env.NEXT_PUBLIC_ADD_USER}`, userData, token);
//         console.log(response);
//         response && resHandler(response);
//     }
// );

// // Note: Action function to update user...!
// const updateUser = createAsyncThunk(
//     "user/updateUser",
//     async (
//         { editUserData, token, resHandler }:
//             {
//                 editUserData: UpdateUserType,
//                 token: string,
//                 resHandler: ResHandler
//             },
//         { dispatch }
//     ) => {
//         const response = await apiPut('/neu-connect/v2/IUserManagementFeature/ActivateOrDeactivateUser', editUserData, token);

//         const { status, data } = response;

//         if (status == 201) {
//             resHandler(response);
//         };
//     }
// );

// export const updateQTrackUser = createAsyncThunk(
//   "user/updateQTrackUser",
//   async (
//     {
//       authToken,
//       userId,
//       isActive,
//       resHandler,
//     }: {
//       authToken: string;
//       userId: string;
//       isActive: boolean;
//       resHandler?: (response: any) => void;
//     },
//     { dispatch }
//   ) => {
//     try {
//       const response = await axios.put(
//         `${QTRACK_BASE_URL}/QTrack/IUserManagementFeature/UpdateActivationStatus`,
//         {
//           userId,
//           isActive,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       );

//       resHandler?.(response);


//     } catch (error) {
//       console.error("Update QTrack User Error:", error);
//     }
//   }
// );

// Note: Action function fetch all list departments...!
// const fetchAllListDepartments = createAsyncThunk(
//     "user/fetchAllListDepartments",
//     async (authToken: string, { dispatch }) => {

//         const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_FETCH_ALL_LIST_DEPARTMENTS}`, authToken);

//         const { status, data } = response;

//         if (status == 200) {
//             dispatch(FETCH_ALL_LIST_DEPARTMENTS(data?.data));
//         };
//     }
// );

// export {
//     addUser, addQtrackUser, fetchAllUsers,fetchAllQtrackUsers , updateUser, fetchAllListDepartments
// };
export {
  fetchAllInventory
};
