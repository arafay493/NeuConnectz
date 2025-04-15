/***** Redux Store configuration *****/

import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import rootReducer from "./reducers/reducer";

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false
    })
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Note: Typed hooks for usage in components...!
const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export {
    store,
    persistor,
    useAppDispatch,
    useAppSelector
};