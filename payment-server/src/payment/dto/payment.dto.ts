import { IsNumber, IsString } from 'class-validate';

export class PaymentDto {
  @IsString({ len: 4, pattern: '/^\d+$/' })
  PIN: string;
}
