import { combineReducers } from 'redux';
import { RootState } from './state';
import { todoReducer } from './todos';

export { RootState };
export * from './current';
import auth from "./auth";
import message from "./message";
import socketReducer from"./socket.reducer"
import chatReducer from"./chat.reducer"
export const rootReducer = combineReducers({  //<RootState>
  todos: todoReducer,auth,
  messages:message,
  socketReducer,
  chatReducer
});
