import { configureStore } from '@reduxjs/toolkit'
import authReducer from 'reducers/auth';
import currencyReducer from 'reducers/currency';
import employeeReducer from 'reducers/employee';
import positionReducer from 'reducers/position';
import userReducer from 'reducers/user';

const rootReducer = {
    auth: authReducer,
    currency: currencyReducer,
    user: userReducer,
    employee: employeeReducer,
    position: positionReducer,
}

const store = configureStore({
    reducer: rootReducer,
});
export default store;