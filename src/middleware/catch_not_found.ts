import express, { NextFunction, Request, Response } from 'express';
import { ResponseMsg } from '../model/response';

const catchNotFound = (req: Request, res: Response, next: NextFunction) => {
    ResponseMsg.error(res, 404, 'Resource Not Found', null).send();

    next();
}

export default catchNotFound;