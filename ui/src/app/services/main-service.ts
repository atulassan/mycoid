import axios from 'axios';
import { authHeaderNew } from '../services/auth-header';

//const API_URL = "http://localhost:5000/api/v1";
const API_URL = process.env.API_URL;

export const getData = async ( url: any ): Promise<string | void> => {
    try {
      const result:any = await axios({
        method: 'GET', 
        url: `${API_URL}${url}`,
        validateStatus: function(status) {
          return status < 600;
        }, 
        headers: { "Access-Control-Allow-Origin": "*", ...authHeaderNew() },
      });
      //let response = result;
      return result;
    } catch (error) {
        console.error('Error:', error);
    }
};

export const postData = async ( url: any, data: any): Promise<string | void> => {
  try {
    const result:any = await axios({
      method: "POST", 
      url: `${API_URL}${url}`,
      validateStatus: function(status) {
        return status < 600;
      },
      data: data, // data can be `string` or {object}! 
      headers: { 'Content-Type': 'application/json', ...authHeaderNew() },
    });
    return result;
  } catch (error) {
      console.error('Error:', error);
  }
};


export const imageData = async ( url: any, data: any): Promise<string | void> => {
  try {
    const result:any = await axios({
      method: "POST", 
      url: `${API_URL}${url}`,
      validateStatus: function(status) {
        return status < 600;
      },
      data: data, // data can be `string` or {object}! 
      headers: { 'Content-Type': 'multipart/form-data', ...authHeaderNew() },
    });
    return result;
  } catch (error) {
      console.error('Error:', error);
  }
};

export const getCountryCode = async ( url: any ): Promise<string | void> => {
  try {
    const result:any = await axios({
      method: 'GET', 
      url: url,
      validateStatus: function(status) {
        return status < 600;
      }, 
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Max-Age":"1800"},
    });
    //let response = result;
    return result;
  } catch (error) {
      console.error('Error:', error);
  }
};

/*AuthService.signup(data).then(
  (response: any) => {
    console.log('res', response)
    return Promise.resolve();
  },
  (error: any) => {
    const message =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString();
      setErrMsg(message);
    console.log('msg', message);

    return Promise.reject();
  }
);*/

