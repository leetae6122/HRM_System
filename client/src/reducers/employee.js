import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    filterData: {
        page: 1,
        size: 10,
        where: {},
    },
    employeeList: null,
    total: 0,
    currentPage: 1
}

export const employeeSlice = createSlice({
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
            state.employeeList = action.payload.employeeList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
    },
})

export const { setFilterData, setData, setDefaultFilterData } = employeeSlice.actions;
export default employeeSlice.reducer;