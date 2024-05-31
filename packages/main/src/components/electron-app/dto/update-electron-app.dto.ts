import { PartialType } from '@nestjs/mapped-types';
import { CreateElectronAppDto } from './create-electron-app.dto';

export class UpdateElectronAppDto extends PartialType(CreateElectronAppDto) {}
