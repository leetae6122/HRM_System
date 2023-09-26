import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    filterData: {
        page: 1,
        size: 10,
        where: {},
    },
    positionList: null,
    total: 0,
    currentPage: 1
}

export const positionSlice = createSlice({
    name: 'currency',
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
            state.positionList = action.payload.positionList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
    },
})

export const { setFilterData, setData, setDefaultFilterData } = positionSlice.actions;
export default positionSlice.reducer;