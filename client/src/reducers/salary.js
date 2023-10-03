import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    filterData: {
        page: 1,
        size: 10,
        where: {},
    },
    salaryList: [],
    total: 0,
    currentPage: 1,
    editSalaryId: null,
}

export const salarySlice = createSlice({
    name: 'salary',
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
            state.salaryList = action.payload.salaryList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
        setEditSalaryId: (state, action) => {
            state.editSalaryId = action.payload;
        }
    },
})

export const { 
    setFilterData, 
    setData, 
    setDefaultFilterData, 
    setEditSalaryId 
} = salarySlice.actions;
export default salarySlice.reducer;