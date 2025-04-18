// Note: All authenticated action functions are defined here...!

import { createAsyncThunk } from "@reduxjs/toolkit";

// Note: Action function to login user...!
const loginUser = createAsyncThunk(
    "auth/login",
    (
        loginData: { email: string; password: string }
    ) => {
        console.log("Login data in auth action: ", loginData);
    }
);

export { loginUser };