import { configureStore } from '@reduxjs/toolkit'
import authReducer from 'reducers/auth';
import departmentReducer from 'reducers/department';
import employeeReducer from 'reducers/employee';
import positionReducer from 'reducers/position';
import wageReducer from 'reducers/wage';
import userReducer from 'reducers/user';
import leaveReducer from 'reducers/leave';
import shiftReducer from 'reducers/shift';
import attendanceReducer from 'reducers/attendance';
import allowanceReducer from 'reducers/allowance';
import rewardPunishmentReducer from 'reducers/rewardPunishment';

const rootReducer = {
    auth: authReducer,
    user: userReducer,
    employee: employeeReducer,
    position: positionReducer,
    wage: wageReducer,
    department: departmentReducer,
    leave: leaveReducer,
    shift: shiftReducer,
    attendance: attendanceReducer,
    allowance: allowanceReducer,
    rewardPunishment: rewardPunishmentReducer,
}

const store = configureStore({
    reducer: rootReducer,
});
export default store;