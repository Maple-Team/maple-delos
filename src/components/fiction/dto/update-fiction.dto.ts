import { PartialType } from '@nestjs/mapped-types';
import { CreateFictionDto } from './create-fiction.dto';

export class UpdateFictionDto extends PartialType(CreateFictionDto) {}
