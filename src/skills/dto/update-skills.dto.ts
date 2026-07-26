import { PartialType } from '@nestjs/mapped-types';
import { CreateSkillsDto } from './create-skills.dto';

export class UpdateSkillsDto extends PartialType(CreateSkillsDto) {}
