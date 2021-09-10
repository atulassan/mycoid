import io from 'socket.io-client';
import {authToken} from './auth-header'
// Example conf. You can move this to your config file.
const host = process.env.SOCKET_HOST?process.env.SOCKET_HOST:'http://localhost:5000';
const socketPath = '/socket.io';

export default class SocketClient {
  socket:any;

  connect() {
    this.socket = io.connect(host, { path: socketPath , query: { token:authToken() },});
    return new Promise((resolve, reject) => {
      this.socket.on('connected', () => resolve());
      this.socket.on('connect_error', (error:any) => reject(error));
    });
  }

  disconnect() {
    return new Promise((resolve) => {
      this.socket.disconnect(() => {
        this.socket = null;
        resolve();
      });
    });
  }

  emit(event:any, data:any) {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject('No socket connection.');
      return this.socket.emit(event, data, (response:any) => {
        // Response is the optional callback that you can use with socket.io in every request. See 1 above.
        if (response.error) {
          return reject(response.error);
        }
        return resolve();
    });
  });
}

on(event:any, fun:any) {
  // No promise is needed here, but we're expecting one in the middleware.
  return new Promise((resolve, reject) => {
    if (!this.socket) return reject('No socket connection.');
    this.socket.on(event, fun);
    resolve();
  });
}
}