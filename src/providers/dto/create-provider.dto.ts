import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsObject,
} from 'class-validator';

export class CreateProviderDto {
  @ApiProperty({
    example: 'Alisson',
    description: 'Nome do profissional',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: `
Horários de trabalho do profissional organizados por dia da semana.

- A chave representa o dia da semana (exemplo: monday, tuesday...)
- O valor contém o horário de início e fim no formato HH:mm
`,
    example: {
      monday: {
        start: '08:00',
        end: '17:00',
      },
      tuesday: {
        start: '08:00',
        end: '17:00',
      },
      wednesday: {
        start: '09:00',
        end: '18:00',
      },
      friday: {
        start: '08:00',
        end: '12:00',
      },
    },
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        start: {
          type: 'string',
          example: '08:00',
          description: 'Horário de início do expediente (HH:mm)',
        },
        end: {
          type: 'string',
          example: '17:00',
          description: 'Horário de término do expediente (HH:mm)',
        },
      },
      required: ['start', 'end'],
    },
  })
  @IsNotEmpty()
  @IsObject()
  workingHours: Record<
    string,
    {
      start: string;
      end: string;
    }
  >;
}
