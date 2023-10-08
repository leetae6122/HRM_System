import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    defaultFilter: {
        page: 1,
        size: 10,
        where: {},
        order: [['id', 'ASC']]
    },
    filterData: {
        page: 1,
        size: 10,
        where: {},
        order: [['id', 'ASC']]
    },
    currencyList: [],
    total: 0,
    currentPage: 1,
    editCurrencyId: null,
}

export const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setFilterData: (state, action) => {
            state.filterData = action.payload;
        },
        setDefaultFilterData: (state) => {
            state.filterData = state.defaultFilter;
        },
        setData: (state, action) => {
            state.currencyList = action.payload.currencyList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
        setEditCurrencyId: (state, action) => {
            state.editCurrencyId = action.payload;
        }
    },
})

export const { 
    setFilterData, 
    setData, 
    setDefaultFilterData, 
    setEditCurrencyId 
} = currencySlice.actions;
export default currencySlice.reducer;