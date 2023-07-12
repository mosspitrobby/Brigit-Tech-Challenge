import { ApiProperty } from '@nestjs/swagger';
import { BridgitLogoBase64 } from '../../common/example.image';
import {
  INTERNAL_SERVER_ERROR,
  INVALID_APPLICANT_AGE_ERROR,
  INVALID_CREDIT_CARD_DEBT_AMOUNT_ERROR,
  INVALID_DATE_OF_BIRTH_ERROR,
  INVALID_FIRST_NAME_LENGTH,
  INVALID_HOME_LOAN_DEBT_AMOUNT_ERROR,
  INVALID_LAST_NAME_LENGTH,
  INVALID_LICENSE_UPLOAD_SIZE,
  INVALID_LOCATION_LENGTH,
  INVALID_SAVINGS_AMOUNT_ERROR,
  INVALID_STOCK_NAME_LENGTH,
  INVALID_STOCK_QUANTITY,
  MISSING_CREDIT_CARD_DEBT_AMOUNT_ERROR,
  MISSING_DATE_OF_BIRTH_ERROR,
  MISSING_FIRST_NAME_ERROR,
  MISSING_HOME_LOAN_DEBT_AMOUNT_ERROR,
  MISSING_LAST_NAME_ERROR,
  MISSING_LICENSE_UPLOAD_ERROR,
  MISSING_LOCATION_ERROR,
  MISSING_SAVINGS_AMOUNT_ERROR,
  MISSING_STOCK_NAME_ERROR,
  MISSING_STOCK_QUANTITY_ERROR,
  SUCCESS,
} from '../../common/response-messages';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * The stock definition for payload data
 */
export class StockDto {
  /**
   * The trading name of the stock's company
   */
  @ApiProperty({
    description: "The trading name of the stock's company",
  })
  @IsString()
  @Min(1, { message: INVALID_STOCK_NAME_LENGTH })
  @Max(50, { message: INVALID_STOCK_NAME_LENGTH })
  readonly name: string;
  /**
   * The quantity of stock the applicant owns
   */
  @IsInt()
  @Min(1, { message: INVALID_STOCK_QUANTITY })
  @Max(1000, { message: INVALID_STOCK_QUANTITY })
  @ApiProperty({
    description: 'The quantity of stock the applicant owns',
  })
  @Type(() => Number)
  readonly quantity: number;
}

/**
 * The financial information for payload data
 */
export class FinancesDto {
  /**
   * The applicant's salary per quarter
   */
  @ApiProperty({
    description: "The applicant's salary per quarter",
  })
  @IsInt()
  @Type(() => Number)
  readonly salaryPerQuarter: number;
  /**
   * The applicant's total credit card debt
   */
  @ApiProperty({
    description: "The applicant's total credit card debt",
  })
  @IsNumber()
  @Min(0, { message: INVALID_CREDIT_CARD_DEBT_AMOUNT_ERROR })
  @Type(() => Number)
  readonly totalCreditCardDebt: number;
  /**
   * The applicant's current home loan debt
   */
  @ApiProperty({
    description: "The applicant's current home loan debt",
  })
  @IsNumber()
  @Min(0, { message: INVALID_HOME_LOAN_DEBT_AMOUNT_ERROR })
  @Type(() => Number)
  readonly currentHomeLoanDebt: number;
  /**
   * The applicant's total savings
   */
  @ApiProperty({
    description: "The applicant's total savings",
  })
  @IsNumber()
  @Min(0, { message: INVALID_SAVINGS_AMOUNT_ERROR })
  @Type(() => Number)
  readonly totalSavings: number;
  /**
   * The stock the applicant owns
   */
  @ApiProperty({
    description: 'The stock the applicant owns',
    type: [StockDto],
  })
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => StockDto)
  readonly stock: StockDto[];
}

/**
 * The payload data for an applicant
 */
