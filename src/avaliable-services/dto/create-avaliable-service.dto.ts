import { ApiProperty} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAvaliableServiceDto {
  @ApiProperty({
    example: 'Corte social',
    description: 'Nome do serviço',
    minLength: 3,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 45,
    description: 'Preço do serviço'
  })
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 30,
    description: 'Duraçao para efetuar o serviço (em minutos)'
  })
  @IsPositive()
  @IsNotEmpty()
  duration: number;
}
