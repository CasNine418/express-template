import { Logger, ILogObj } from "tslog";
import { createStream } from "rotating-file-stream";
import path from "path";

import { serverConfig } from "../../config";
import { FilenameGenerator } from "../utils/filename_generator";

const stream = createStream(FilenameGenerator.new('main').generate, {
    size: "10M",
    interval: "1d",
    compress: "gzip",
    path: path.join(__dirname, "../../logs")
});

const globalTransport = (logObj: ILogObj) => {
    stream.write(JSON.stringify(logObj) + "\n");
};

const silentTransport = (logObj: ILogObj) => {
    stream.write(JSON.stringify(logObj) + "\n");
}

class Log extends Logger<ILogObj> {
    private isSilent: boolean = false;
    private currentTransport: ((logObj: ILogObj) => void) | null = null;
    private customTransport: ((logObj: ILogObj) => void) | null = null;

    constructor(name: string, customTransports?: (logObj: ILogObj) => void, silent?: boolean) {
        super({
            name,
            type: serverConfig.server.log.type,
            prettyLogTimeZone: serverConfig.server.log.pretty_log_time_zone,
            hideLogPositionForProduction: serverConfig.server.log.hide_log_position
        });

        this.customTransport = customTransports || null;
        this.isSilent = silent || false;

        this.setupTransport();
    }

    public static create(name: string): Log {
        return new Log(name);
    }

    private setupTransport(): void {
        this.detachAllTransports();
        
        if (this.customTransport) {
            this.currentTransport = this.customTransport;
            this.attachTransport(this.currentTransport);
            
            if (this.isSilent) {
                this.settings.type = 'hidden';
            }
        } else {
            this.currentTransport = globalTransport;
            this.attachTransport(this.currentTransport);
            this.isSilent = false;
            this.settings.type = serverConfig.server.log.type;
        }
    }

    public enableGlobalTransport(): Log {
        this.customTransport = null;
        this.isSilent = false;
        this.setupTransport();
        return this;
    }

    public enableCustomTransport(customTransport: (logObj: ILogObj) => void, silent: boolean = false): Log {
        this.customTransport = customTransport;
        this.isSilent = silent;
        this.setupTransport();
        return this;
    }

    public setSilent(silent: boolean): Log {
        if (this.customTransport) {
            this.isSilent = silent;
            this.setupTransport();
        } else {
            this.warn('Silent mode is only valid for custom transports. Please use enableCustomTransport() to use a custom transport.');
        }
        return this;
    }

    public logRequest<T = unknown>(statusCode: number, message: T, ...args: unknown[]): void {
        if (statusCode >= 200 && statusCode < 400) {
            this.info(message, ...args);
        } else if (statusCode >= 400 && statusCode < 500) {
            this.warn(message, ...args);
        } else if (statusCode >= 500) {
            this.error(message, ...args);
        } else {
            this.info(message, ...args);
        }
    }

    public logByCondition(condition: () => string, message: string, ...args: unknown[]): void {
        const level = condition();
        switch (level.toLowerCase()) {
            case 'error':
                this.error(message, ...args);
                break;
            case 'warn':
                this.warn(message, ...args);
                break;
            case 'info':
                this.info(message, ...args);
                break;
            case 'debug':
                this.debug(message, ...args);
                break;
            default:
                this.info(message, ...args);
        }
    }

    public setCurrentLogLevel(logLevel: string): Log {
        const levels: Record<string, number> = {
            'silly': 0,
            'trace': 1,
            'debug': 2,
            'info': 3,
            'warn': 4,
            'error': 5,
            'fatal': 6
        };
        
        const level = levels[logLevel.toLowerCase()];
        if (level !== undefined) {
            this.settings.minLevel = level;
        }
        return this;
    }

    public enableSilent(): Log {
        return this.setSilent(true);
    }

    public disableSilent(): Log {
        return this.setSilent(false);
    }

    public isUsingCustomTransport(): boolean {
        return this.customTransport !== null;
    }

    public isSilentMode(): boolean {
        return this.isSilent;
    }

    public getTransportType(): string {
        if (this.customTransport) {
            return this.isSilent ? "custom-silent" : "custom";
        }
        return "global";
    }

    private detachAllTransports(): void {
        this.settings.attachedTransports = [];
    }

    public getChildLogger(childName: string): Log {
        const childLog = new Log(`${this.settings.name}:${childName}`);
        
        if (this.customTransport) {
            childLog.enableCustomTransport(this.customTransport, this.isSilent);
        } else {
            childLog.enableGlobalTransport();
        }
        
        return childLog;
    }
}

export { Log };