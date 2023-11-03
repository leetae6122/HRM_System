import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    defaultFilter: {
        page: 1,
        size: 10,
        where: {},
        order: [],
    },
    filterData: {
        page: 1,
        size: 10,
        where: {},
        order: [],
    },
    departmentList: [],
    total: 0,
    currentPage: 1,
    editDepartmentId: null,
}

export const departmentSlice = createSlice({
    name: 'department',
    initialState,
    reducers: {
        setFilterData: (state, action) => {
            state.filterData = action.payload;
        },
        setDefaultFilterData: (state) => {
            state.filterData = state.defaultFilter;
        },
        setData: (state, action) => {
            state.departmentList = action.payload.departmentList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
        setEditDepartmentId: (state, action) => {
            state.editDepartmentId = action.payload;
        }
    },
})

export const {
    setFilterData,
    setData,
    setDefaultFilterData,
    setEditDepartmentId
} = departmentSlice.actions;
export default departmentSlice.reducer;