import express, { NextFunction, Request, Response } from 'express';
import { serverConfig } from '../../config';
import { ResponseMsg } from '../model/response';
import { Log } from '../model/log';

const log = Log.create('catch_json_middleware');

const catchJson = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = serverConfig.server.base.env === 'development' ? err : {};

    if (err instanceof SyntaxError && 'body' in err) {
        ResponseMsg.error(res, 400, "Invalid JSON", {}).send();
        log.error(err.message);
        log.debug(err);
    }

    next();
}

export default catchJson;