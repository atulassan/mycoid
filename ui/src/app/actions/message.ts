import { SET_MESSAGE, CLEAR_MESSAGE } from "./types";

export const setMessage = (message:any,variant:any) => ({
  type: SET_MESSAGE,
  payload: {message,variant},
});

export const clearMessage = () => ({
  type: CLEAR_MESSAGE,
});