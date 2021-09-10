import App from './app'
import { Global } from './global'
require('dotenv').config();
import * as bodyParser from 'body-parser'
import { errorMiddleware } from './middleware'
import {
  UserController, AuthenticationController, CompanyTypeController, BranchController, BranchuserController, CustomerController,
  MessageController, VisitorController, CustomerfamilyController, ChatController
} from './controllers'
import { getConnectionManager } from 'typeorm';
import { uuidv4 } from './util';
const connectionManager = getConnectionManager();
const connection = connectionManager.create(Global.dbConfig);
import {
  getOneToOneConversation,
  getUserFriendList,
  sendMessage,
  updateMessageSeenStatus,
} from './socket';
import * as jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';

const app = new App({
  port: parseInt(process.env.PORT),
  controllers: [
    AuthenticationController,
    UserController,
    CompanyTypeController,
    BranchController,
    BranchuserController,
    CustomerController,
    MessageController,
    VisitorController,
    CustomerfamilyController,
    ChatController

  ],
  middleWares: [
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
    bodyParser.raw(),
    errorMiddleware
  ]
})
connection
  .connect()
  .then(() => {
    const server = app.listen();
    //const io =new Server(server,{});
    const io = require('socket.io')(server, {
      cors: {
        // origin: "*:*",
        //methods: ["GET", "POST"],
        //allowedHeaders: ["my-custom-header"],
        //credentials: true
      }
    })
    //io.set('origins', '*:*');
    io.sockets
      .use((socket, next) => {
        if (socket.handshake.query && socket.handshake.query.token) {
          jwt.verify(
            socket.handshake.query.token,
            process.env.JWT_SECRET,
            function (err, decoded) {
              if (err) return next(new Error('Authentication error'));
              socket.decoded = decoded;
              next();
            },
          );
        } else {
          next(new Error('Authentication error'));
        }
      })
      .on('connection', (socket: Socket) => {
        getOneToOneConversation(io, socket);
        getUserFriendList(io, socket);
        //console.log('socketid',socket.id)
        //io.emit("SendMessage", "SADFADSFSADF");

        socket.on('disconnect', (user) => {
          console.log('Discnnected', user)
          console.log(' has left the chat.');
        });

        // socket.on("SendMessage", (m) => {
        //         console.log("-------------------------data checking----------------------------");
        //         console.log("[server](message): %s", JSON.stringify(m));
        //         io.emit("SendMessage", m);
        //       });
        sendMessage(io, socket);
        updateMessageSeenStatus(io, socket);
      });
    // io.of("/chat/").on("connection", (socket) => {
    //   console.log(socket.handshake.query.token); // abc (what?)
    // });
    //console.log('uuuid', uuidv4());
    //const server = app.listen();
    //const io = require('socket.io').listen(server);
    //let app = new ChatServer().getApp();
    //export { app };
    //app.sockets();

  })
  .catch(error => {
    console.log('connection failed..', error);
  });
