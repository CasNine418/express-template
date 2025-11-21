import express, { NextFunction, Request, Response } from 'express';
import { ResponseMsg } from './src/model/response';
import cors from 'cors';
import helmet from 'helmet';
import rateLimiter from './src/middleware/rate';
import { serverConfig } from './config';
import requestLogger from './src/middleware/req_log';
import { Log } from './src/model/log';
import http from 'http';
import https from 'https';
import fs from 'fs';
import catchJson from './src/middleware/catch_json';
import catchNotFound from './src/middleware/catch_not_found';
import { BaseController } from './src/api/base_controller';
import { UserController } from './src/api/user/user_controller';
import { initializeDataSource } from './src/model/orm/database';

const log = new Log('app');

class AppServer {
    private port: number = 3000;
    private app = express();
    private controllers: BaseController[] = [];

    constructor() { }

    private onListening(server: http.Server | https.Server) {
        const addr = server.address();
        const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr?.port;
        log.info('Listening on ' + bind + ' in ' + serverConfig.server.base.mode + ' mode');
    }

    private onError(error: any) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof this.port === 'string'
            ? 'Pipe ' + this.port
            : 'Port ' + this.port;

        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors({ origin: serverConfig.server.base.cors_origin, credentials: true }));

        if (serverConfig.options.middlewares.helmet) {
            this.enableHelmet();
        }
        if (serverConfig.options.middlewares.rate_limiter) {
            this.enableRateLimiter();
        }
        if (serverConfig.options.middlewares.request_logger) {
            this.enableRequestLogger();
        }
    }

    private initializeControllers(): void {
        this.controllers = [
            new UserController(),
        ];

        this.controllers.forEach(controller => {
            this.app.use(controller.getPath(), controller.getRouter());
            log.info(`Routes registered for ${controller.getPath()}`);
        });
    }

    private initializeDatabase() {
        initializeDataSource();
    }

    private initializeErrorHandling(): void {
        this.app.use(catchJson);
        this.app.use(catchNotFound);
    }

    public static new() {
        return new AppServer().init();
    }

    public init() {
        this.initializeDatabase();
        this.initializeMiddlewares();
        this.initializeControllers();
        this.initializeErrorHandling();
        return this;
    }

    public enableHelmet(): AppServer {
        this.app.use(helmet());
        log.info('Helmet enabled');
        return this;
    }

    public enableRateLimiter(): AppServer {
        this.app.use(rateLimiter);
        log.info('Rate limiter enabled');
        return this;
    }

    public enableRequestLogger(): AppServer {
        this.app.use(requestLogger);
        log.info('Request logger enabled');
        return this;
    }

    public listen(port: number) {
        this.port = port;
        if (serverConfig.server.base.mode === 'http') {
            const server = http.createServer(this.app);
            server.listen(port);
            server.on('error', this.onError);
            server.on('listening', () => this.onListening(server));
        } else if (serverConfig.server.base.mode === 'https') {
            const httpsOpt = {
                key: fs.readFileSync(serverConfig.server.ssl.key),
                cert: fs.readFileSync(serverConfig.server.ssl.cert)
            }
            const server = https.createServer(httpsOpt, this.app);
            server.listen(port);
            server.on('error', this.onError);
            server.on('listening', () => this.onListening(server));
        } else {
            log.error('Invalid server mode');
            process.exit(1);
        }

        return this;
    }
}

const app = AppServer.new().listen(serverConfig.server.base.port);

process.on('SIGINT', async () => {
    log.info("Server closed");
    process.exit(0);
});