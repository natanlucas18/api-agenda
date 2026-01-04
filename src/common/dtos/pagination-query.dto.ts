import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
    @ApiPropertyOptional({
        example: 1,
        default: 1,
        description: 'Página atual',
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({
        example: 10,
        default: 10,
        description: 'Quantidade de itens por página',
        maximum: 100,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;

    @ApiPropertyOptional({
        example: 'Serviço X',
        description: 'Filtro de busca por um item específico',
    })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({
        example: 'UUID',
        description: 'Ordenar por um campo específico',
    })
    @IsString()
    @IsOptional()
    sortBy?: string = 'id';

    @ApiPropertyOptional({
        example: 'ASC',
        description: 'Ordenação do menor para o maior ou vice-versa'
    })
    @IsString()
    @IsOptional()
    sortOrder?: 'ASC' | 'DESC' = 'ASC';

}
