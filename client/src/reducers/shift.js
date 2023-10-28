import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    defaultFilter: {
        page: 1,
        size: 10,
        where: {},
        order: []
    },
    filterData: {
        page: 1,
        size: 10,
        where: {},
        order: []
    },
    shiftList: [],
    total: 0,
    currentPage: 1,
    editShiftId: null,
    currentShift: null
}

export const shiftSlice = createSlice({
    name: 'shift',
    initialState,
    reducers: {
        setFilterData: (state, action) => {
            state.filterData = action.payload;
        },
        setDefaultFilterData: (state) => {
            state.filterData = state.defaultFilter;
        },
        setData: (state, action) => {
            state.shiftList = action.payload.shiftList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
        setEditShiftId: (state, action) => {
            state.editShiftId = action.payload;
        },
        setCurrentShift: (state, action) => {
            state.currentShift = action.payload;
        },
    },
})

export const { 
    setFilterData, 
    setData, 
    setDefaultFilterData, 
    setEditShiftId,
    setCurrentShift,
} = shiftSlice.actions;
export default shiftSlice.reducer;