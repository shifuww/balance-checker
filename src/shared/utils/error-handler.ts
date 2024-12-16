import { HttpException, HttpStatus, Logger } from '@nestjs/common';

export function handleError(
  error: unknown,
  methodName: string,
  logger: Logger,
): never {
  if (error instanceof HttpException) {
    logger.error(`error: ${error.message}, method: ${methodName}`);
    throw error;
  } else if (error instanceof Error) {
    logger.error('Internal server error');
    throw new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal server error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  } else {
    logger.error('Internal server error');
    throw new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unknown error occurred',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
