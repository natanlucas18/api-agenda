import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Cristian',
    description: 'Nome do usuário',
    minLength: 3,
    maxLength: 155
  })
  @IsString()
  @MinLength(3)
  @MaxLength(155)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'cristian@email.com',
    description: 'E-mail do usuário'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '1234567',
    description: 'Senha do usuário'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  password: string;
}
