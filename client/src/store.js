import { configureStore } from '@reduxjs/toolkit'
import authReducer from 'reducers/auth';
import departmentReducer from 'reducers/department';
import employeeReducer from 'reducers/employee';
import positionReducer from 'reducers/position';
import salaryReducer from 'reducers/salary';
import userReducer from 'reducers/user';
import leaveReducer from 'reducers/leave';
import shiftReducer from 'reducers/shift';
import attendanceReducer from 'reducers/attendance';
import payrollReducer from 'reducers/payroll';
import allowanceReducer from 'reducers/allowance';
import rewardPunishmentReducer from 'reducers/rewardPunishment';

const rootReducer = {
    auth: authReducer,
    user: userReducer,
    employee: employeeReducer,
    position: positionReducer,
    salary: salaryReducer,
    department: departmentReducer,
    leave: leaveReducer,
    shift: shiftReducer,
    attendance: attendanceReducer,
    payroll: payrollReducer,
    allowance: allowanceReducer,
    rewardPunishment: rewardPunishmentReducer,
}

const store = configureStore({
    reducer: rootReducer,
});
export default store;