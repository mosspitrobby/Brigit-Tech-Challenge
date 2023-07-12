import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';

/**
 * Middleware for requests that logs them ocurring
 */
@Injectable()
export class RequestLogMiddleware implements NestMiddleware {
  /**
   * Logs request information as they occur
   * @param req HTTP request
   * @param res HTTP response
   * @param next
   * @returns
   */
  async use(req, _: Response, next: () => void): Promise<void | Response> {
    if (process.env.LOGGER_DISABLED) {
      return next();
    }
    if (
      req.originalUrl === '/' &&
      req.method !== 'POST' &&
      req.method !== 'post'
    ) {
      return next();
    }
    // eslint-disable-next-line no-console
    console.log(`${req.method} ${req.originalUrl}`);
    return next();
  }
}
