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
    taskList: [],
    total: 0,
    currentPage: 1,
    editTaskId: null,
}

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setFilterData: (state, action) => {
            state.filterData = action.payload;
        },
        setDefaultFilterData: (state) => {
            state.filterData = state.defaultFilter;
        },
        setData: (state, action) => {
            state.taskList = action.payload.taskList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
        setEditTaskId: (state, action) => {
            state.editTaskId = action.payload;
        }
    },
})

export const { 
    setFilterData, 
    setData, 
    setDefaultFilterData, 
    setEditTaskId 
} = taskSlice.actions;
export default taskSlice.reducer;