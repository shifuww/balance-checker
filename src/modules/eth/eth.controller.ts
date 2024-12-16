import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { EthService } from './eth.service';
import { MostChangedAddressDto } from './dtos';

@ApiTags('eth *** ETHERSCAN')
@Controller('eth')
export class EthController {
  constructor(private readonly service: EthService) {}

  @ApiOperation({ summary: 'Get most changed balance by ETHERSCAN' })
  @ApiResponse({ type: MostChangedAddressDto, status: 200 })
  @Get('most-changed-balance')
  public async getAddressWithMostChangedBalance() {
    return await this.service.getAddressWithMostChangedBalance();
  }
}
