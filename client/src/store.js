import { configureStore } from '@reduxjs/toolkit'
import authReducer from 'reducers/auth';
import currencyReducer from 'reducers/currency';
import userReducer from 'reducers/user';

const rootReducer = {
    auth: authReducer,
    currency: currencyReducer,
    user: userReducer
}

const store = configureStore({
    reducer: rootReducer,
});
export default store;