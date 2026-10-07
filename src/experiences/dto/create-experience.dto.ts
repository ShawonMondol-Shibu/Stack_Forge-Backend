import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty({ message: 'Company should not be left blank.' })
  company!: string;

  @IsString()
  @IsNotEmpty({ message: 'Position should not be left blank.' })
  position!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString({}, { message: 'startDate must be a valid ISO 8601 date.' })
  startDate!: string;

  @IsDateString({}, { message: 'endDate must be a valid ISO 8601 date.' })
  @IsOptional()
  endDate?: string | null;

  @IsBoolean()
  @IsOptional()
  isCurrent?: boolean;
}
