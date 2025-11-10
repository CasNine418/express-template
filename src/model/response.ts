import { Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * 通用响应消息构建器类
 * 
 * 提供统一的 HTTP 响应格式，支持链式调用设置状态码、消息、数据及元信息。
 * 
 * @template T 响应数据的类型
 */
class ResponseMsg<T = unknown> {
    private res: Response | null = null;

    private status: number = 200;
    private message: string = '';
    private data: T | null = null;
    private meta: Record<string, unknown> = {};

    constructor() { }

    /**
     * 静态工厂方法，创建并绑定 Express Response 对象的新实例
     * 
     * @template T 响应数据类型
     * @param res Response 对象
     * @returns 新创建的 ResponseMsg 实例
     */
    public static new<T>(res: Response): ResponseMsg<T> {
        const r = new ResponseMsg<T>();
        r.res = res;
        return r;
    }

    /**
     * 快速构建成功响应
     * 
     * @template T 数据类型
     * @template M 元信息类型
     * @param res Response 对象
     * @param data 响应数据
     * @param message 响应消息，默认为 'OK'
     * @param meta 可选元信息
     * @returns 已配置好的 ResponseMsg 实例
     */
    public static success<T, M = Record<string, unknown>>(res: Response, message = 'OK', data: T, meta?: M): ResponseMsg<T> {
        return ResponseMsg.new<T>(res)
            .ok()
            .setMessage(message)
            .setData(data)
            .setMeta(meta ? meta : undefined);
    }

    /**
     * 快速构建错误响应
     * 
     * @template T 数据类型
     * @template M 元信息类型
     * @param res Express 的 Response 对象
     * @param status HTTP 状态码
     * @param message 错误消息
     * @param data 响应数据
     * @param meta 可选元信息
     * @returns 已配置好的 ResponseMsg 实例
     */
    public static error<T, M = Record<string, unknown>>(res: Response, status: StatusCodes, message: string, data: T, meta?: M): ResponseMsg<T> {
        return ResponseMsg.new<T>(res)
            .setStatus(status)
            .setMessage(message)
            .setData(data)
            .setMeta(meta ? meta : undefined);
    }

    /**
     * 设置 HTTP 状态码（使用 StatusCodes 枚举）
     * 
     * @param status HTTP 状态码
     * @returns 当前实例以支持链式调用
     */
    public setStatus(status: StatusCodes): ResponseMsg<T> {
        this.status = status;
        return this;
    }

    /**
     * 设置数字形式的 HTTP 状态码
     * 
     * @param status 数字状态码
     * @returns 当前实例以支持链式调用
     */
    public setStatusNum(status: number): ResponseMsg<T> {
        this.status = status;
        return this;
    }

    /**
     * 设置状态码为 200 OK
     * 
     * @returns 当前实例以支持链式调用
     */
    public ok(): ResponseMsg<T> { 
        this.status = StatusCodes.OK;
        return this;
    }

    /**
     * 设置状态码为 404 NOT_FOUND
     * 
     * @returns 当前实例以支持链式调用
     */
    public notFound(): ResponseMsg<T> {
        this.status = StatusCodes.NOT_FOUND;
        return this;
    }

    /**
     * 设置状态码为 500 INTERNAL_SERVER_ERROR
     * 
     * @returns 当前实例以支持链式调用
     */
    public internalServerError(): ResponseMsg<T> {
        this.status = StatusCodes.INTERNAL_SERVER_ERROR;
        return this;
    }

    /**
     * 设置状态码为 400 BAD_REQUEST
     * 
     * @returns 当前实例以支持链式调用
     */
    public badRequest(): ResponseMsg<T> { 
        this.status = StatusCodes.BAD_REQUEST;
        return this;
    }

    /**
     * 设置响应消息
     * 
     * @param message 响应消息文本
     * @returns 当前实例以支持链式调用
     */
    public setMessage(message: string): ResponseMsg<T> {
        this.message = message;
        return this;
    }

    /**
     * 设置响应数据
     * 
     * @param data 响应数据对象
     * @returns 当前实例以支持链式调用
     */
    public setData(data: T): ResponseMsg<T> {
        this.data = data;
        return this;
    }

    /**
     * 设置响应元信息，并自动添加时间戳
     * 
     * @param meta 可选的元信息对象
     * @returns 当前实例以支持链式调用
     */
    public setMeta(meta?: Record<string, unknown>): ResponseMsg<T> {
        this.meta = {
            time: new Date().toISOString(),
            ...(meta || {})
        };
        return this;
    }

    /**
     * 一次性设置消息、数据和元信息
     * 
     * @param message 响应消息
     * @param data 响应数据
     * @param meta 可选元信息
     * @returns 当前实例以支持链式调用
     */
    public set(message: string, data: T, meta?: Record<string, unknown>): ResponseMsg<T> {
        this.message = message;
        this.data = data;
        this.meta = {
            time: new Date().toISOString(),
            ...(meta || {})
        };
        return this;
    }

    /**
     * 发送最终构建完成的 JSON 响应
     * 
     * @throws {Error} 如果未绑定 Response 对象则抛出异常
     */
    public send(): void {
        if (!this.res) {
            throw new Error("Response object not bound. Use bind(res: Response) before sending.");
        }

        this.res.status(this.status).json({
            status: this.status,
            message: this.message,
            data: this.data,
            meta: this.meta
        });
    }
}

export { ResponseMsg };