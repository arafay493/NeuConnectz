/***** Main reducer configuration *****/

import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./auth-reducer/auth-reducer";
import userReducer from "./user-reducer/user-reducer";
import wareHouseReducer from "./warehouse-reducer/warehouse-reducer";
import groupReducer from "./group-reducer/group-reducer";
import plantReducer from "./plants-reducer/plants-reducer";
import putawayReducer from "./putaway-reducer/putaway-reducer";
import sapReducer from "./sap-reducer/sap-reducer";
import rolesReducer from "./roles-reducer/roles-reducer";
import itrReducer from "./itr-reducer/itr-reducer";
import DashboardReducer from "./dashboard-reducer/dashboard-reducer";
import reconciliationReducer from '@/redux/reducers/reconciliation-reducer/reconciliation-reducer';
import generateBarcodeReducer from '@/redux/reducers/generate-barcode-reducer/generate-barcode-reducer';
import goodsIssueReducer from "@/redux/reducers/gi-reducer/gi-reducer";
import sidebarReducer from "@/redux/reducers/sidebar-reducer/sidebar-reducer";
import movementTypeReducer from "@/redux/reducers/movement-type-reducer/movement-type-reducer"

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
    putawayStates: putawayReducer,
    plantStates: plantReducer,
    movementTypeStates: movementTypeReducer,
    sapStates: sapReducer,
    rolesStates: rolesReducer,
    itrStates: itrReducer,
    reconciliationStates: reconciliationReducer,
    generateBarcodeStates: generateBarcodeReducer,
    gIStates: goodsIssueReducer,
    sidebarStates: sidebarReducer
});

export default persistReducer(persistConfig, rootReducer);