import { ApiProperty } from '@nestjs/swagger';
import { INTERNAL_SERVER_ERROR, SUCCESS } from './response-messages';
import { IsEnum } from 'class-validator';

export class InternalServerErrorResponseDto {
  /**
   * The internal-error code
   */
  @ApiProperty({
    description: 'The error code',
    enum: [INTERNAL_SERVER_ERROR],
  })
  @IsEnum([INTERNAL_SERVER_ERROR])
  message: string;
}

export class SuccessResponseDto {
  /**
   * The success message indicating the request was processed completely
   */
  @ApiProperty({
    description:
      'The success message indicating the request was processed completely',
    enum: [SUCCESS],
  })
  @IsEnum([SUCCESS])
  message: string;
}
