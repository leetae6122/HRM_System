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
    countryList: [],
    total: 0,
    currentPage: 1,
    editCountryId: null,
}

export const countrySlice = createSlice({
    name: 'country',
    initialState,
    reducers: {
        setFilterData: (state, action) => {
            state.filterData = action.payload;
        },
        setDefaultFilterData: (state) => {
            state.filterData = state.defaultFilter;
        },
        setData: (state, action) => {
            state.countryList = action.payload.countryList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
        setEditCountryId: (state, action) => {
            state.editCountryId = action.payload;
        }
    },
})

export const { 
    setFilterData, 
    setData, 
    setDefaultFilterData, 
    setEditCountryId 
} = countrySlice.actions;
export default countrySlice.reducer;