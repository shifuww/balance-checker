import { ApiProperty } from '@nestjs/swagger';

export class MostChangedAddressDto {
  @ApiProperty({ description: 'Balance address', type: String })
  adress: string;

  @ApiProperty({ description: 'Balance change', type: BigInt })
  balanceChange: bigint;
}
