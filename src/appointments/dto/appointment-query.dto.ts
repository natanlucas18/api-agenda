import { IsNumberString, IsOptional, IsString } from "class-validator";

export class AppointmentQueryDto {
    @IsNumberString()
    @IsOptional()
    page: number;

    @IsNumberString()
    @IsOptional()
    limit: number;

    @IsString()
    @IsOptional()
    search?: string;

    @IsString()
    @IsOptional()
    sortBy?: string = 'id';

    @IsString()
    @IsOptional()
    sortOrder?: 'ASC' | 'DESC' = 'ASC';
}