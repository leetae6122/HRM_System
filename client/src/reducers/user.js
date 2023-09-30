import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    filterData: {
        page: 1,
        size: 10,
        where: {},
    },
    userList: [],
    total: 0,
    currentPage: 1
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setFilterData: (state, action) => {
            state.filterData = action.payload;
        },
        setDefaultFilterData: (state) => {
            state.filterData = {
                page: 1,
                size: 10,
                where: {},
            };
        },
        setData: (state, action) => {
            state.userList = action.payload.userList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
    },
})

export const { setFilterData, setData, setDefaultFilterData } = userSlice.actions;
export default userSlice.reducer;