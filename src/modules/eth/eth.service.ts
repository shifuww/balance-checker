import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { handleError } from 'src/shared/utils';

@Injectable()
export class EthService {
  private logger = new Logger(EthService.name);

  constructor(private readonly configService: ConfigService) {}

  public async getAddressWithMostChangedBalance() {
    try {
      this.logger.debug('Start getting address with most changed balance');

      const latestBlockNumber = await this.getLatestBlockNumber();
      const balanceChanges: Record<string, bigint> = {};

      for (let i = 0; i < 100; i++) {
        const block = await this.getBlockByNumber(latestBlockNumber - i);
        for (const tx of block.transactions) {
          const from = tx.from.toLowerCase();
          const to = tx.to?.toLowerCase();
          const value = BigInt(tx.value);

          balanceChanges[from] = (balanceChanges[from] || BigInt(0)) - value;

          if (to) {
            balanceChanges[to] = (balanceChanges[to] || BigInt(0)) + value;
          }
        }

        let maxChange = 0n;
        let maxAddress = '';
        for (const [address, change] of Object.entries(balanceChanges)) {
          const absoluteChange = change >= 0n ? change : -change;
          if (absoluteChange > maxChange) {
            maxChange = absoluteChange;
            maxAddress = address;
          }
        }

        return {
          address: maxAddress,
          balanceChange: balanceChanges[maxAddress].toString(),
        };
      }
    } catch (err) {
      handleError(err, this.getAddressWithMostChangedBalance.name, this.logger);
    }
  }

  private async getLatestBlockNumber(): Promise<number> {
    try {
      const url = this.configService.get<string>('ETHERSCAN_API_URL');
      const key = this.configService.get<string>('ETHERSCAN_API_KEY');
      this.logger.debug('Request latest block');
      const response = await axios.get(
        `${url}?module=proxy&action=eth_blockNumber&tag=latest&apikey=${key}`,
      );

      this.logger.log(`Request latest block status: ${response.status}`);

      if (response.status !== 200) {
        throw new BadRequestException(
          'Etherscan get latest block request is not valid!',
        );
      }

      return parseInt(response.data.result, 16);
    } catch (err) {
      handleError(err, this.getLatestBlockNumber.name, this.logger);
    }
  }

  private async getBlockByNumber(blockNumber: number) {
    try {
      const url = this.configService.get<string>('ETHERSCAN_API_URL');
      const key = this.configService.get<string>('ETHERSCAN_API_KEY');
      const hexBlockNumber = '0x' + blockNumber.toString(16);

      const response = await axios.get(
        `${url}?module=proxy&action=eth_getBlockByNumber&tag=${hexBlockNumber}&boolean=true&apikey=${key}`,
      );

      this.logger.log(`Get block by number status: ${response.status}`);

      if (response.status !== 200) {
        throw new BadRequestException(
          'Etherscan get block by number request is not valid!',
        );
      }

      return response.data.result;
    } catch (err) {
      handleError(err, this.getBlockByNumber.name, this.logger);
    }
  }
}