export class ApplicantDto {
  /**
   * The applicant's first name
   */
  @ApiProperty({
    description: "The applicant's first name",
    example: 'Joe',
  })
  @IsString()
  @MinLength(1, { message: INVALID_FIRST_NAME_LENGTH })
  @MaxLength(50, { message: INVALID_FIRST_NAME_LENGTH })
  readonly firstName: string;
  /**
   * The applicant's last name
   */
  @ApiProperty({
    description: "The applicant's last name",
    example: 'Smith',
  })
  @IsString()
  @MinLength(1, { message: INVALID_LAST_NAME_LENGTH })
  @MaxLength(50, { message: INVALID_LAST_NAME_LENGTH })
  readonly lastName: string;
  /**
   * The applicant's location
   */
  @ApiProperty({
    description: "The applicant's location",
    example: 'Canberra',
  })
  @IsString()
  @MinLength(1, { message: INVALID_LOCATION_LENGTH })
  @MaxLength(50, { message: INVALID_LOCATION_LENGTH })
  readonly location: string;
  /**
   * The applicant's date of birth
   */
  @ApiProperty({
    description: "The applicant's date of birth in YYYY-MM-DD format",
    example: '1999-12-03',
  })
  @Transform(({ value }) => (value && !isNaN(value) ? value : null))
  @IsDate()
  @Type(() => Date)
  readonly dateOfBirth: Date;
  /**
   * The applicant's license or ID in base64 string
   */
  @ApiProperty({
    description: "The applicant's license or ID in base64 string",
    default: BridgitLogoBase64,
  })
  @IsString()
  @MinLength(1, { message: INVALID_LICENSE_UPLOAD_SIZE })
  @MaxLength(5000000, { message: INVALID_LICENSE_UPLOAD_SIZE })
  readonly license: string;
  /**
   * The applicant's finances
   */
  @ApiProperty({
    description: "The applicant's finances",
  })
  @IsObject()
  readonly finances: FinancesDto;
}

/**
 * The response data
 */
export class SubmitResponseDto {
  /**
   * Success message indiciating the request completed
   */
  @ApiProperty({
    description: 'Success message indicating the request completed',
  })
  readonly message = SUCCESS;
  /**
   * The approve or deny status for the applicant's loan
   */
  @ApiProperty({
    description: "The approve or deny status for the applicant's loan",
  })
  readonly approved: boolean;
}

/**
 * Internal server error response
 */
export class InternalServerErrorResponseDto {
  /**
   * Failure message and reason
   */
  @ApiProperty({
    description: `Failure message and reason ${INTERNAL_SERVER_ERROR}`,
  })
  readonly message = INTERNAL_SERVER_ERROR;
}

const BAD_REQUEST_ERRORS = [
  INVALID_APPLICANT_AGE_ERROR,
  INVALID_CREDIT_CARD_DEBT_AMOUNT_ERROR,
  INVALID_DATE_OF_BIRTH_ERROR,
  INVALID_FIRST_NAME_LENGTH,
  INVALID_HOME_LOAN_DEBT_AMOUNT_ERROR,
  INVALID_LAST_NAME_LENGTH,
  INVALID_LOCATION_LENGTH,
  INVALID_SAVINGS_AMOUNT_ERROR,
  INVALID_STOCK_NAME_LENGTH,
  INVALID_STOCK_QUANTITY,
  INVALID_LICENSE_UPLOAD_SIZE,
  MISSING_CREDIT_CARD_DEBT_AMOUNT_ERROR,
  MISSING_DATE_OF_BIRTH_ERROR,
  MISSING_FIRST_NAME_ERROR,
  MISSING_HOME_LOAN_DEBT_AMOUNT_ERROR,
  MISSING_LAST_NAME_ERROR,
  MISSING_LOCATION_ERROR,
  MISSING_SAVINGS_AMOUNT_ERROR,
  MISSING_LICENSE_UPLOAD_ERROR,
  MISSING_STOCK_NAME_ERROR,
  MISSING_STOCK_QUANTITY_ERROR,
];

export class BadRequestErrorResponseDto {
  /**
   * Failure message and reason
   */
  @ApiProperty({
    description: 'Failure message and reason',
    enum: BAD_REQUEST_ERRORS,
  })
  @IsEnum(BAD_REQUEST_ERRORS)
  readonly message: string;
}
