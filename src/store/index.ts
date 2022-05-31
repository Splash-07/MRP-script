import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import appReducer from "./slices/app.slice";
import restaurantReducer from "./slices/restaurant.slice";
import settingsReducer from "./slices/settings.slice";
import configReducer from "./slices/config.slice";

const settingsPersistConfig = {
  key: "settings",
  storage,
};

const reducers = combineReducers({
  app: appReducer,
  config: configReducer,
  restaurant: restaurantReducer,
  settings: persistReducer(settingsPersistConfig, settingsReducer),
});

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const presistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
