import { combineSlices, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import songSlice from "./songSlice";

const store = configureStore({
    reducer: combineSlices(
        userSlice,
        songSlice
     ),
});

export type StoreType = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch

export default store