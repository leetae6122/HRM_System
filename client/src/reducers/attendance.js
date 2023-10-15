import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    defaultFilter: {
        page: 1,
        size: 10,
        where: {},
        order: [['attendanceDate', 'DESC']]
    },
    filterData: {
        page: 1,
        size: 10,
        where: {},
        order: [['attendanceDate', 'DESC']]
    },
    attendanceList: [],
    total: 0,
    currentPage: 1,
    editAttendanceId: null,
}

export const attendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {
        setFilterData: (state, action) => {
            state.filterData = action.payload;
        },
        setDefaultFilterData: (state) => {
            state.filterData = state.defaultFilter;
        },
        setData: (state, action) => {
            state.attendanceList = action.payload.attendanceList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
        setEditAttendanceId: (state, action) => {
            state.editAttendanceId = action.payload;
        }
    },
})

export const { 
    setFilterData, 
    setData, 
    setDefaultFilterData, 
    setEditAttendanceId 
} = attendanceSlice.actions;
export default attendanceSlice.reducer;