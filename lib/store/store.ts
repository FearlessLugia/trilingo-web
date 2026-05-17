import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import paneStackReducer from './features/paneStackSlice';
import historyReducer from './features/historySlice';
import savedReducer from './features/savedSlice';
import searchReducer from './features/searchSlice';

const rootReducer = combineReducers({
  paneStack: paneStackReducer,
  history: historyReducer,
  saved: savedReducer,
  search: searchReducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['history', 'saved'], // We might not want to persist the pane stack across refreshes, or maybe we do?
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
