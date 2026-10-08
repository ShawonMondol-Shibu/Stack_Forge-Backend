import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  educationStatusEnum,
  educationTypeEnum,
} from '../entities/education.entity';

export class CreateEducationDto {
  @IsIn([...educationTypeEnum.enumValues], {
    message: `educationType must be one of: ${educationTypeEnum.enumValues.join(', ')}.`,
  })
  educationType!: (typeof educationTypeEnum.enumValues)[number];

  @IsString()
  @IsNotEmpty({ message: 'Institution name should not be left blank.' })
  institutionName!: string;

  @IsString()
  @IsOptional()
  institutionUrl?: string;

  @IsString()
  @IsOptional()
  institutionLogoUrl?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsNotEmpty({ message: 'Degree should not be left blank.' })
  degree!: string;

  @IsString()
  @IsOptional()
  fieldOfStudy?: string;

  @IsDateString({}, { message: 'startDate must be a valid ISO 8601 date.' })
  @IsOptional()
  startDate?: string;

  @IsDateString({}, { message: 'endDate must be a valid ISO 8601 date.' })
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  isCurrent?: boolean;

  @IsIn([...educationStatusEnum.enumValues], {
    message: `status must be one of: ${educationStatusEnum.enumValues.join(', ')}.`,
  })
  status!: (typeof educationStatusEnum.enumValues)[number];

  @IsString()
  @IsOptional()
  gradeValue?: string;

  @IsString()
  @IsOptional()
  gradeScale?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  activities?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsInt()
  @IsOptional()
  displayOrder?: number;
}
