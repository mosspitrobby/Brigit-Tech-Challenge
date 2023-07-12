import { ApplicantDto, FinancesDto, StockDto } from './submit.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  INVALID_APPLICANT_AGE_ERROR,
  INVALID_DATE_OF_BIRTH_ERROR,
} from 'src/common/response-messages';
import { randomBytes } from 'crypto';

const submittedData: Record<string, ApplicantDto> = {};

/**
 * Service for performing postal code lookups
 */
@Injectable()
export class SubmitService {
  /**
   * Verify a base64 image is a valid JPG, PNG or GIF image
   * @param base64 {String} The image data
   * @returns {boolean}
   */
  private async validateImageUpload(base64: string): Promise<boolean> {
    // TODO: verify the base 64 image is a JPEG, GIF or PNG image
    return base64?.length > 0;
  }

  /**
   * Computers the total stock vlaue by multiplying quantity of
   * stock by 18.  This is not a real value.
   * @param stock {StockDto} The stock information
   * @returns {number}
   */
  private async computeStockValue(stock: StockDto): Promise<number> {
    // TODO: implement an API lookup to fetch the value using
    // the API key provided in the `.env.localdev` file and
    // the documentation here: https://www.alphavantage.co/documentation/
    return stock.quantity * 18;
  }

  private async computeTotalAssets(finances: FinancesDto): Promise<number> {
    let total = finances.salaryPerQuarter * 4;
    for (const stock of finances.stock) {
      total += await this.computeStockValue(stock);
    }
    return total;
  }

  private async computeTotalLiabilities(
    finances: FinancesDto,
  ): Promise<number> {
    return (
      (finances.currentHomeLoanDebt ?? 0) + (finances.totalCreditCardDebt ?? 0)
    );
  }

  /**
   * Determines an applicant's loan eligibility based on their submitted
   * financial information
   * @param submitDto {SubmitDto} The payload information
   * @returns {number}
   */
  async determineEligiblity(applicantDto: ApplicantDto): Promise<boolean> {
    // verify the image
    const validImage = await this.validateImageUpload(applicantDto.license);
    if (!validImage) {
      // TODO: add an invalid image error to the DTO and Swagger definitions
      throw new Error('not-yet-implemented');
    }
    // verify the applicant's age
    if (!applicantDto?.dateOfBirth?.getFullYear) {
      throw new HttpException(
        INVALID_DATE_OF_BIRTH_ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }
    const age =
      new Date().getFullYear() - applicantDto.dateOfBirth.getFullYear();
    if (age < 18) {
      throw new HttpException(
        INVALID_APPLICANT_AGE_ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }
    // "save" their application, note that data will be lost when server restarts
    const id = randomBytes(4).toString('hex');
    submittedData[id] = applicantDto;
    // compute their loan eligibility
    const totalAssets = await this.computeTotalAssets(applicantDto.finances);
    const totalLiabilities = await this.computeTotalLiabilities(
      applicantDto.finances,
    );
    return totalAssets > totalLiabilities;
  }
}
