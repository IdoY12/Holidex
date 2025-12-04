import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type Vacation from "../models/Vacation";

export enum VacationsFilter {
    ALL = "all",
    LIKED = "liked",
    UPCOMING = "upcoming",
    ACTIVE = "active"
}

interface VacationsState {
    vacations: Vacation[];
    filter: VacationsFilter;
    page: number;
    totalPages: number;
}

const initialState: VacationsState = {
    vacations: [],
    filter: VacationsFilter.ALL,
    page: 1,
    totalPages: 1
};

const vacationsSlice = createSlice({
    name: "vacations",
    initialState,
    reducers: {
        init: (state, action: PayloadAction<Vacation[]>) => {
            state.vacations = action.payload;
        },

        setFilter: (state, action: PayloadAction<VacationsFilter>) => {
            state.filter = action.payload;
            state.page = 1;
        },

        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },

        setTotalPages: (state, action: PayloadAction<number>) => {
            state.totalPages = action.payload;
        },

        addVacation: (state, action: PayloadAction<Vacation>) => {
            state.vacations = [action.payload, ...state.vacations];
        },

        updateVacation: (state, action: PayloadAction<Vacation>) => {
            state.vacations = state.vacations.map(v =>
                v.id === action.payload.id ? action.payload : v
            );
        },

        deleteVacation: (state, action: PayloadAction<string>) => {
            state.vacations = state.vacations.filter(v => v.id !== action.payload);
        },

        incrementLikes: (state, action: PayloadAction<string>) => {
            const vacation = state.vacations.find(v => v.id === action.payload);
            if (vacation) vacation.likes++;
        },

        decrementLikes: (state, action: PayloadAction<string>) => {
            const vacation = state.vacations.find(v => v.id === action.payload);
            if (vacation) vacation.likes--;
        },
    }
});

export const {
    init,
    setFilter,
    setPage,
    setTotalPages,
    addVacation,
    updateVacation,
    deleteVacation,
    incrementLikes,
    decrementLikes
} = vacationsSlice.actions;

export default vacationsSlice.reducer;
