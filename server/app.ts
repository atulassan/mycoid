import express from 'express'
import { Application, Request, Response, NextFunction } from 'express'
import { RouteDefinition } from './interfaces/RouteDefinition';
import "reflect-metadata";
import cors from 'cors';
import helmet from 'helmet';
import { NoDataFoundException } from './exceptions';
import { errorMiddleware } from './middleware/index';
import { UserSchemas } from './dto'
import { MycoidChat } from "./entities";
import * as SocketIO from "socket.io";
import * as http from "http";


const path = require("path");

class App {
    public app: Application
    public port: number
    public io: SocketIO.Server
    public server: http.Server;

    constructor(appInit: { port: number; middleWares: any; controllers: any; }) {
        this.app = express()
        this.port = appInit.port
        this.middlewares(appInit.middleWares)
        this.routes(appInit.controllers)
        this.initializeErrorHandling();
        this.assets()
        this.template()
        this.initializeUiBuild();
        //this.sockets();
    }
    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        this.app.use(helmet());
        let origin = process.env.AllowCrossOrigin ? process.env.AllowCrossOrigin.split(',') : ['http://localhost:3000'];
        console.log('origin', origin);
        this.app.use(cors({
            origin: origin,
            credentials: true
        }));
        middleWares.forEach(middleWare => {
            this.app.use(middleWare)
        })

    }

    private routes(controllers: any) { //{ forEach: (arg0: (controller: any) => void) => void; }) {
        const apiV1 = '/api/v1';
        controllers.forEach(controller => {
            //this.app.use('/', controller.router)
            const instance = new controller();
            // The prefix saved to our controller
            let prefix = Reflect.getMetadata('prefix', controller);
            // Our `routes` array containing all our routes for this controller
            const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);
            // Iterate over all routes and register them to our express application 
            prefix = apiV1 + prefix
            routes.forEach(route => {
                let middleWares = Reflect.getMetadata(route.methodName, instance);
                // console.log('middleWares', instance.constructor.name)
                // It would be a good idea at this point to substitute the `app[route.requestMethod]` with a `switch/case` statement
                // since we can't be sure about the availability of methods on our `app` object. But for the sake of simplicity
                // this should be enough for now.

                if (middleWares && middleWares.routeMiddleware) {
                    this.app[route.requestMethod](prefix + route.path, middleWares.routeMiddleware, (req: express.Request, res: express.Response, next: express.NextFunction) => {
                        // Execute our method for this path and pass our express request and response object.
                        instance[route.methodName](req, res, next);
                    });
                }
                else {
                    this.app[route.requestMethod](prefix + route.path, (req: express.Request, res: express.Response, next: express.NextFunction) => {
                        // Execute our method for this path and pass our express request and response object.
                        instance[route.methodName](req, res, next);
                    });
                }


            })
        })

        this.app.use(apiV1 + "/uploads", function (req, res) {
            let uploadUrl = req.originalUrl.split('/api/v1/');
            res.sendFile(uploadUrl[1], { root: process.env.PWD });
        });
    }

    private assets() {
        this.app.use(express.static('public'))
        this.app.use(express.static('views'))
        this.app.use(express.static(path.resolve('build/ui')));
    }

    private template() {
        this.app.set('view engine', 'pug')
    }

    private initializeUiBuild() {
        this.app.get(
            '*',
            (request: Request, response: Response, next: NextFunction) => {
                response.sendFile(
                    path.resolve('build/ui/index.html'),
                );
            },
        );
    }
    public sockets(): void {
        //this.io = require("socket.io").connect(this.server, { origins: '*:*' });
    }
    public listen()  {
      return  this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`)
        });
        // this.io.on("connect", (socket: any) => {
        //     console.log("-------------------------data checking----------------------------");
        //     console.log("Connected client on port %s.", this.port);
        //     // socket.on("message", (m: MycoidChat) => {
        //     //   console.log("-------------------------data checking----------------------------");
        //     //   console.log("[server](message): %s", JSON.stringify(m));
        //     //   this.io.emit("message", m);
        //     // });

        //     socket.on("disconnect", () => {
        //         console.log("Client disconnected");
        //     });
        // });
    }
}

export default App