import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

const store = configureStore({
    reducer:{
        user:userSlice.reducer
    }
});

export type StoreType = ReturnType<typeof store.getState>
export type AddDispatch = typeof store.dispatch

export default store