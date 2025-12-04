import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface LikesState {
    likedIds: string[];
}

const initialState: LikesState = {
    likedIds: []
}

const likesSlice = createSlice({
    name: "likes",
    initialState,
    reducers: {
        initLikes: (state, action: PayloadAction<string[]>) => {
            state.likedIds = action.payload;
        },

        addLike: (state, action: PayloadAction<string>) => {
            const { payload: id } = action;
            if (!state.likedIds.includes(id)) {
                state.likedIds = [...state.likedIds, id];
            }
        },

        removeLike: (state, action: PayloadAction<string>) => {
            state.likedIds = state.likedIds.filter(id => id !== action.payload);
        }
    }
})

export const { initLikes, addLike, removeLike } = likesSlice.actions
export default likesSlice.reducer
