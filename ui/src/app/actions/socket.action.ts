import {
    CONNECT, CONNECT_SUCCESS, CONNECT_FAIL,
    DISCONNECT, DISCONNECT_SUCCESS, DISCONNECT_FAIL
 } from './types';
export function connectSocket() {
    return {
      type: 'socket',
      types: [CONNECT, CONNECT_SUCCESS, CONNECT_FAIL],
      promise: (socket:any) => socket.connect(),
    };
  }
  
  export function disconnectSocket() {
    return {
      type: 'socket',
      types: [DISCONNECT, DISCONNECT_SUCCESS, DISCONNECT_FAIL],
      promise:  (socket:any) => socket.disconnect(),
    }
  }