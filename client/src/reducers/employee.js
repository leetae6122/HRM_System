import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    defaultFilter: {
        page: 1,
        size: 10,
        where: {},
        order: [['dateOff', 'ASC'], ['id', 'ASC']],
    },
    filterData: {
        page: 1,
        size: 10,
        where: {},
        order: [['dateOff', 'ASC'], ['id', 'ASC']],
    },
    employeeList: [],
    total: 0,
    currentPage: 1,
    editEmployeeId: null,
}

export const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        setFilterData: (state, action) => {
            state.filterData = action.payload;
        },
        setDefaultFilterData: (state) => {
            state.filterData = state.defaultFilter;
        },
        setData: (state, action) => {
            state.employeeList = action.payload.employeeList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
        setEditEmployeeId: (state, action) => {
            state.editEmployeeId = action.payload;
        },
    },
})

export const {
    setFilterData,
    setData,
    setDefaultFilterData,
    setEditEmployeeId
} = employeeSlice.actions;
export default employeeSlice.reducer;