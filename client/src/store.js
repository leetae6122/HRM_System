import { configureStore } from '@reduxjs/toolkit'
import authReducer from 'reducers/auth';
import countryReducer from 'reducers/country';
import currencyReducer from 'reducers/currency';
import departmentReducer from 'reducers/department';
import employeeReducer from 'reducers/employee';
import officeReducer from 'reducers/office';
import positionReducer from 'reducers/position';
import salaryReducer from 'reducers/salary';
import userReducer from 'reducers/user';
import leaveReducer from 'reducers/leave';
import taskReducer from 'reducers/task';
import projectReducer from 'reducers/project';
import attendanceReducer from 'reducers/attendance';

const rootReducer = {
    auth: authReducer,
    currency: currencyReducer,
    user: userReducer,
    employee: employeeReducer,
    position: positionReducer,
    salary: salaryReducer,
    country: countryReducer,
    office: officeReducer,
    department: departmentReducer,
    leave: leaveReducer,
    task: taskReducer,
    project: projectReducer,
    attendance: attendanceReducer,
}

const store = configureStore({
    reducer: rootReducer,
});
export default store;