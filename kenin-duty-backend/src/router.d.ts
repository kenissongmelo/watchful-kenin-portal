import express from 'express';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
export interface RouterOptions {
    logger: LoggerService;
    config: Config;
}
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
