import {
    CONNECT, CONNECT_SUCCESS, CONNECT_FAIL,
    DISCONNECT, DISCONNECT_SUCCESS, DISCONNECT_FAIL
 } from '../actions/types';
 const initialState = {isConnecting:false};
export default function socketReducer(state=initialState, action:any) {
  switch (action.type) {
    case CONNECT:
      return {
        ...state,
        isConnecting: true,
      };
    case CONNECT_SUCCESS:
      return {
        ...state,
        isConnecting: false,
        connectError: null,
      };
    case CONNECT_FAIL:
      return {
        ...state,
        isConnecting: false,
        connectError: action.error,
      };
    case DISCONNECT:
      return {
        ...state,
        isDisconnecting: true,
      };
    case DISCONNECT_SUCCESS:
      return {
        ...state,
        isDisconnecting: true,
        disconnectError: null,
      };
    case DISCONNECT_FAIL:
      return {
        ...state,
        isDisconnecting: false,
        disconnectError: action.error,
      };
    default:
      return state;
  }
}

