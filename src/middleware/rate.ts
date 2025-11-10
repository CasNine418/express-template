import { serverConfig } from "../../config";
import { Request, Response } from "express";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { ResponseMsg } from "../model/response";
import { Log } from "../model/log";

const log = Log.create('rate-limiter');

const rateLimiter = rateLimit({
    legacyHeaders: true,
    standardHeaders: true,
    message: (req: Request, res: Response) => {
        log.warn(`Rate limit exceeded for IP: ${req.ip}`);
        return ResponseMsg.error(res, 429, 'Too many requests', null).send();
    },
    limit: serverConfig.server.rate.limit,
    windowMs: serverConfig.server.rate.window_ms * 60 * 15,
    keyGenerator: (req: Request) => {
        const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || '';
        return ipKeyGenerator(ip);
    }
})

export default rateLimiter;