import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { NOT_FOUND_ERROR } from './response-messages';
import { Response } from 'express';
import { paramCase } from 'param-case';

/**
 * Exception filtering
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Catches and sanitizes exception responses
   * @param exception
   * @param host
   */
  catch(error: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = error.getStatus();
    if (status === HttpStatus.NOT_FOUND) {
      return response.status(status).json({
        message: NOT_FOUND_ERROR,
      });
    }
    if (status === HttpStatus.BAD_REQUEST) {
      if (
        error.message?.toString().startsWith('invalid-') ||
        error.message?.toString().startsWith('missing-') ||
        error.message?.toString().endsWith('-error')
      ) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
        });
      }
      const errorResponse = (<Record<string, unknown>>(<unknown>error))
        .response as unknown;
      if (
        errorResponse?.toString().startsWith('invalid-') ||
        errorResponse?.toString().startsWith('missing-') ||
        errorResponse?.toString().endsWith('-error')
      ) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: errorResponse,
        });
      }
      const messages = (errorResponse as Record<string, string[]>).message;
      const property = paramCase(messages[0].split(' ').shift());
      const errorMessage = `missing-${property}-error`;
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: errorMessage,
      });
    }
    return response.status(status).json({
      message: error.message,
    });
  }
}
