import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    filterData: {
        page: 1,
        size: 10,
        where: {},
    },
    currencyList: null,
    total: 0,
    currentPage: 1,
    editIdCurrency: null,
}

export const currencySlice = createSlice({
    name: 'currency',
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
            state.currencyList = action.payload.currencyList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
        setEditIdCurrency: (state, action) => {
            state.editIdCurrency = action.payload;
        }
    },
})

export const { 
    setFilterData, 
    setData, 
    setDefaultFilterData, 
    setEditIdCurrency 
} = currencySlice.actions;
export default currencySlice.reducer;