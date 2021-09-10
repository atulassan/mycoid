import {
    SEND,
    SEND_SUCCESS,
    SEND_FAIL,
    RECEIVE_CHAT,
    RECEIVE_USER_LIST
} from "./types";
// import { Dispatch } from "react";
import { Dispatch } from 'redux';

export function send(enventName: any, message: any) {
    //const message = { chatId, content };
    return {
        type: 'socket',
        types: [SEND, SEND_SUCCESS, SEND_FAIL],
        promise: (socket: any) => socket.emit(enventName, message),
    }
}

export function receive(enventName:any) {
    return (dispatch: Dispatch) => {
        const chatUpdate = (chat: any) => {
            return dispatch({
                type: enventName.indexOf('userAndCustomerList')>-1?RECEIVE_USER_LIST:RECEIVE_CHAT,
                payload: chat,
            });
        };
        return dispatch({
            type: 'socket',
            types: [null, null, null],
            promise: (socket: any) => socket.on(enventName, chatUpdate),
        });
    }
}


