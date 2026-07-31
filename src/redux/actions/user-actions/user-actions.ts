import { handleRefreshToken } from "@/constants/refresh-token";
import { apiGet, apiPost, apiPut } from "@/lib/api-service";
import { FETCH_ALL_USERS, FETCH_ALL_QTRACK_USERS, FETCH_ALL_LIST_DEPARTMENTS, CLEAR_ALL_USER_STATES, UNAUTHORIZE_USER_TRYING_TO_ACCESS_USERS_DATA } from "@/redux/reducers/user-reducer/user-reducer";
import { ResHandler } from "@/types/api-types";
import { CreateUserDataType, UpdateUserType } from "@/types/modules/user-types/user-types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const QTRACK_BASE_URL = process.env.NEXT_PUBLIC_QTRACK_BASE_URL;

// Note: Action function fetch all users...!
const fetchAllUsers = createAsyncThunk(
    "user/fetchAllUsers",
    async (
        { authToken, LastCount, skipRecord }:
            {
                authToken: string,
                LastCount?: number,
                skipRecord?: number
            },
        { dispatch }
    ) => {
        const params: { [key: string]: number } = {};
        if (LastCount !== undefined) params.LastCount = LastCount;
        if (skipRecord !== undefined) params.skipRecord = skipRecord;

        const response = await apiGet('/neu-connect/v2/IUserManagementFeature/ListUsers', authToken, params);
        console.log('Users list: ', response);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ALL_USERS(data?.data));
        };
    }
);

const fetchAllQtrackUsers = createAsyncThunk(
  "user/fetchAllQtrackUsers",
  async (
    {
      authToken,
      LastCount,
      skipRecord,
      keywords,
    }: {
      authToken: string;
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
        `${QTRACK_BASE_URL}/QTrack/IUserManagementFeature/ListUsers`,
        {
          params,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // console.log("QTrack Users:", response.data);

      if (response.status === 200) {
        dispatch(FETCH_ALL_QTRACK_USERS(response.data));
      }
    } catch (error) {
      console.error("Fetch QTrack Users Error:", error);
    }
  }
);

// Add User
const addQtrackUser = createAsyncThunk(
  "user/addQtrackUser",
  async (
    {
      userData,
      token,
      resHandler,
    }: {
      userData: CreateUserDataType;
      token: string;
      resHandler: ResHandler;
    }
  ) => {
    try {
      const response = await axios.post(
        `${QTRACK_BASE_URL}/QTrack/IUserManagementFeature/AddUser`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);

      resHandler(response);
    } catch (error: any) {
      console.error("Add User Error:", error);
      resHandler(error.response);
    }
  }
);

// Note: Action function to create / add user...!
const addUser = createAsyncThunk(
    "user/add",
    async (
        { userData, token, resHandler }:
            {
                userData: CreateUserDataType,
                token: string,
                resHandler: ResHandler
            },
        { dispatch }
    ) => {
        const response = await apiPost(`/neu-connect/v2${process.env.NEXT_PUBLIC_ADD_USER}`, userData, token);
        console.log(response);
        response && resHandler(response);
    }
);

// Note: Action function to update user...!
const updateUser = createAsyncThunk(
    "user/updateUser",
    async (
        { editUserData, token, resHandler }:
            {
                editUserData: UpdateUserType,
                token: string,
                resHandler: ResHandler
            },
        { dispatch }
    ) => {
        const response = await apiPut('/neu-connect/v2/IUserManagementFeature/ActivateOrDeactivateUser', editUserData, token);

        const { status, data } = response;

        if (status == 201) {
            resHandler(response);
        };
    }
);

// Note: Action function fetch all list departments...!
const fetchAllListDepartments = createAsyncThunk(
    "user/fetchAllListDepartments",
    async (authToken: string, { dispatch }) => {

        const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_FETCH_ALL_LIST_DEPARTMENTS}`, authToken);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ALL_LIST_DEPARTMENTS(data?.data));
        };
    }
);

export {
    addUser, addQtrackUser, fetchAllUsers,fetchAllQtrackUsers , updateUser, fetchAllListDepartments
};
