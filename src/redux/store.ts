import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from "redux-persist";
import rootReducer from './rootReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiSlice from './features/apis/apiSlice';
import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from './features/rtkApi';

const persistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = configureStore({
//     devTools: __DEV__,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: false,
//         }).concat(api.middleware),
// });
const store = configureStore({
    devTools: __DEV__,
    middleware: getDefaultMiddleware({
        serializableCheck: false,
    }).concat(api.middleware),
    reducer: persistedReducer,
})
export const persistor = persistStore(store);
setupListeners(store.dispatch)
export default store