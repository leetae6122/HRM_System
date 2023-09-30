import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    filterData: {
        page: 1,
        size: 10,
        where: {},
    },
    positionList: [],
    total: 0,
    currentPage: 1,
    editPositionId: null,
}

export const positionSlice = createSlice({
    name: 'position',
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
        setEditPositionId: (state, action) => {
            state.editPositionId = action.payload;
        }
    },
})

export const { 
    setFilterData, 
    setData, 
    setDefaultFilterData, 
    setEditPositionId 
} = positionSlice.actions;
export default positionSlice.reducer;