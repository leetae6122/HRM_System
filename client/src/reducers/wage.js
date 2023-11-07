import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    defaultFilter: {
        page: 1,
        size: 10,
        where: {},
        order: [['toDate', 'ASC']],
    },
    filterData: {
        page: 1,
        size: 10,
        where: {},
        order: [['toDate', 'ASC']],
    },
    wageList: [],
    total: 0,
    currentPage: 1,
    editWageId: null,
}

export const wageSlice = createSlice({
    name: 'wage',
    initialState,
    reducers: {
        setFilterData: (state, action) => {
            state.filterData = action.payload;
        },
        setDefaultFilterData: (state) => {
            state.filterData = state.defaultFilter;
        },
        setData: (state, action) => {
            state.wageList = action.payload.wageList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
        setEditWageId: (state, action) => {
            state.editWageId = action.payload;
        }
    },
})

export const {
    setFilterData,
    setData,
    setDefaultFilterData,
    setEditWageId
} = wageSlice.actions;
export default wageSlice.reducer;