import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    defaultFilter: {
        page: 1,
        size: 10,
        where: {},
        order: [],
        modelEmployee: {}
    },
    filterData: {
        page: 1,
        size: 10,
        where: {},
        order: [],
        modelEmployee: {}
    },
    allowanceList: [],
    total: 0,
    currentPage: 1,
    editAllowanceId: null,
}

export const allowanceSlice = createSlice({
    name: 'allowance',
    initialState,
    reducers: {
        setFilterData: (state, action) => {
            state.filterData = action.payload;
        },
        setDefaultFilterData: (state) => {
            state.filterData = state.defaultFilter;
        },
        setData: (state, action) => {
            state.allowanceList = action.payload.allowanceList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
        setEditAllowanceId: (state, action) => {
            state.editAllowanceId = action.payload;
        }
    },
})

export const {
    setFilterData,
    setData,
    setDefaultFilterData,
    setEditAllowanceId
} = allowanceSlice.actions;
export default allowanceSlice.reducer;