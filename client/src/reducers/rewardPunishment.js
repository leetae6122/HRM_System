import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    defaultFilter: {
        page: 1,
        size: 10,
        where: {},
        order: [['date', 'DESC']],
        modelEmployee: {}
    },
    filterData: {
        page: 1,
        size: 10,
        where: {},
        order: [['date', 'DESC']],
        modelEmployee: {}
    },
    rewardPunishmentList: [],
    total: 0,
    currentPage: 1,
    editRewardPunishmentId: null,
}

export const rewardPunishmentSlice = createSlice({
    name: 'rewardPunishment',
    initialState,
    reducers: {
        setFilterData: (state, action) => {
            state.filterData = action.payload;
        },
        setDefaultFilterData: (state) => {
            state.filterData = state.defaultFilter;
        },
        setData: (state, action) => {
            state.rewardPunishmentList = action.payload.rewardPunishmentList;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
        },
        setEditRewardPunishmentId: (state, action) => {
            state.editRewardPunishmentId = action.payload;
        }
    },
})

export const {
    setFilterData,
    setData,
    setDefaultFilterData,
    setEditRewardPunishmentId
} = rewardPunishmentSlice.actions;
export default rewardPunishmentSlice.reducer;