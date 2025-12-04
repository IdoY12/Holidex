import { configureStore } from "@reduxjs/toolkit";
import vacationsSlice from "./vacations-slice";
import likesSlice from "./likes-slice";

const store = configureStore({
    reducer: {
        vacationsSlice,
        likesSlice
    }
})

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch