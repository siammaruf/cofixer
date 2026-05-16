import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqController } from './faq.controller';
import { FaqAdminController } from './faq.admin.controller';
import { FaqService } from './faq.service';
import { FaqRepository } from './faq.repository';
import { Faq } from './faq.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Faq])],
    controllers: [FaqController, FaqAdminController],
    providers: [FaqService, FaqRepository],
    exports: [FaqService, FaqRepository],
})
export class FaqsModule {}
