import {
    SEND,
    RECEIVE_CHAT,
    RECEIVE_USER_LIST
  } from "../actions/types";
  const initialState = {message:'',chatUserList:{}};
export default function(state = initialState, action:any) {
    const {type,payload}=action;
    switch(type) {
      case SEND: {
        return {
          ...state,
          isSending: true,
        };
      }
      case RECEIVE_CHAT:{
        return {
            ...state,
            chat: payload,
          };
      }
      case RECEIVE_USER_LIST:{
        return {
            ...state,
            chatUserList: payload,
          };
      }
      default: {
        return state;
      }
    }
  }