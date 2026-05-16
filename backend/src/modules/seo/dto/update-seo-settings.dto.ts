import { PartialType } from '@nestjs/swagger';
import { CreateSeoSettingsDto } from './create-seo-settings.dto';

export class UpdateSeoSettingsDto extends PartialType(CreateSeoSettingsDto) {}
