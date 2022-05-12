import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import appReducer from "./slices/app.slice";
import restaurantReducer from "./slices/restaurant.slice";
import settingsReducer from "./slices/settings.slice";

const settingsPersistConfig = {
  key: "settings",
  storage,
};

const reducers = combineReducers({
  app: appReducer,
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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
