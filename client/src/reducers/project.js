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
    projectList: [],
    total: 0,
    currentPage: 1,
    editProjectId: null,
}

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        setFilterData: (state, action) => {
            state.filterData = action.payload;
        },
        setDefaultFilterData: (state) => {
            state.filterData = state.defaultFilter;
        },
        setData: (state, action) => {
            state.projectList = action.payload.projectList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
        setEditProjectId: (state, action) => {
            state.editProjectId = action.payload;
        }
    },
})

export const { 
    setFilterData, 
    setData, 
    setDefaultFilterData, 
    setEditProjectId 
} = projectSlice.actions;
export default projectSlice.reducer;