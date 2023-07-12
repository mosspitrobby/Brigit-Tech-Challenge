import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Guid } from 'typescript-guid';
import { ValidationError, validate } from 'class-validator';
import { paramCase } from 'param-case';
import { plainToInstance } from 'class-transformer';

/**
 * Validation pipe for DTO transformations
 */
@Injectable()
export class DTOValidationPipe implements PipeTransform<any> {
  /**
   * Creates an object out of a metatype
   * @param value
   * @param param1
   * @returns
   */
  async transform(
    value: any,
    { metatype }: ArgumentMetadata,
  ): Promise<Record<string, unknown>> {
    if (!value || !Object.keys(value).length) {
      return;
    }
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(
        this.formatErrors(errors),
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
  /**
   * Validates a metatype converted to an object
   * @param metatype
   * @returns {boolean}
   */
  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Date, Object, Guid];
    return !types.includes(metatype);
  }

  /**
   * Formats error message(s) if an object did not validate
   * @param errors
   * @returns {string}
   */
  formatErrors(validationErrors: ValidationError[]): string | string[] {
    if (!validationErrors?.length) {
      return;
    }
    const errors = [];
    validationErrors.forEach((error) => {
      const property = paramCase(error.property);
      let errorMessage;
      const keys = Object.keys(error.target);
      if (
        (keys.indexOf(error.property) === -1 && error.value === undefined) ||
        (keys.indexOf(error.property) > -1 &&
          (error.value === '' || error.value === 0))
      ) {
        errorMessage = `missing-${property}-error`;
      } else {
        errorMessage = `invalid-${property}-error`;
      }
      if (errors.indexOf(errorMessage) === -1) {
        errors.push(errorMessage);
      }
    });
    return errors.length === 1 ? errors[0] : errors;
  }
}
