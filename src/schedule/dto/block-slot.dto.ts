import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, IsOptional, IsInt, Min } from 'class-validator';

export class BlockSlotDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({
    example: '2025-12-05',
    description: 'Data na qual deseja fazer o bloqueio do horário' 
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Formato inválido (YYYY-MM-DD)' })
  date: string;

  @ApiProperty({
    example: '14:00',
    description: 'Horário do bloqueio'
  })
  @Matches(/^\d{2}:\d{2}$/, { message: 'Formato inválido (HH:mm)' })
  time: string;

  @ApiProperty({
    example: 120,
    description: 'Duração do bloqueio(em minutos)',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({
    required: false,
    example: 'Horário de almoço',
    description: 'Motivo do bloqueio'
  })
  @IsOptional()
  reason?: string;
}
