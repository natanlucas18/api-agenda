import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class UnblockSlotDto {
  @ApiProperty({
    example: 'aaa-2dfkhg-t5lb',
    description: 'ID do profissional'
  })
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({ 
    example: '2025-12-05',
    description: 'Data do desbloqueio'
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;

  @ApiProperty({
    example: '14:00',
    description: 'Horário do desbloqueio'
  })
  @Matches(/^\d{2}:\d{2}$/)
  time: string;
}
