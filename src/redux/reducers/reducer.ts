/***** Main reducer configuration *****/

import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./auth-reducer/auth-reducer";
import userReducer from "./user-reducer/user-reducer";

// Note: Persist reducer configuration...!
const persistConfig = {
    key: "root",
    storage,
    whitelist: ['authStates']
};

const rootReducer = combineReducers({
    authStates: authReducer,
    userStates: userReducer
});

export default persistReducer(persistConfig, rootReducer);