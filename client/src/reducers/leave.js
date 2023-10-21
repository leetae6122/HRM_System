import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc)
const now = dayjs();
const startDate = dayjs(now).startOf('month').utc().format();

const initialState = {
    defaultFilter: {
        page: 1,
        size: 10,
        where: {
            leaveFrom: { $gte: startDate },
        },
        order: []
    },
    filterData: {
        page: 1,
        size: 10,
        where: {
            leaveFrom: { $gte: startDate },
        },
        order: []
    },
    leaveList: [],
    total: 0,
    currentPage: 1,
    editLeaveId: null,
}

export const leaveSlice = createSlice({
    name: 'leave',
    initialState,
    reducers: {
        setFilterData: (state, action) => {
            state.filterData = action.payload;
        },
        setDefaultFilterData: (state) => {
            state.filterData = state.defaultFilter;
        },
        setData: (state, action) => {
            state.leaveList = action.payload.leaveList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
        setEditLeaveId: (state, action) => {
            state.editLeaveId = action.payload;
        }
    },
})

export const {
    setFilterData,
    setData,
    setDefaultFilterData,
    setEditLeaveId
} = leaveSlice.actions;
export default leaveSlice.reducer;