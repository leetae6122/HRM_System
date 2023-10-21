import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    defaultFilter: {
        page: 1,
        size: 10,
        where: {},
        order: [],
        modelCountry: { where: {} }
    },
    filterData: {
        page: 1,
        size: 10,
        where: {},
        order: [],
        modelCountry: { where: {} }
    },
    officeList: [],
    total: 0,
    currentPage: 1,
    editOfficeId: null,
}

export const officeSlice = createSlice({
    name: 'office',
    initialState,
    reducers: {
        setFilterData: (state, action) => {
            state.filterData = action.payload;
        },
        setDefaultFilterData: (state) => {
            state.filterData = state.defaultFilter;
        },
        setData: (state, action) => {
            state.officeList = action.payload.officeList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
        setEditOfficeId: (state, action) => {
            state.editOfficeId = action.payload;
        }
    },
})

export const {
    setFilterData,
    setData,
    setDefaultFilterData,
    setEditOfficeId
} = officeSlice.actions;
export default officeSlice.reducer;