import { Module } from '@nestjs/common';
import { EthService as Service } from './eth.service';
import { EthController as Controller } from './eth.controller';

@Module({
  controllers: [Controller],
  providers: [Service],
  exports: [Service],
})
export class EthModule {}
