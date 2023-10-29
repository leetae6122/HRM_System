import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    defaultFilter: {
        page: 1,
        size: 10,
        where: {},
        order: [],
        modelEmployee: { where: {} }
    },
    filterData: {
        page: 1,
        size: 10,
        where: {},
        order: [],
        modelEmployee: { where: {} }
    },
    payrollList: [],
    total: 0,
    currentPage: 1,
    editPayrollId: null,
}

export const payrollSlice = createSlice({
    name: 'payroll',
    initialState,
    reducers: {
        setFilterData: (state, action) => {
            state.filterData = action.payload;
        },
        setDefaultFilterData: (state) => {
            state.filterData = state.defaultFilter;
        },
        setData: (state, action) => {
            state.payrollList = action.payload.payrollList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
        setEditPayrollId: (state, action) => {
            state.editPayrollId = action.payload;
        }
    },
})

export const {
    setFilterData,
    setData,
    setDefaultFilterData,
    setEditPayrollId
} = payrollSlice.actions;
export default payrollSlice.reducer;