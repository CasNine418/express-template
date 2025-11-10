import { Request, Response, NextFunction } from "express";
import { Log } from "../model/log";
import { randomUUID } from "node:crypto";
import { createStream } from "rotating-file-stream";
import path from "node:path";
import { ILogObj } from "tslog";
import { FilenameGenerator } from "../utils/filename_generator";


const stream = createStream(FilenameGenerator.new("request").generate, {
    size: "10M", // rotate every 10 MegaBytes written
    interval: "1d", // rotate daily
    compress: "gzip", // compress rotated files
    path: path.join(__dirname, "../../logs/requests")
});

const reqTransport = (logObj: ILogObj) => {
    stream.write(JSON.stringify(logObj) + "\n");
};

const log = Log.create('request_log').enableCustomTransport(reqTransport).enableSilent();

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const existingId = req.headers["x-request-id"] as string;
    const requestId = existingId || randomUUID();
    req.headers["x-request-id"] = requestId;
    res.setHeader("X-Request-Id", requestId);

    const startTime = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;

        log.logRequest(res.statusCode, {
            requestId,
            method: req.method,
            url: req.originalUrl,
            statusCode,
            duration: `${duration}ms`,
            userAgent: req.get('User-Agent'),
            ip: req.ip || req.connection.remoteAddress
        });
    });

    next();
};

export default requestLogger;