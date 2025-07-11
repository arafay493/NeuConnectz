/***** Main reducer configuration *****/

import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./auth-reducer/auth-reducer";
import userReducer from "./user-reducer/user-reducer";
import wareHouseReducer from "./warehouse-reducer/warehouse-reducer";
import groupReducer from "./group-reducer/group-reducer";
import sapReducer from "./sap-reducer/sap-reducer";
import rolesReducer from "./roles-reducer/roles-reducer";
import itrReducer from "./itr-reducer/itr-reducer";
import DashboardReducer from "./dashboard-reducer/dashboard-reducer";
import reconciliationReducer from '@/redux/reducers/reconciliation-reducer/reconciliation-reducer';

// Note: Persist reducer configuration...!
const persistConfig = {
    key: "root",
    storage,
    whitelist: ['authStates']
};

const rootReducer = combineReducers({
    authStates: authReducer,
    dashboardStates: DashboardReducer,
    userStates: userReducer,
    wareHouseStates: wareHouseReducer,
    groupStates: groupReducer,
    sapStates: sapReducer,
    rolesStates: rolesReducer,
    itrStates: itrReducer,
    reconciliationStates: reconciliationReducer,
});

export default persistReducer(persistConfig, rootReducer);