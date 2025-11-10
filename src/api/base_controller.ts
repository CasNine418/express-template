import express from 'express';

export abstract class BaseController {
    protected router: express.Router = express.Router();
    private path: string;

    constructor(path: string) {
        this.path = path;
        process.nextTick(() => {
            this.initRoutes();
        });
    }

    protected abstract initRoutes(): void;

    public getRouter(): express.Router {
        return this.router;
    }

    public getPath(): string {
        return this.path;
    }
}