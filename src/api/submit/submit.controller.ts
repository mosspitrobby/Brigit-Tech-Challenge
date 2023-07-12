import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApplicantDto,
  BadRequestErrorResponseDto,
  InternalServerErrorResponseDto,
  SubmitResponseDto,
} from './submit.dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
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
} from 'src/common/response-messages';
import { SubmitService } from './submit.service';
import { formatResponseTable } from 'src/common/swagger';

/**
 * Provides an API endpoint for users to get approval or denial status for a loan
 * based on the financial information they submit
 */
@Controller('submit')
export class SubmitController {
  /**
   * Initializes the controller
   * @param submitService {SubmitService} Processes the request
   */
  constructor(private readonly submitService: SubmitService) {}

  /**
   * Receives an applicant's financial information and evaluates their eligiblity for a loan
   * @param license {File} Scan or photo of their license
   * @param submitDto {SubmitDto} The applicant's personal and financial information
   * @returns {SubmitResponseDto}
   */
  @Post()
  @ApiTags('API Endpoints')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Receive and evaluate an applicant's financial information",
    description:
      "Saves an applicant's personal and financial information and evaluates whether their loan would be approved or rejected based on the submitted financial information.",
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: SubmitResponseDto,
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorResponseDto,
    description: `Returns \`${INTERNAL_SERVER_ERROR}\` when the result could not be computed`,
  })
  @ApiBadRequestResponse({
    type: BadRequestErrorResponseDto,
    description: formatResponseTable({
      [INVALID_APPLICANT_AGE_ERROR]: 'Applicant must be 18 years or older',
      [INVALID_CREDIT_CARD_DEBT_AMOUNT_ERROR]:
        'Credit card debt must be greater than or equal to 0',
      [INVALID_DATE_OF_BIRTH_ERROR]: 'Date of birth must be YYYY-MM-DD format',
      [INVALID_FIRST_NAME_LENGTH]:
        'Applicant first name must be between 1 - 50 characters',
      [INVALID_HOME_LOAN_DEBT_AMOUNT_ERROR]:
        'Credit card debt must be greater than or equal to 0',
      [INVALID_LAST_NAME_LENGTH]:
        'Applicant last name must be between 1 - 50 characters',
      [INVALID_LICENSE_UPLOAD_SIZE]:
        'Uploaded file must be 1000 to 5000000 bytes base64 string',
      [INVALID_LOCATION_LENGTH]:
        'Applicant location must be between 1 - 50 characters',
      [INVALID_SAVINGS_AMOUNT_ERROR]:
        'Credit card debt must be greater than or equal to 0',
      [INVALID_STOCK_NAME_LENGTH]:
        'Stock name must be between 1 - 50 characters',
      [INVALID_STOCK_QUANTITY]: 'Stock quantity must be between 1 and 1000',
      [MISSING_CREDIT_CARD_DEBT_AMOUNT_ERROR]:
        'Posted payload is missing credit card debt amount',
      [MISSING_DATE_OF_BIRTH_ERROR]: 'Posted payload is missing date of birth',
      [MISSING_FIRST_NAME_ERROR]: 'Posted payload is missing first name',
      [MISSING_HOME_LOAN_DEBT_AMOUNT_ERROR]:
        'Posted payload is missing home loan debt amount',
      [MISSING_LAST_NAME_ERROR]: 'Posted payload is missing last name',
      [MISSING_LICENSE_UPLOAD_ERROR]:
        'Posted payload is missing license upload',
      [MISSING_LOCATION_ERROR]: 'Posted payload is missing location',
      [MISSING_SAVINGS_AMOUNT_ERROR]:
        'Posted payload is missing savings amount',
      [MISSING_STOCK_NAME_ERROR]: 'Posted payload is missing stock name',
      [MISSING_STOCK_QUANTITY_ERROR]:
        'Posted payload is missing stock quantity',
    }),
  })
  @ApiBody({
    type: ApplicantDto,
  })
  async submit(@Body() applicantDto: ApplicantDto): Promise<SubmitResponseDto> {
    const approved = await this.submitService.determineEligiblity(applicantDto);
    return {
      message: SUCCESS,
      approved,
    };
  }
}
