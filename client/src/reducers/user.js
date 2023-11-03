import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    defaultFilter: {
        page: 1,
        size: 10,
        where: {},
        order: [['isActive', 'DESC'], ['username', 'ASC']],
        modelEmployee: {}
    },
    filterData: {
        page: 1,
        size: 10,
        where: {},
        order: [['isActive', 'DESC'], ['username', 'ASC']],
        modelEmployee: {}
    },
    userList: [],
    total: 0,
    currentPage: 1,
    editUserId: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setFilterData: (state, action) => {
            state.filterData = action.payload;
        },
        setDefaultFilterData: (state) => {
            state.filterData = state.defaultFilter;
        },
        setData: (state, action) => {
            state.userList = action.payload.userList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
        setEditUserId: (state, action) => {
            state.editUserId = action.payload;
        }
    },
})

export const {
    setFilterData,
    setData,
    setDefaultFilterData,
    setEditUserId
} = userSlice.actions;
export default userSlice.reducer;