import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { doneSlice } from "../Slice/done";
import { inProgressSlice } from "../Slice/inProgress";
import { todoSlice } from "../Slice/todo";

export const store = configureStore({
  reducer: combineReducers({
    done: doneSlice.reducer,
    inProgress: inProgressSlice.reducer,
    todo: todoSlice.reducer,
  }),
});

export type StoreDispatch = typeof store.dispatch;
export type StoreState = ReturnType<typeof store.getState>;