import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_MESSAGE,
    MYPROFILE,
  } from "./types";
  import { Dispatch } from 'redux';//, bindActionCreators
  //import { createAction } from 'redux-actions';

  import AuthService from "../services/auth.service";
  
  export const register = (customerData:any) => (dispatch:Dispatch) => {
    return AuthService.register(customerData).then(
      (response) => {
        dispatch({
          type: REGISTER_SUCCESS,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: response.data.message,
        });
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: REGISTER_FAIL,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
  
        return Promise.reject();
      }
    );
  };
  
  export const login = (username:any, password:any,userType:any) => (dispatch:Dispatch) => {
    console.log('username',username)
    return AuthService.login(username, password,userType).then(
      (data) => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: { user: data.response},
        });
        dispatch({
          type: SET_MESSAGE,
          payload: {message:'Erfolgreich angemeldet',variant:'success'},
        });
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: LOGIN_FAIL,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: {message,variant:'danger'},
        });
  
        return Promise.reject();
      }
    );
  };
  
  export const logout = () => (dispatch:Dispatch) => {
    AuthService.logout();
  
    dispatch({
      type: LOGOUT,
    });
  };

  export const myprofile = () => (dispatch:Dispatch) => {
    AuthService.myprofile();
    dispatch({
      type: MYPROFILE,
    })
  }