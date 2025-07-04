import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryOrderDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @IsString()
  @IsOptional()
  keyword?: string = '';

  @IsString()
  @IsIn(['all', 'delivered', 'created', 'confirmed', 'cancelled'])
  @IsOptional()
  filter?: string = 'all';

  @IsString()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortBy?: string = 'asc';

  @IsString()
  @IsIn(['createdAt', 'status', 'id'])
  @IsOptional()
  orderBy?: string = 'createdAt';
}
